import * as React from 'react'
import { ChiknText, Section, StackCol } from '../Common'

const Component = () => {
  return (
    <Section className="border">
      <StackCol className="gap-3">
        <h3>Minting now open!</h3>
        <div>
          Please connect your wallet, to mint your own <ChiknText />.
        </div>
      </StackCol>
    </Section>
  )
}

export default Component
