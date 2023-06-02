const characters = [];
const seed = 'random_id'

// Numbers
for (var i = 48; i <= 57; i++) {
  characters.push(String.fromCharCode(i));
}

// Uppercase
for (var i = 65; i <= 90; i++) {
  characters.push(String.fromCharCode(i));
}

// Lowercase
for (var i = 97; i <= 122; i++) {
  characters.push(String.fromCharCode(i));
}

function getHash(text, cipher) {
  const cipherLength = cipher.length;
  let accumulator = 0
  let result = '';
  
  for (var i = 0; i < text.length; i++) {
    const index = characters.indexOf(text[i])
    const charValue = index > -1 
      ? text.charCodeAt(i) * (index + 1)
      : i * i
    accumulator += charValue
    const cipherIndex = ((i * charValue) ^ (accumulator * cipherLength * seed)) % cipherLength
    const cipherCharValue = cipher.charCodeAt(cipherIndex) || i;
    const newCharacter = characters[(charValue * cipherCharValue) % characters.length]
    result += newCharacter
  }

  return result;
}
