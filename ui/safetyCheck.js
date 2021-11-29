
/**
 * Basic sanity checks.
 */
if (process.env.NODE_ENV === 'production') {
  // check properties are configured for prod...
  const siteConfig = require('./site-config')
  if (siteConfig.useAvaxTestnet) throw new Error('SafetyCheck: Hey! Don\'t use testnet in PROD!')
  if (siteConfig.includePrivatePages) throw new Error('SafetyCheck: Hey! Don\'t show private pages in PROD!')

  // check correct page generators are used...
  if (!require('fs').existsSync('src/pages/chikn/{CombinationsJson.token}.jsx')) throw new Error('SafetyCheck: Hey! You must generate ALL pages for PROD!')

  console.log('SafetyCheck: looks good.')
} else {
  console.log('SafetyCheck: not prod, do what you want.')
}
