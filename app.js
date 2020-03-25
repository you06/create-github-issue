const { Octokit } = require('@octokit/rest')
const fs = require('fs')
const util = require('util')
const { getConfig } = require('./config')

main()

async function main() {
  const args = getConfig(parseArgs())

  const { token, owner, repo, issues: issuesPath, labels, milestone } = args

  if (token == '') {
    console.log('-token can not be empty')
    return
  }
  if (owner == '') {
    console.log('-owner can not be empty')
    return
  }
  if (repo == '') {
    console.log('-repo can not be empty')
    return
  }
  if (issuesPath == '') {
    console.log('-issues can not be empty')
    return
  }

  const octokit = new Octokit({
    auth: token
  })

  const content = await util.promisify(fs.readFile)(issuesPath)
  const issues = content.toString().split('\n\n').map(i => i.trim()).filter(i => i !== '')

  for (const issue of issues) {
    const title = issue.split('\n')[0]
    const body = issue.split('\n').splice(1).join('\n')
    await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels: labels.split(','),
      milestone: milestone !== 0 || undefined
    })
  }
}

function parseArgs() {
  const args = {}
  let key = ''
  for (const item of process.argv) {
    if (item === '-h') {
      printHelp()
    }
    if (key !== '') {
      args[key] = item
      key = ''
      continue
    }
    if (item.startsWith('-')) {
      key = item.slice(1)
    }
  }
  return args
}

function printHelp() {
  console.log(`create issue usage
-token github token
-owner repo owner
-repo repo name
-issues issues file
-labels labels, split with ",", optional
-milestone milestone number, optional`)

  process.exit(0)
}
