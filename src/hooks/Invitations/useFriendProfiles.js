import { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"

export const useFriendProfiles = (otherUIDs = []) => {
  const { firestore } = useFirebase()
  const { user } = useAuthCtx()
  const [friends, setFriends] = useState([])
  const [friendProfiles, setFriendProfiles] = useState([])

  useEffect(() => {
    // get friends uids
    if (user && firestore) {
      const profileRef = firestore.doc(`publicProfiles/${user.uid}`)
      async function getFriends() {
        const response = await profileRef.get().then(doc => doc.data())
        const friends = (response && response.friends) || []
        setFriends(friends)
      }
      getFriends()
    }
  }, [firestore, user])
  useEffect(() => {
    // get profiles of friends whenever friends list changes
    if ((friends && friends.length) || otherUIDs.length) {
      const promises = [...friends, ...otherUIDs].map(friendUid => {
        const memberRef = firestore.collection("publicProfiles").doc(friendUid)
        return memberRef.get().then(doc => {
          return { ...doc.data(), uid: doc.id }
        })
      })
      Promise.all(promises).then(docs => setFriendProfiles(docs))
    }
  }, [firestore, friends, otherUIDs])

  return { friendProfiles }
}
