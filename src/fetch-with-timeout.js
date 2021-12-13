export const fetchWithTimeout = (url, options, timeout = 10000) => Promise.race([
  fetch(url, options),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Dug request timed out.')), timeout))
])
