const fs = require('fs')

/**
 * Basic sanity checks.
 */
if (process.env.NODE_ENV === 'production') {
  // check properties are configured for prod...
  const siteConfig = require('./site-config')
  if (siteConfig.useAvaxTestnet) throw new Error('SafetyCheck: Hey! Don\'t use testnet in PROD!')
  if (siteConfig.includePrivatePages) throw new Error('SafetyCheck: Hey! Don\'t show private pages in PROD!')

  // check correct page generators are used...
  if (!fs.existsSync('src/pages/chikn/{CombinationsJson.token}.jsx')) {
    console.warn('SafetyCheck: Generating ALL pages for PROD!')
    fs.renameSync('src/pages/chikn/{CombinationsTenJson.token}.jsx', 'src/pages/chikn/{CombinationsJson.token}.jsx')
  }

  console.log('SafetyCheck: looks good.')
} else {
  console.log('SafetyCheck: not prod, do what you want.')
}
