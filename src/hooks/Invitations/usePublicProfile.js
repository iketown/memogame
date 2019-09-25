import { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseCtx"

export const usePublicProfile = uid => {
  const { firestore } = useFirebase()
  const [profile, setProfile] = useState({})
  useEffect(() => {
    const profileRef = firestore.doc(`publicProfiles/${uid}`)
    const getProfile = async () => {
      const response = await profileRef.get().then(doc => doc.data())
      console.log("response in Invitation LIst item", response)
      setProfile(response)
    }
    getProfile()
  }, [firestore, uid])
  if (!uid) return null
  return profile
}
