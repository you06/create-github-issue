module.exports.getConfig = function(args) {
  const config = {
    token: args.token || '',
    issues: args.issues || '',
    owner: args.owner || '',
    repo: args.repo || '',
    labels: args.labels || '',
    milestone: args.milestone || ''
  }

  if (config.milestone !== '') {
    config.milestone = parseInt(config.milestone)
  } else {
    config.milestone = 0
  }
  return config
}
