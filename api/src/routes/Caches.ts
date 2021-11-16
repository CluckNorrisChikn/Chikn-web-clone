
import ChickenContract from '../contracts/ChickenContract'
const CronJob = require('cron').CronJob

export const supplyCache = {
    mintedCount: 0,
    totalCount: 0
}

const useTestnet = false
const mainnet = new ChickenContract(useTestnet)
new CronJob('*/15 * * * * *', async () => { supplyCache.mintedCount = await mainnet.mintedCount() }, null, true, 'Australia/Sydney').start()
new CronJob('*/15 * * * * *', async () => { supplyCache.totalCount = await mainnet.totalCount() }, null, true, 'Australia/Sydney').start()
