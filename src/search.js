const quotes = /'|"/g
const removeUsers = /\@[^\s\n]+/g
const removeHash = /\#[^\s\n]+/g
const queryHelpButton = document.getElementById('queryHelpButton');
const queryHelp = document.getElementById('queryHelp');

let searchTimeout

/**
 * Conduct search with each character change
 */
const searchInput = document.getElementById('search')
searchInput.focus()
const searchResults = document.getElementById('results')

const operators = {
  OR: '|',
  AND: '(?=.*',
  NOT: '(?!.*'
};

const queries = {
  location: '"i live" OR "my house" OR "my home" OR "my apartment" OR "my condo"'
}

const buttons = {
  locationQuery: 'location'
}

/**
 * 
 */
function setQuery(query) {
  searchInput.value = query
  performSearch(query)
}

/**
 * 
 */
function getCount (query) {
  return performSearch(query, true)
}

/**
 * 
 */
function getRegex(str) {
  const regexParts = [];
  const words = str.split(/\s+/);

  let isInPhrase = false;
  let isConditional = false
  let currentPhrase = '';

  let i = 0
  for (const word of words) {
    if (word.startsWith('"')) {
      if (word.endsWith('"')) {
        const phrase = word.slice(1, -1);
        regexParts.push(`\\b${phrase.replace(/"/g, '\\"')}\\b`);
      } else {
        isInPhrase = true;
        currentPhrase = word.slice(1);
      }
    } else if (isInPhrase && word.endsWith('"')) {
      isInPhrase = false;
      currentPhrase += ' ' + word.slice(0, -1);
      regexParts.push(`\\b${currentPhrase.replace(/"/g, '\\"')}\\b`);
    } else if (isInPhrase) {
      currentPhrase += ' ' + word;
    } else if (Object.keys(operators).includes(word)) {
      if (i < words.length - 1) {
        regexParts.push(operators[word]);
        if (word === 'AND' || word === 'NOT') {
          isConditional = true
        }
      }
    } else {
      regexParts.push(word);
      if (isConditional) {
        regexParts.push(')')
        isConditional = false
      }
    }
    i += 1
  }

  if (isConditional) {
    regexParts.push(')')
    isConditional = false
  }

  const regexString = regexParts.join('');
  const regex = new RegExp(regexString, 'i');

  return regex;
}

/**
 * 
 */
function performSearch (value, countOnly = false) {
  if (value === '') {
    return
  }

  searchResults.innerHTML = ``

  const candidates = []
  const queryRegex = getRegex(value.trim())

  for (const tweet of csv) {
    if (tweet === undefined) {
      continue
    }

    const matches = tweet[1].match(queryRegex)
  
    if (matches !== null) {
      if (countOnly) {
        candidates.push(true)
      } else {
        candidates.push([
          tweet[0],
          tweet[1]
            .replace(removeUsers, '')
            .replace(removeHash, '')
        ])
      }
    }
  }

  if (countOnly) {
    return candidates.length
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
  const value = e.target.value
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

for (const button of Object.keys(buttons)) {
  const count = performSearch(queries[buttons[button]], true)
  document.getElementById(button).innerHTML = `(${count})`
}
