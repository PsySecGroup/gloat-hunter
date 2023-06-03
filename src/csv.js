const csv = `
{{replaceMe}}
`.split('\n').map(line => {
  line = line.trim()
  if (line === '') {
    return
  }

  const parts = line.split('\t')
  return [new Date(parts[0]), (parts[1] || '').toLowerCase()]
})
