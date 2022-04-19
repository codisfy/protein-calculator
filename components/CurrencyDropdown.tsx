import * as React from "react"
import {
  InputGroup,
  FormControl,
  DropdownButton,
  Dropdown,
} from "react-bootstrap"

export interface ICurrencyDropdownProps {
  currencies: Array<string>
  onCurrencyChange: Function
  currency: string
}

const DEFAULT_CURRENCY = "$"

export default function CurrencyDropdown(props: ICurrencyDropdownProps) {

  const [localCurrency, setLocalCurrency] = React.useState(props.currency)
  
  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl
          className="w-25"
          value={localCurrency}
          maxLength={3}
          onChange={({ target }) => {
            updateInput(target.value)
          }}
          placeholder="Currency"
          aria-label="Text input with dropdown button"
        />
        <DropdownButton
          variant="outline-secondary"
          title="Currency"
          id="input-group-dropdown-2"
          align="end"
        >
          {props.currencies.map((currency: string) => {
            return (
              <Dropdown.Item
                key={currency}
                href="#"
                onClick={() => updateInput(currency)}
              >
                {currency}
              </Dropdown.Item>
            )
          })}
        </DropdownButton>
      </InputGroup>
    </div>
  )

  function updateInput(value:string) {
    setLocalCurrency(value)
    !!value ? props.onCurrencyChange(value) : ''
  }
}
