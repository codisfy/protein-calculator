import { AppProps } from "next/app"
import { PropsWithChildren, useState } from "react"
import { Button, Form, Table } from "react-bootstrap"
import WeightField from "./WeightField"

export interface RowStructure {
  brand: string
  containerWeight: number
  containerUnit: string
  scoopWeight: number
  scoopUnit: string
  proteinWeight: number
  proteinUnit: string
  price: number
  currency: string,
  id: string,
}

interface RowComponent extends RowStructure {
  onDelete: Function
  onChange: Function
  allowDelete: boolean
}

function InputContainer(props: any) {
  return <div className="col-6 col-md mb-3 mb-sm-0">{props.children}</div>
}

const units = [
  {
    name: "kg",
    conversion: 1000,
  },
  {
    name: "g",
    conversion: 1,
  },
  {
    name: "lb",
    conversion: 453.592,
  },
]

function convertToGrams(value: number, unit: string) {
  let unitData = units.find((unitItem: any) => unitItem.name == unit)
  if (!unitData) {
    throw "Invalid unit!"
  }
  return value * unitData.conversion
}

const ProteinCalculator = (props: RowComponent) => {
  // TODO: Add animations when showing stats
  // TODO: Add proper statis types

  let proteinInfo = {
    perUnitValue: "0",
  }

  let stats = false

  /**
   * Check and see if all the required data is present for the calculation to start
   */
  const areStatsValid = (items: any) => {
    for (let value of Object.values(items)) {
      if (!value || !Number.isFinite(value)) {
        return false
      }
    }
    return true
  }

  // each item is suffixed with weight and unit looping over to fetch values
  const calculateStats = () => {
    let items: any = {}
    type Stat = "container" | "price" | "scoop" | "protein"
    let stat: Stat
    let weightProperties: Array<Stat> = ["container", "scoop", "protein"]
    let priceProperties: Array<Stat> = ["price"]
    let allProperties: Array<Stat> = [...weightProperties, ...priceProperties]
    for (stat of allProperties) {
      if (weightProperties.includes(stat)) {
        let value = parseFloat("" + (props as any)[stat + "Weight"])
        items[stat] = convertToGrams(value, "" + (props as any)[stat + "Unit"])
      } else {
        items[stat] = parseFloat((props as any)[stat])
      }
    }
    let areValid = areStatsValid(items)
    if (areValid) {
      let perUnitValue = (
        ((items.protein / items.scoop) * items.container) /
        items.price
      ).toFixed(2)
      proteinInfo = { perUnitValue }
      stats = true
    } else {
      stats = false
    }
  }

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    //const name = e.target.name
    //const value = e.target.value
    const { name, value } = e.target
    let newValues = { [name]: value }
    props.onChange(props.id, newValues)
  }

  const weightFieldChange = (
    name: string,
    data: { unit: string; weight: number }
  ) => {
    //TODO: do something with weight field
    let newValues = {
      [name + "Weight"]: data.weight,
      [name + "Unit"]: data.unit,
    }
    props.onChange(props.id, newValues)
  }

  calculateStats()

  return (
    <div>
      <div className="row align-items-center">
        <InputContainer>
          <Form.Control
            className="form-control-lg"
            placeholder="Brand"
            name="brand"
            type="text"
            value={props.brand}
            onChange={handleInputChange}
          ></Form.Control>
        </InputContainer>
        <InputContainer>
          <WeightField
            name="container"
            unit={props.containerUnit}
            weight={props.containerWeight}
            placeholder="Container weight (2kg etc)"
            allowedUnits={["lb", "kg", "g"]}
            onChange={weightFieldChange}
          ></WeightField>
        </InputContainer>
        <InputContainer>
          <WeightField
            name="scoop"
            unit={props.scoopUnit}
            weight={props.scoopWeight}
            placeholder="Scoop Size(g)"
            allowedUnits={["g"]}
            onChange={weightFieldChange}
          ></WeightField>
        </InputContainer>
        <InputContainer>
          <WeightField
            name="protein"
            unit={props.proteinUnit}
            weight={props.proteinWeight}
            placeholder="Protein per Scoop (g)"
            allowedUnits={["g"]}
            onChange={weightFieldChange}
          ></WeightField>
        </InputContainer>
        <InputContainer>
          <Form.Control
            className="form-control-lg"
            placeholder="Price (e.g 10)"
            name="price"
            type="text"
            value={props.price}
            onChange={handleInputChange}
          ></Form.Control>
        </InputContainer>
        <InputContainer>
          <Button
            disabled={!props.allowDelete}
            onClick={() => {
              props.onDelete(props.id)
            }}
            variant="danger"
          >
            X
          </Button>
        </InputContainer>
      </div>
      {stats && (
        <div>
          <Table size="sm" className="table-success">
            <tbody>
              <tr>
                <th>Per Price Unit Value</th>
                <td>
                  You are getting {proteinInfo.perUnitValue} grams of protein
                  per {props.currency}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default ProteinCalculator
