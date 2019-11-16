const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { table } = require('table');
const username = process.env.jirauser;
const password = process.env.password;
const urlBase = `https://${process.env.instance}.atlassian.net/rest/agile/1.0/board`;

const id = fs
  .readFileSync('.jira')
  .toString()
  .trim();

const sprint = `${urlBase}/${id}/sprint`;
const config = `${urlBase}/${id}/configuration`;

const getConfig = async () => {
  const data = await axios(config, {
    auth: {
      username,
      password,
    },
  });
  return data.data.columnConfig.columns.map(x => {
    return {
      id: x.statuses[0].id,
      name: x.name,
    };
  });
};

const getSprint = async () => {
  const data = await axios(sprint, {
    auth: {
      username,
      password,
    },
  });
  return data.data.values.filter(x => x.state === 'active')[0].id;
};

const getIssues = async url => {
  const data = await axios(url, {
    auth: {
      username,
      password,
    },
  });

  return data.data.issues.map(issue => {
    return {
      number: issue.key,
      status: issue.fields.status.name,
      summary: issue.fields.summary,
    };
  });
};

const main = async () => {
  const config = await getConfig();
  const sprint = await getSprint();
  const issueUrl = `${urlBase}/${id}/sprint/${sprint}/issue`;
  const issues = await getIssues(issueUrl);
  const topRow = config.map(x => x.name);
  const issueRows = tableifyIssues(issues, config);
  console.log(table([topRow, ...issueRows]));
};

const tableifyIssues = (issues, config) => {
  const board = [];
  const grouped = config.map(x => issues.filter(y => x.name === y.status));
  const maxY = grouped.reduce((acc, x) => (x.length > acc ? x.length : acc), 0);
  const maxX = config.length;

  for (var count = 0; count < maxY; count++) {
    const row = [];
    for (var col = 0; col < maxX; col++) {
      if (!grouped[col][count]) {
        row.push('');
      } else {
        row.push(
          `${grouped[col][count].number}: ${grouped[col][
            count
          ].summary.substring(0, 20)}`
        );
      }
    }
    board.push(row);
  }
  return board;
};

module.exports.main = main;
module.exports.tableifyIssues = tableifyIssues;
