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

const queries = {
  location: '"i live" OR "house" OR "home" OR "apartment" OR "condo" OR "residence" OR "dwelling" OR "residence" OR "reside" OR "inhabit" OR "occupy" OR "lay my head" OR "haven" OR "shelter" OR "shelters" OR "comfort" OR "walls" OR "personalize" OR "style" OR "refuge" OR "abode" OR "property" OR "living" OR "sanctuary" OR "space"',
  family: '"family" OR "daughter" OR "son" OR "wife" OR "husband" OR "uncle" OR "aunt" OR "uncles" OR "aunts" OR "mother" OR "father" OR "siblings" OR "sibling" OR "grandparent" OR "grandparents" OR "cousin" OR "cousins" OR "nephew" OR "nephews" OR "niece" OR "nieces" OR "relatives" OR "in-laws" OR "loved ones" OR "spouse" OR "partner" OR "partners" OR "children" OR "parents" OR "brother" OR "brothers" OR "sister" OR "sisters" OR "grandchildren" OR "parents-in-law" OR "sibling-in-law" OR "stepfamily" OR "kinfolk" OR "kin" OR "close ones" OR "blood relatives" OR "domestic" OR "significant other" OR "better half" OR "soulmate" OR "guardian" OR "marriage" OR "maternal" OR "paternal" OR "kinship"',
  biometrics: '"heart rate" OR "fingerprint" OR "iris" OR "blood" OR "hair" OR "DNA" OR "biometric" OR "biometrics" OR "retina" OR "facial" OR "voiceprint" OR "voice" OR "palm" OR "hand" OR "signature dynamics" OR "gait" OR "vein" OR "ear" OR "body" OR "keystroke" OR "keystrokes" OR "brainwave" OR "brain" OR "skin" OR "tattoo" OR "tattoos" OR "scars" OR "scar" OR "birthmarks" OR "birthmark" OR "biological" OR "biology" OR "bio" OR "genetic" OR "genomics" OR "genomic" OR "heredity" OR "ancestor" OR "gene" OR "genotype" OR "phenotype" OR "23andme"',
  finance: '"bank" OR "money" OR "finance" OR "debt" OR "debt" OR "mortgage" OR "mortgages" OR "loan" OR "loans" OR "credit" OR "savings" OR "investment" OR "income" OR "expenses" OR "budget" OR "budgets" OR "financial" OR "financials" OR "finances" OR "stability" OR "stable" OR "goals" OR "goal" OR "planning" OR "manage" OR "responsibility" OR "success" OR "freedom" OR "security" OR "independence" OR "assets" OR "assets" OR "liabilities" OR "liability" OR "obligations" OR "obligation" OR "commitments" OR "commitment" OR "resources" OR "resource" OR "accounts" OR "account" OR "transactions" OR "transaction" OR "statements" OR "statement" OR "portfolio" OR "portfolios" OR "investments" OR "investment" OR "performance" OR "performances" OR "growth" OR "returns" OR "markets" OR "market" OR "regulations" OR "regulation" OR "law" OR "laws" OR "legal" OR "lawyer" OR "lawyers" OR "risks" OR "risk" OR "rewards" OR "reward" OR "trends" OR "trend" OR "advice" OR "experts" OR "experts" OR "tips" OR "top" OR "motivations" OR "motivation"',
  health: '"breakthrough" OR "breakthroughs" OR "clinical" OR "condition" OR "conditions" OR "device" OR "devices" OR "diagnosis" OR "disease" OR "diseases" OR "doctor" OR "doctors" OR "health" OR "health care" OR "healthcare" OR "hospital" OR "hospitals" OR "illness" OR "illnesses" OR "injuries" OR "injury" OR "insurance" OR "lab" OR "laboratories" OR "laboratory" OR "labs" OR "medical" OR "medication" OR "medications" OR "medicine" OR "nurse" OR "nurses" OR "physician" OR "physicians" OR "prescription" OR "prescriptions" OR "research" OR "studies" OR "study" OR "symptom" OR "symptoms" OR "treatment" OR "treatments" OR "trial" OR "trials" OR "wellness"',
  personality: '"admiration" OR "admire" OR "admire" OR "adoration" OR "adore" OR "adores" OR "affinity" OR "aim" OR "ambition" OR "appetite" OR "appreciate" OR "appreciation" OR "approve of" OR "apt" OR "aspiration" OR "attitude" OR "attracted" OR "attraction" OR "belief" OR "beliefs" OR "cherish" OR "consider" OR "crave" OR "craving" OR "desire" OR "disposed" OR "dream" OR "drive" OR "enjoy" OR "enjoyment" OR "esteem" OR "fascination" OR "favor" OR "fondness" OR "goal" OR "hankering" OR "hope" OR "hunger" OR "i believe" OR "i like" OR "i think" OR "inclination" OR "inclined" OR "intent" OR "intention" OR "likely" OR "liking" OR "long for" OR "longing" OR "motive" OR "objective" OR "obsess" OR "obsession" OR "opinion" OR "passion" OR "penchant" OR "perspective" OR "predilection" OR "predisposed" OR "prefer" OR "preference" OR "prize" OR "proclivity" OR "prone" OR "propensity" OR "purpose" OR "respect" OR "soft spot" OR "tendency" OR "thirst" OR "treasure" OR "urge" OR "value" OR "view" OR "want" OR "weak" OR "weakness" OR "wish" OR "yearn" OR "yearning"',
  online: '"ip" OR "ips" OR "email" OR "emails" OR "dns" OR "isp" OR "vpn" OR "vpns" OR "proxy" OR "proxies" OR "social media" OR "socials" OR "voip" OR "phone" OR "website" OR "domain" OR "web" OR "host" OR "hosting" OR "hosts" OR "server" OR "servers" OR "cloud" OR "presence" OR "identity" OR "privacy" OR "security" OR "communication" OR "comm" OR "comms" OR "account" OR "accounts" OR "profiles" OR "profile" OR "platforms" OR "platform" OR "ban" OR "mute" OR "muting" OR "muted" OR "banned" OR "banning" OR "bans" OR "block" OR "blocked" OR "blocking" OR "blocks" OR "mutuals" OR "cookie" OR "cookies" OR "analytics" OR "analytic" OR "ios" OR "android" OR "chrome" OR "firefox" OR "microsoft" OR "windows" OR "unix" OR "linux" OR "debian" OR "centos" OR "scam" OR "scans" OR "fraud" OR "hacking" OR "hacks" OR "hack" OR "hacked" OR "viruses" OR "virus" OR "malware" OR "phishing" OR "phish" OR "backups" OR "backup" OR "storage" OR "documents" OR "document" OR "desktop" OR "files" OR "file" OR "sharing" OR "downloads" OR "download" OR "uploads" OR "upload" OR "streaming" OR "stream" OR "streams" OR "gaming" OR "game" OR "stream" OR "playstation" OR "ps5" OR "amazon" OR "content" OR "videos" OR "video" OR "music" OR "@"',
  education: '"college" OR "colleges" OR "education" OR "educate" OR "graduated" OR "graduate" OR "graduates" OR "profession" OR "science" OR "sciences" OR "research" OR "academia" OR "white paper" OR "white papers" OR "student" OR "students" OR "university" OR "universities" OR "degree" OR "degrees" OR "school" OR "schools" OR "classroom" OR "classrooms" OR "study" OR "studies" OR "studing" OR "learning" OR "learn" OR "learns" OR "learned" OR "knowledge" OR "curriculum" OR "curriculums" OR "coursework" OR "course" OR "courses" OR "assignment" OR "assignments" OR "homework" OR "exam" OR "exams" OR "test" OR "tests" OR "grade" OR "academic" OR "lecture" OR "lectures" OR "professor" OR "professors" OR "teacher" OR "teachers" OR "instructor" OR "instructors" OR "classmate" OR "classmates" OR "mentor" OR "mentors" OR "major" OR "minor" OR "field" OR "fields" OR "subject" OR "subjects" OR "specialization" OR "thesis" OR "dissertation" OR "dissertations" OR "paper" OR "papers" OR "publication" OR "journal" OR "journals" OR "conference" OR "conferences" OR "scholarship" OR "scholarships" OR "fellowship" OR "fellowships"',
  employment: '"a year" OR "benefits" OR "boss" OR "bosses" OR "burnout" OR "career" OR "careers" OR "colleague" OR "colleagues" OR "coworker" OR "coworkers" OR "culture" OR "deadline" OR "deadlines" OR "demotion" OR "discrimination" OR "employed" OR "employment" OR "evaluation" OR "fire" OR "fired" OR "flexibility" OR "flexible" OR "harassed" OR "harassment" OR "hire" OR "hired" OR "hours" OR "income" OR "insurance" OR "job" OR "late" OR "manager" OR "managers" OR "maternity" OR "occupation" OR "office" OR "overtime" OR "parental" OR "paternity" OR "pay" OR "pension" OR "performance" OR "productive" OR "productivity" OR "profession" OR "promotion" OR "regulations" OR "remote" OR "responsibile" OR "responsibilities" OR "retire" OR "retirement" OR "retiring" OR "review" OR "reviews" OR "safety" OR "salary" OR "schedule" OR "schedules" OR "shift" OR "shifts" OR "sick" OR "social security" OR "stress" OR "supervisor" OR "supervisors" OR "support" OR "tasks" OR "team" OR "telecommute" OR "time off" OR "training" OR "unemployed" OR "unemployment" OR "union" OR "vacation" OR "wage" OR "wages" OR "work" OR "workload" OR "workplace"',
  content: '"http" OR "https" OR "share" OR "lol" OR "lmao" OR "hilarious" OR "funny" OR "entertainment" OR "media" OR "content" OR "videos" OR "video" OR "movies" OR "movie" OR "shows" OR "show" OR "series" OR "music" OR "songs" OR "song" OR "albums" OR "album" OR "podcasts" OR "podcast" OR "audiobooks" OR "audiobook" OR "comedy" OR "drama" OR "action" OR "romance" OR "thriller" OR "horror" OR "documentaries" OR "documentary" OR "news" OR "articles" OR "article" OR "blogs" OR "blog" OR "reviews" OR "critics" OR "opinions" OR "recommendations" OR "favorites" OR "trends" OR "trending" OR "trend" OR "viral" OR "memes" OR "meme" OR "internet" OR "social media" OR "platforms" OR "YouTube" OR "Netflix" OR "Amazon Prime" OR "Hulu" OR "Spotify" OR "Apple" OR "Podcast" OR "podcasts" OR "Book" OR "books" OR "E-book" OR "ebook" OR "Magazine" OR "magazines" OR "Newspaper" OR "Streaming" OR "Binge" OR "Watching" OR "Listening" OR "Reading" OR "Engaging" OR "Consuming" OR "Sharing" OR "Discussing" OR "Commenting" OR "Rating" OR "Reviewing" OR "Interacting" OR "Subscribing" OR "Following" OR "Trending" OR "Exploring" OR "Discovering" OR "Curating" OR "Curation" OR "Personalization" OR "Recommendation" OR "Algorithm" OR "Diversifying" OR "Broadening" OR "Narrowing" OR "Filtering" OR "Engagement" OR "Attention" OR "Interest" OR "Preference" OR "Taste" OR "Enjoyment" OR "Escapism" OR "Entertainment"'
}

// Load common query buttons

const commonQueries = document.getElementById('commonQueries')
let commonQueryButtons = ''

for (const key of Object.keys(queries)) {
  const formalName = key[0].toUpperCase() + key.substring(1)
  const query = queries[key]
  const count = performSearch(query, true)
  commonQueryButtons += `<button class="button" onClick="setQuery(queries.${key});">
  ${formalName} (${count})
</button>`
  
}

commonQueries.innerHTML = commonQueryButtons
