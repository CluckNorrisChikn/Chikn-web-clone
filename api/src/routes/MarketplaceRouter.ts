import express, { Request, Response } from 'express'
import { supplyCache } from './Caches'

const MarketplaceRouter = express.Router()

MarketplaceRouter.get('/marketplace/list', async (req: Request, res: Response) => {
    // TODO implement
    res.setHeader('Cache-Control', 'public, s-max-age=15')
    res.json(supplyCache)
})

export default MarketplaceRouter
