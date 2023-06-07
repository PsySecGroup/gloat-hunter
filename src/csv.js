const csv = `
{{replaceMe}}
`.split('\n')
.map(line => {
  line = line.trim()

  if (line === '') {
    return
  }

  const parts = line.split('\t')

  if (parts[5] === undefined) {
    // Accounting for empty tweets
    parts[5] = parts[4]
    parts[4] = parts[3]
    parts[3] = parts[2]
    parts[1] = ''
  }

  return [
    new Date(parts[0]), // creation time
    (parts[1] || '').trim().toLowerCase(), // tweet
    parseInt(parts[2].trim()), // replies
    parseInt(parts[3].trim()), // retweets
    parseInt(parts[4].trim()), // likes
    (parts[5] || '').trim()  // id
  ]
})