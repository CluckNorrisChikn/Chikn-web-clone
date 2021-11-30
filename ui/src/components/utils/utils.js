/**
 * Checks if two string arrays are NOT equal.
 * @param {string[]} s1
 * @param {string[]} s2
 * @returns
 */
export const stringArraysNotEqual = (s1, s2) => {
  if (!Array.isArray(s1) || !Array.isArray(s2)) {
    return s1 !== s2
  }
  return s1.length !== s2.length || s1.sort().join(',') !== s2.sort().join(',')
}
