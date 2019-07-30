import jsSHA3 from 'js-sha3'
import { isEncodedLabelhash, decodeLabelhash } from '@ensdomains/ui'

function getLabels() {
  return JSON.parse(localStorage.getItem('labels')) || {}
}

function _saveLabel(hash, label) {
  const labels = getLabels()
  localStorage.setItem(
    'labels',
    JSON.stringify({
      ...labels,
      [hash]: label
    })
  )
  return hash
}

export function saveLabel(label) {
  try {
    const hash = `${jsSHA3.keccak256(label.toLowerCase())}`
    return _saveLabel(hash, label)
  } catch (e) {
    throw e
  }
}

export function saveName(name) {
  const nameArray = name.split('.')
  nameArray.forEach(label => {
    saveLabel(label)
  })
}

export function checkLabel(hash) {
  const labels = getLabels()
  if (isEncodedLabelhash(hash)) {
    return labels[decodeLabelhash(hash)]
  }

  if (hash.startsWith('0x')) {
    return labels[`${hash.slice(2)}`]
  }
}

export function decryptName(name) {
  return name
    .split('.')
    .map(label => checkLabel(label) || label)
    .join('.')
}

export function checkLocalStorageSize() {
  var allStrings = ''
  for (var key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      allStrings += window.localStorage[key]
    }
  }
  return allStrings
    ? 3 + (allStrings.length * 16) / (8 * 1024) + ' KB'
    : 'Empty (0 KB)'
}
