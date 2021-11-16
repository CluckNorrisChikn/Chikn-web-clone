
import ChickenContract from '../contracts/ChickenContract'
const CronJob = require('cron').CronJob

const FormatAvaxPrice = (price) => {
    return parseInt(price) / Math.pow(10, 18)
}
interface ChiknSummary {
    token: String
    filename: String
    owner: String
    forSale: Boolean
    previousPrice: Number
    salePrice: Number
}

export const marketCache = {
    chiknsForSale: [] as ChiknSummary[]
}

export const supplyCache = {
    mintedCount: 0,
    totalCount: 0,
    floorPrice: 0
}

const useTestnet = false
const mainnet = new ChickenContract(useTestnet)
new CronJob('*/15 * * * * *', async () => { supplyCache.mintedCount = await mainnet.mintedCount() }, null, true, 'Australia/Sydney').start()
new CronJob('*/15 * * * * *', async () => { supplyCache.totalCount = await mainnet.totalCount() }, null, true, 'Australia/Sydney').start()
new CronJob('0 */5 * * * *', async () => {
    const tokenForSale = await mainnet.allForSale()
    const saletokens = tokenForSale.filter((t) => t > 0).map(t => Number(t))
    console.log('tokenForSale', saletokens.length)
    const workingForSale = []
    for (let i = 0; i < saletokens.length; i++) {
        try {
            const forSale = await mainnet.getChikn(saletokens[i])
            console.log('for each', `${i} / ${saletokens.length}`)
            workingForSale.push({
                owner: forSale.currentOwner,
                forSale: forSale.forSale,
                previousPrice: FormatAvaxPrice(forSale.previousPrice),
                salePrice: FormatAvaxPrice(forSale.price),
                token: forSale.tokenId.toString()
            })
        } catch (err) {
            console.log('Error fetching data', err)
        }
    }
    console.log('total sale', workingForSale)
    workingForSale.sort((a, b) => {
        const priceA = a.salePrice
        const priceB = b.salePrice
        if (priceA > priceB) return 1
        if (priceB > priceA) return -1
        return 0
    })
    console.log('result floor ---- ', workingForSale[0].salePrice)
    supplyCache.floorPrice = workingForSale[0].salePrice
    marketCache.chiknsForSale = workingForSale
}, null, true, 'Australia/Sydney').start()
