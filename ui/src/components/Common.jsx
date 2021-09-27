import * as React from 'react'
import { Container } from 'react-bootstrap'

export const Section = ({ className = '', ...props }) => (
  <Container
    className={`p-3 p-md-5 text-center rounded-3 ${className}`}
    {...props}
  />
)

export const StackCol = ({ className = '', ...props }) => (
  <div className={`d-flex flex-column ${className}`} {...props} />
)
export const StackRow = ({ className = '', ...props }) => (
  <div className={`d-flex flex-row ${className}`} {...props} />
)
