# sprint-cli

This projects provides some basic functionality to Jira from the command line via [Jira's API](https://developer.atlassian.com/cloud/jira/platform/rest/).

## Setup
1. Ensure the directory where `sprint-cli` is called from has a `.jira` file which contains the ID of the project in Jira.
2. Invoke `sprint-cli` and pass the username, password, and instance name as `ENV` variables: `instance=acme jirauser=someone@gmail.com password=$(gpg -qd ~/.jira-token.gpg) sprint-cli`. I recommend saving this as a shell alias to avoid lots of typing.
