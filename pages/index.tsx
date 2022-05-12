import type { NextPage } from "next"
import Head from "next/head"
import { SyntheticEvent, useEffect, useState } from "react"
import ProteinCalculator from "../components/ProteinCalculator"
import calculateStats, { RowStructure } from "../helpers/stats-calculator"
import { Button, Spinner } from "react-bootstrap"
import { nanoid } from "nanoid"
import data from "../utils/initdata"
import CurrencyDropdown from "../components/CurrencyDropdown"
import { useRouter } from "next/router"
import * as Firestore from "../services/Firestore"
import Toast from "../components/Toast"

const Home: NextPage = () => {
  const [isLoading, setLoading] = useState(false)

  //TODO: move to a type and import
  const baseStructure: RowStructure = {
    brand: "",
    containerWeight: 1,
    containerUnit: "kg",
    scoopWeight: 32,
    scoopUnit: "g",
    proteinWeight: 24,
    proteinUnit: "g",
    price: 100,
    currency: "$",
    id: nanoid(),
    proteinStats: null,
    statsValid: false,
  }

  let itemCount = 0

  const [proteins, setProteins] = useState<Array<RowStructure>>([...data])
  const [currency, setCurrency] = useState<string>("$")
  const [sessionId, setSessionId] = useState<string>("")
  const [show, setShow] = useState<boolean>(false)
  

  const router = useRouter()
  const { id } = router.query

  const setDefaultData = () => {
    setProteins(data)
    setSessionId("")
  }

  useEffect(() => {
    const getSession = async () => {
      if (!id) {
        setDefaultData()
        return
      }
      setLoading(true)
      let sessionId = id as string;
      let data = await Firestore.getSession(sessionId);
      if (data.length) {
        await setProteins(data)
        setSessionId(sessionId)
      } else {
        setDefaultData();
      }
      setLoading(false)
    }
    getSession()
  }, [id])

  const addProtein = () => {
    setProteins([
      ...proteins,
      { ...baseStructure, ...{ id: nanoid(), currency } },
    ])
  }
  const saveSession = async () => {
    let currentSessionId = sessionId;
    if (!sessionId) { 
      currentSessionId = nanoid()
    }
    await Firestore.saveSession(currentSessionId, proteins)
    if (!sessionId) {
      router.push(`/saved/${currentSessionId}`)
    }
    setShow(true)
  }

  const handleDelete = (id: string) => {
    const remainingProteins = proteins.filter((protein) => id !== protein.id)
    setProteins(remainingProteins)
  }

  const handleChange = (id: string, data: RowStructure) => {
    const editProteinList = proteins.map((protein) => {
      if (id === protein.id) {
        return { ...protein, ...data }
      }
      return protein
    })
    setProteins(editProteinList)
  }

  const onCurrencyChange = (currency: string) => {
    const editProteinList = proteins.map((protein) => {
      return { ...protein, ...{ currency } }
    })
    setProteins(editProteinList)
    setCurrency(currency)
  }
  let currentBestValue = 0
  let proteinMapped = proteins.map((protein, i) => {
    let { statsValid, proteinStats } = calculateStats(protein)
    if (proteinStats && proteinStats?.perUnitValue > currentBestValue) {
      currentBestValue = proteinStats?.perUnitValue
    }
    return { ...protein, ...{ statsValid, proteinStats } }
  })

  return (
    <div className={"container-fluid"}>
      <Head>
        <title>Protein price value calculator</title>
        <meta
          name="description"
          content="Calculate which protein is best based on protein per scoop and price"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="pb-3 m-4 border-bottom d-flex justify-content-between align-items-center">
        <h4>Protein Value Calculator</h4>
        <div>
          <CurrencyDropdown
            currencies={["$", "₹", "£"]}
            onCurrencyChange={onCurrencyChange}
            currency={currency}
          ></CurrencyDropdown>
        </div>
      </header>
      <main className="px-4 py-5 my-5 text-center">
        <h2 className="display-5 fw-bold">
          Find the best protein value for your money
        </h2>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            {`Buying protein can be tricky. With various scoop sizes and the
            quantity of actual protein per scoop, it's difficult to calculate
            the best one. With this calculator at your disposal, quickly figure
            out the most valuable protein for you.`}
          </p>
        </div>
        <Toast show={show} text="Successfully saved your settings" setShow={setShow}></Toast>
        {isLoading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {!isLoading && (
          <div>
            {proteinMapped.map((protein, i) => (
              <ProteinCalculator
                key={protein.id}
                onChange={handleChange}
                onDelete={handleDelete}
                allowDelete={proteins.length > 1}
                bestValue={
                  currentBestValue === protein.proteinStats?.perUnitValue
                }
                {...protein}
              ></ProteinCalculator>
            ))}
            <div className="d-grid d-sm-flex justify-content-center gap-2 mt-3">
              <Button variant="primary" onClick={addProtein}>
                Add another
              </Button>
              <Button variant="success" onClick={saveSession}>
                Save Session
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer></footer>
    </div>
  )
}

export default Home
