
/**
 * Basic sanity checks.
 */
if (process.env.NODE_ENV === 'production') {
  const siteConfig = require('./site-config')
  if (siteConfig.useAvaxTestnet) throw new Error('SafetyCheck: Hey! Don\'t use testnet in PROD!')
  if (siteConfig.includePrivatePages) throw new Error('SafetyCheck: Hey! Don\'t show private pgaes in PROD!')
  console.log('SafetyCheck: looks good.')
} else {
  console.log('SafetyCheck: not prod, do what you want.')
}
