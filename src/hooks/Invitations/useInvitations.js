import { useEffect, useState } from "react"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"

export const useInvitations = () => {
  const { firestore } = useFirebase()
  const { user } = useAuthCtx()
  const [sentInvites, setSentInvites] = useState([])
  const [receivedInvites, setReceivedInvites] = useState([])

  useEffect(() => {
    if (user) {
      console.log("calling for sent Invites")
      const myInvitesRef = firestore
        .collection("invites")
        .where("invitedBy", "==", user.uid)
      const unsubscribe = myInvitesRef.onSnapshot(snapshot => {
        const _sent = []
        snapshot.forEach(doc => _sent.push({ ...doc.data(), inviteId: doc.id }))
        setSentInvites(_sent)
      })
      return unsubscribe
    }
  }, [firestore, user])

  useEffect(() => {
    if (user) {
      console.log("calling for received Invites")
      const myRecdInvitesRef = firestore
        .collection("invites")
        .where("invited", "==", user.uid)
      const unsubscribe = myRecdInvitesRef.onSnapshot(snapshot => {
        const _received = []
        snapshot.forEach(doc =>
          _received.push({ ...doc.data(), inviteId: doc.id })
        )
        setReceivedInvites(_received)
      })
      return unsubscribe
    }
  }, [firestore, user])
  return { sentInvites, receivedInvites }
}
