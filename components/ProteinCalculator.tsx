import { Alert, Button, Form, Table } from "react-bootstrap"
import { RowStructure } from "../helpers/stats-calculator"
import WeightField from "./WeightField"

interface RowComponent extends RowStructure {
  onDelete: Function
  onChange: Function
  allowDelete: boolean
  bestValue: boolean
}

function InputContainer(props: any) {
  return <div className="col-6 col-md mb-3 mb-sm-0">{props.children}</div>
}

const ProteinCalculator = (props: RowComponent) => {
  // TODO: Add animations when showing stats
  // TODO: Add proper statis types

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
      {props.statsValid && (
        <div>
          <Table
            size="sm"
            className={props.bestValue ? "table-success" : "table-light"}
          >
            <tbody>
              <tr>
                <th>Per Price Unit Value</th>
                <td>
                  <>
                    {props.proteinStats?.perUnitValue} grams of protein/
                    {props.currency}
                  </>
                </td>
              </tr>
              <tr>
                <th>Servings per container</th>
                <td>
                  <>{props.proteinStats?.servingsPerContainer || ""}</>
                </td>
              </tr>
              <tr>
                <th>Raw Protein Percent</th>
                <td><>{props.proteinStats?.proteinPercentage}%</></td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
      {!props.statsValid && (
        <Alert variant="danger">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>Invalid values provided. Please update your input</p>
        </Alert>
      )}
    </div>
  )
}

export default ProteinCalculator
