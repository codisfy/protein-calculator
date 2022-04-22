export interface ProteinStats  {
  perUnitValue: Number,
  servingsPerContainer: Number,
  proteinPercentage: Number,
}
export interface RowStructure {
  brand: string;
  containerWeight: number;
  containerUnit: string;
  scoopWeight: number;
  scoopUnit: string;
  proteinWeight: number;
  proteinUnit: string;
  price: number;
  currency: string;
  proteinStats: ProteinStats | null,
  statsValid:boolean,
  id: string;
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

function convertToGrams(value: number, unit: string) {
  let unitData = units.find((unitItem: any) => unitItem.name == unit)
  if (!unitData) {
    throw "Invalid unit!"
  }
  return value * unitData.conversion
}

// each item is suffixed with weight and unit looping over to fetch values
const calculateStats = (proteinRow: RowStructure) => {
  let items: any = {}
  type Stat = "container" | "price" | "scoop" | "protein"
  let stat: Stat
  let weightProperties: Array<Stat> = ["container", "scoop", "protein"]
  let priceProperties: Array<Stat> = ["price"]
  let allProperties: Array<Stat> = [...weightProperties, ...priceProperties]
  for (stat of allProperties) {
    if (weightProperties.includes(stat)) {
      let value = parseFloat("" + (proteinRow as any)[stat + "Weight"])
      items[stat] = convertToGrams(value, "" + (proteinRow as any)[stat + "Unit"])
    } else {
      items[stat] = parseFloat((proteinRow as any)[stat])
    }
  }
  let areValid = areStatsValid(items)
  let statsValid = false
  let proteinStats = null
  if (areValid) {
    let perUnitValue = parseFloat((
      ((items.protein / items.scoop) * items.container) /
      items.price
    ).toFixed(2));
    let servingsPerContainer = Math.round(items.container / items.scoop);
    let proteinPercentage = Math.round(items.protein / items.scoop * 100) ;
    proteinStats = { perUnitValue, servingsPerContainer, proteinPercentage }
    statsValid = true
  } 
  return { statsValid, proteinStats}
}

export default calculateStats