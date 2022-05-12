import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { RowStructure } from "../helpers/stats-calculator"
import { db } from "../utils/firebase"

const collectionName = "sessions"

export const saveSession = async (sessionId: string, data: Array<RowStructure>) => {
  return setDoc(doc(db, collectionName, sessionId), {
    data,
    timestamp: serverTimestamp(),
  })
}

export const getSession = async (sessionId: string) => {
  const docRef = doc(db, collectionName, sessionId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()?.data
  } else { 
    return [];
  }
}
