import React from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'

const Page = () => {
  const refA = React.useRef()
  const refB = React.useRef()
  const options = [{ label: 'foo' }, { label: 'bar' }]

  return (
    <div className="m-5">
      <h3>Typeahead test</h3>

      <div className="d-flex flex-row">
        <Typeahead
          multiple
          id={'aaa'}
          onChange={(selected) => {
            console.log(selected)
            if (selected.length > 0) refA.current.toggleMenu(true)
          }}
          onBlur={() => refA.current.toggleMenu(false)}
          clearButton={true}
          options={options}
          ref={refA}
          placeholder="Choose a property..."
        />
        <Typeahead
          multiple
          id={'bbb'}
          onChange={(selected) => {
            console.log(selected)
            if (selected.length > 0) refB.current.toggleMenu(true)
          }}
          onBlur={() => {
            refB.current.toggleMenu(false)
          }}
          clearButton={true}
          options={options}
          ref={refB}
          placeholder="Choose a property..."
        />
      </div>
    </div>
  )
}

export default Page
