import { signInAnonymously } from "@firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { RowStructure } from "../helpers/stats-calculator"
import { db, auth } from "../utils/firebase"

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

export const anonymousLogin = () => {
  return signInAnonymously(auth);
};