import { useEffect, useState, useRef } from "react"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { useAuthCtx } from "../../contexts/AuthCtx"

export const useInvitations = () => {
  const { firestore } = useFirebase()
  const { user } = useAuthCtx()
  const [sentInvites, setSentInvites] = useState([])
  const [receivedInvites, setReceivedInvites] = useState([])
  const myInvitesRef = useRef()
  const myReceivedInvitesRef = useRef()
  useEffect(() => {
    if (user && user.uid) {
      const myInvitesFirestoreRef = firestore
        .collection("invites")
        .where("invitedBy", "==", user.uid)
      if (!myInvitesRef.current) {
        myInvitesRef.current = myInvitesFirestoreRef.onSnapshot(snapshot => {
          const _sent = []
          snapshot.forEach(doc =>
            _sent.push({ ...doc.data(), inviteId: doc.id })
          )
          setSentInvites(_sent)
        })
      } else {
        console.log("stopped myInvitesRef from making another listener")
      }
      // return invitesRef.current
    }
  }, [firestore, user])

  useEffect(() => {
    if (user && user.uid) {
      const myRecdInvitesRef = firestore
        .collection("invites")
        .where("invited", "==", user.uid)
      if (!myRecdInvitesRef.current) {
        myReceivedInvitesRef.current = myRecdInvitesRef.onSnapshot(snapshot => {
          const _received = []
          snapshot.forEach(doc =>
            _received.push({ ...doc.data(), inviteId: doc.id })
          )
          setReceivedInvites(_received)
        })
      } else {
        console.log("stopped myRecdInvitesRef from making another listener")
      }
      // return unsubscribe
    }
  }, [firestore, user])
  return { sentInvites, receivedInvites }
}
