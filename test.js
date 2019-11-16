const assert = require('assert');
const { tableifyIssues } = require('./lib');

describe('Turns array of issues into rows of issues', function() {
  const config = [
    { id: '100', name: 'todo' },
    { id: '55', name: 'in-progress' },
    { id: '44', name: 'done' },
  ];

  const data = [
    {
      status: 'todo',
      number: '2',
      summary: 'another todo issue',
    },
    {
      status: 'todo',
      number: '3',
      summary: 'an issue that is not played.',
    },
    {
      status: 'done',
      number: '33',
      summary: 'all done...again!',
    },
    {
      status: 'in-progress',
      number: '343',
      summary: 'in progress issue.',
    },
    {
      status: 'done',
      number: '43',
      summary: 'all done!',
    },
  ];

  const result = [
    [
      '2: another todo issue',
      '343: in progress issue.',
      '33: all done...again!',
    ],
    ['3: an issue that is not', '', '43: all done!'],
  ];

  it('should return rows of issues.', function() {
    assert.deepEqual(tableifyIssues(data, config), result);
  });
});
