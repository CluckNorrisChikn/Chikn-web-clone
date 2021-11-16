// const Web3 = require('web3')
import contractTestnet from './contracts/Chicken_Fuji.json'
import contractMainnet from './contracts/Chicken_Mainnet.json'
import { PerformanceTimer } from './PerformanceTimer'
import chalk from 'chalk'
const Web3Eth = require('web3-eth')

/**
 * @typedef {Object} ChickenDetails
 * @property {string} tokenId // e.g. '3',
 * @property {string} tokenURI // e.g. 'https://chickenrun.io/5126a23d-b59b-4841-a7ee-1621f0320947',
 * @property {string} mintedBy // e.g. '0x20e63CB166a90c22a7afC5623AEE59d8D8988Ec5',
 * @property {string} currentOwner // e.g. '0x20e63CB166a90c22a7afC5623AEE59d8D8988Ec5',
 * @property {string} previousOwner // e.g. '0x0000000000000000000000000000000000000000',
 * @property {string} price // e.g. '2000000000000000000',
 * @property {string} numberOfTransfers // e.g. '0',
 * @property {boolean} forSale // e.g. false
 */
class ChickenContract {
    label: string;
    network: string;
    web3;
    contract;

    constructor(useTestnet = false) {
        this.label = useTestnet ? 'testnet' : 'mainnet'
        this.network = useTestnet ? 'https://api.avax-test.network/ext/bc/C/rpc' : 'https://api.avax.network/ext/bc/C/rpc'
        this.web3 = new Web3Eth(this.network)
        const { abi, address } = useTestnet ? contractTestnet : contractMainnet
        this.contract = new this.web3.Contract(abi, address)
        console.log(chalk.green(`Connected to ${this.label}...`))
    }

    /**
   * @returns {Promise<number>} the count of minted tokens.
   */
    async mintedCount() {
        const timer = new PerformanceTimer()
        const response = await this.contract.methods.totalSupply().call()
        timer.lap('totalSupply').stop()
        return response
    }

    /**
   * @returns {Promise<number>} the count of total tokens.
   */
    async totalCount() {
        const timer = new PerformanceTimer()
        const response = await this.contract.methods.maxSupply().call()
        timer.lap('totalCount').stop()
        return response
    }

    /**
   * @returns {Promise<ChickenDetails>} details of the chicken.
   */
    async details(tokenId) {
        if (typeof tokenId === 'undefined') throw new Error('Missing parameter - tokenId')
        const { price, previousPrice, numberOfTransfers, ...details } = await this.contract.methods.allChickenRun(tokenId).call()
        return { ...details, price: parseInt(price) / Math.pow(10, 18), previousPrice: parseInt(previousPrice) / Math.pow(10, 18), numberOfTransfers: parseInt(numberOfTransfers) }
    }
}

export default ChickenContract
