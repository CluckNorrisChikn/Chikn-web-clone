
import chalk from 'chalk'

const NO_COLOUR = s => s

/**
 * @example Usage:
 *  const timer = new PerformanceTimer()
 *  timer.lap('find bid')
 *  timer.lap('collect bids')
 *  console.log(chalk.yellow(`perf: listing_lot_skus - ${timer.timings.join(' | ')}`))
 */
export class PerformanceTimer {
    prev: number = Date.now()
    timings: string[] = []
    lap(name: string) {
        const tmp = Date.now()
        const delta = tmp - this.prev
        const color = delta > 600 ? chalk.red : delta > 300 ? chalk.yellow : NO_COLOUR
        this.timings.push(color(`(lap) ${name} - ${delta.toLocaleString()} secs`))
        this.prev = Date.now()
        return this
    }

    stop(context: string = 'end') {
        console.log(chalk.grey(`timer: ${context + ' '}- ${this.timings.join(' | ')}`))
    }
}
