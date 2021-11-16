import express, { Request, Response } from 'express'
import ChickenContract from '../ChickenContract'
const CronJob = require('cron').CronJob

const ChickenContractCacheRouter = express.Router()

const supplyCache = {
    mintedCount: 0,
    totalCount: 0
}

const useTestnet = false
const mainnet = new ChickenContract(useTestnet)
new CronJob('*/15 * * * * *', async () => { supplyCache.mintedCount = await mainnet.mintedCount() }, null, true, 'Australia/Sydney').start()
new CronJob('*/15 * * * * *', async () => { supplyCache.totalCount = await mainnet.totalCount() }, null, true, 'Australia/Sydney').start()

ChickenContractCacheRouter.get('/mainnet/supply', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, s-max-age=15')
    res.json(supplyCache)
})

export default ChickenContractCacheRouter
