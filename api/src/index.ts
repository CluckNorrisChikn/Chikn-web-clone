import express from 'express'
import morgan from 'morgan'
import ChickenContractCacheRouter from './routes/ChickenContractCacheRouter'

const app = express()
app.use(morgan('dev'))
const port = 3000

app.use(ChickenContractCacheRouter)

app.listen(port, () => console.log(`server started port ${port}`))
