import React, { SyntheticEvent, useState } from "react"
import { Form } from "react-bootstrap"

type Props = {
  name: string
  weight: number
  unit: string
  onChange: Function
  allowedUnits: Array<string>
  placeholder?: string
}

export type WeightFieldValue = {
  unit: string
  weight: number | null
}

function WeightField(props: Props) {
  const [validationMessage, setValidationMessage] = useState<string>("")
 
  const formattedFieldValue = () => {
    if (!props.weight || isNaN(props.weight)) return undefined
    return props.weight + props.unit
  }
 
  const [fieldValue, setFieldValue] = useState<string|undefined>(formattedFieldValue())


  const onInputChange = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLTextAreaElement
    setFieldValue(value)

    const regex = new RegExp(`(\\d{1,}.?\\d{1,})(${props.allowedUnits.join("|")})$`)
    const matches = value.match(regex)
    if (!matches || !matches[1] || !matches[2]) {
      setValidationMessage(
        "Accepted format e.g. " +
          props.allowedUnits.map((unit) => "100" + unit).join(", ")
      )
    } else {
      setValidationMessage('');
      props.onChange(props.name, { weight: matches[1], unit: matches[2] })
    }
  }

  return (
    <>
      <Form.Control
        className="form-control-lg"
        placeholder={props.placeholder}
        name={props.name}
        type="text"
        value={fieldValue}
        onChange={onInputChange}
        isInvalid={!!validationMessage}
      ></Form.Control>
      {!!validationMessage && (
        <div className="invalid-feedback"> {validationMessage} </div>
      )}
    </>
  )
}

export default WeightField
