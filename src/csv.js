// Create CSV array
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

/**
 * 
 */
function createIndex (csv) {
  const result = {}
  let i = 0

  for (const tweet of csv) {
    if (tweet === undefined) {
      i += 1
      continue
    }
    const words = tweet[1].split(/\b/)

    // Iterate through each word
    words.forEach(word => {
      if (word.trim() !== '') {
        // Check if word already exists in the index
        if (result[word]) {
          result[word].push(i);
        } else {
          result[word] = [i];
        }
      }
    });

    i += 1
  }

  return result
}