import express, { Request, Response } from 'express'
import { supplyCache } from './Caches'

const SupplyRouter = express.Router()

SupplyRouter.get('/supply', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, s-max-age=15')
    res.json(supplyCache)
})

export default SupplyRouter
