import React, { useState, useEffect } from "react"
import { Toast as Toaster, ToastContainer } from "react-bootstrap"

type Props = {
  show: boolean
  text: string
  setShow: Function
}

export default function Toast(props: Props) {


  return (
    <ToastContainer position="middle-center">
      <Toaster
        onClose={() => props.setShow(false)}
        show={props.show}
        delay={3000}
        autohide
        bg="info"
      >
        <Toaster.Body>{props.text}</Toaster.Body>
      </Toaster>
    </ToastContainer>
  )
}
