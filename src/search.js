const quotes = /'|"/g
const removeUsers = /\@[^\s\n]+/g
const removeHash = /\#[^\s\n]+/g
const wordIndex = createIndex(csv)
const wordIndexKeys = Object.keys(wordIndex)
const queryHelpButton = document.getElementById('queryHelpButton');
const queryHelp = document.getElementById('queryHelp');
let searchTimeout

/**
 * Conduct search with each character change
 */
const searchInput = document.getElementById('search')
const searchResults = document.getElementById('results')

/**
 * 
 */
function performSearch (value) {
  if (value === '') {
    return
  }

  searchResults.innerHTML = ``

  const candidates = []

  const words = value.trim().toLowerCase().split(/ OR /ig)
  const queryRegex = new RegExp(words.join('|').replace(quotes, ''), 'gi')

  for (query of words) {
    const withoutQuotes = query.replace(quotes, '')
    const indexMatches = wordIndexKeys
      .filter(key => {
        if (query[0] === '"' || query[0] === `'`) {
          return key === withoutQuotes
        } else {
          return key.indexOf(query) === 0  
        }
        
      })
      .map(key => wordIndex[key])

    const tweetIds = [...new Set(indexMatches.flat())]; 

    for (const tweetId of tweetIds) {
      const tweet = csv[tweetId]

      if (tweet === undefined) {
        continue
      }

      const strippedWords = words.map(word => word.replace(quotes, ''))
      candidates.push([
        tweet[0],
        tweet[1]
          .replace(removeUsers, '')
          .replace(removeHash, '')
          .replace(queryRegex, match => {
            const index = strippedWords.indexOf(match);

            if (index >= 0) {
              return `<span class="highlight">${strippedWords[index]}</span>`;
            }

            return match;                
          })
      ])  
    }
  }

  candidates.sort((a, b) => a[0] - b[0])

  let result = ``
  for (const candidate of candidates) {
    result += `<tr>
    <td>${candidate[0].getFullYear()}</td>
    <td>${candidate[0].getMonth() + 1}</td>
    <td>${candidate[0].getDate()}</td>
    <td>${candidate[0].toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
    <td>${candidate[1]}</td>
  </tr>`
  }

  searchResults.innerHTML = `<thead><tr>
    <td>Year</td>
    <td>Month</td>
    <td>Day</td>
    <td>Time</td>
    <td>Text</td>
  </tr></thead><tbody>${result}</tbody>`
}

queryHelpButton.addEventListener('mouseover', () => {
  queryHelp.classList.add('visible');
});

queryHelpButton.addEventListener('mouseout', () => {
  queryHelp.classList.remove('visible');
});

searchInput.onkeyup = function search (e) {
  const value = e.target.value.toLowerCase()
  if (value === '') {
    return
  }

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(() => {
    performSearch(value)
  }, 300)
}
