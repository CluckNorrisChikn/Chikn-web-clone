import React, { useRef, useEffect, useState } from 'react'
import Tick from '@pqina/flip'
import '@pqina/flip/dist/flip.min.css'

const FlipDate = ({ value }) => {
  const divRef = useRef()
  const tickRef = useRef()
  const [tickValue, setTickValue] = useState(value)

  useEffect(() => {
    const didInit = (tick) => {
      //   const locale = {
      //     DAY_PLURAL: 'Days',
      //     DAY_SINGULAR: 'Day',
      //     HOUR_PLURAL: 'Hours',
      //     HOUR_SINGULAR: 'Hour',
      //     MINUTE_PLURAL: 'Minutes',
      //     MINUTE_SINGULAR: 'Minute',
      //     SECOND_PLURAL: 'Seconds',
      //     SECOND_SINGULAR: 'Second'
      //   }

      //   console.log('didInit', tick)

      //   for (const key in locale) {
      //     // eslint-disable-next-line no-prototype-builtins
      //     if (!locale.hasOwnProperty(key)) {
      //       continue
      //     }
      //     console.log('setting', { key, value: locale[key] })
      //     tick.setConstant(key, locale[key])
      //   }

      tickRef.current = tick
    }

    const currDiv = divRef.current
    const tickValue = tickRef.current
    Tick.DOM.create(currDiv, {
      value,
      didInit,
    })

    return () => Tick.DOM.destroy(tickValue)
  }, [value])

  useEffect(() => {
    const deadline = new Date(value)

    const counter = Tick.count.down(deadline)

    // When the counter updates, update React's state value
    counter.onupdate = (value) => setTickValue(value)

    return () => counter.timer.stop()
  }, [value])

  useEffect(() => {
    if (tickRef.current) tickRef.current.value = tickValue
  }, [tickValue])

  return (
    <>
      {/* <span data-key="label" data-view="text" class="tick-label tick-text" data-value="Hours">Hours</span> */}
      {/* <div ref={divRef} className="tick">
        <div data-repeat="true" data-layout="horizontal">
          <div className="tick-group">
            <div data-key="value" data-repeat="true" data-transform="pad(00)">
              <span data-view="flip"></span>
            </div>
            <span
              data-key="label"
              data-view="text"
              className="tick-label"
            ></span>
          </div>
        </div>
      </div> */}

      <div ref={divRef} className="tick">
        <div
          data-repeat="true"
          data-layout="horizontal"
          // data-transform="preset(d, h, m, s) -> delay"
        >
          <div className="tick-group">
            <div data-key="value" data-repeat="true" data-transform="pad(00) -> split -> delay">
              <span data-view="flip"></span>
            </div>
            <span data-key="label" data-value="Days" data-view="text" className="tick-label" />
          </div>
        </div>
      </div>
    </>
  )
}

export default FlipDate
