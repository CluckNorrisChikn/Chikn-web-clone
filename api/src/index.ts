import express from 'express'
import morgan from 'morgan'
import SupplyRouter from './routes/SupplyRouter'
import MarketplaceRouter from './routes/MarketplaceRouter'
import ChiknDetailsRouter from './routes/ChiknDetailsRouter'

const app = express()
app.use(morgan('dev'))
const port = 3000

app.use(SupplyRouter)
app.use(MarketplaceRouter)
app.use(ChiknDetailsRouter)

app.listen(port, () => console.log(`server started port ${port}`))
