const csv = `
{{replaceMe}}
`.split('\n').map(line => {
  line = line.trim()

  if (line === '') {
    return
  }

  const parts = line.split('\t')
  console.log(line)
  console.log(parts)
  return [
    new Date(parts[0]), // creation time
    (parts[1] || '').trim().toLowerCase(), // tweet
    parseInt(parts[2].trim()), // replies
    parseInt(parts[3].trim()), // retweets
    parseInt(parts[4].trim()), // likes
    (parts[5] || '').trim()  // id
  ]
})
