import React from 'react'
import { Button, Toast } from 'react-bootstrap'
import styled from 'styled-components'

const CenterToaster = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  width: 100%;
  top: 100px;
  left: 0;
  right: 0;
  z-index: 9999;
`

const CloseButton = styled(Button)`
  width: 30px;
  height: 30px;
  padding: 3px 7px !important;
  font-size: 1.5rem !important;
  line-height: 1.5rem !important;
`

const NOOP = () => {}

const GenericToast = ({
  title = 'Some message',
  children = 'Some children',
  show = false,
  setShow = NOOP,
  autoHide = false,
  className = 'bg-success text-white',
  ...props
}) => {
  return (
    <CenterToaster>
      <Toast show={show} onClose={() => setShow(false)} delay={5000} autohide={autoHide}>
        <Toast.Header closeButton={false} className={className} {...props}>
          <strong className="me-auto">{title}</strong>
          <CloseButton size="sm" variant="outline-light border-0" onClick={() => setShow(false)}>
            &times;
          </CloseButton>
        </Toast.Header>
        <Toast.Body>{children}</Toast.Body>
      </Toast>
    </CenterToaster>
  )
}

export default GenericToast
