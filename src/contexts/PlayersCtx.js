import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from "react"
import { useGameCtx } from "./GameCtx"
import { useFirebase } from "./FirebaseCtx"
import { useAuthCtx } from "./AuthCtx"

const PlayersCtx = createContext()

export const PlayersCtxProvider = props => {
  const { gameState } = useGameCtx("PlayersCtxProvider")
  const [players, setPlayers] = useState({})
  const { user } = useAuthCtx()
  const { firestore } = useFirebase()
  const playersRef = useRef()
  useEffect(() => {
    async function updateFriends(memberUIDs) {
      if (!memberUIDs || memberUIDs.length <= 1) return null
      const profileRef = firestore.doc(`publicProfiles/${user.uid}`)
      const otherUIDs = memberUIDs.filter(_uid => _uid !== user.uid)
      const { friends = [] } = await profileRef.get().then(doc => doc.data())
      const newFriends = [...new Set([...friends, ...otherUIDs])]
      if (newFriends.length === friends.length) return null
      profileRef.update({ friends: newFriends })
    }
    if (gameState && (gameState.memberUIDs || gameState.memberRequests)) {
      updateFriends(gameState.memberUIDs)
      const memUIDs = gameState.memberUIDs || []
      const reqUIDs = gameState.memberRequests || []
      ;[...memUIDs, ...reqUIDs].forEach(uid => {
        if (!playersRef.current || !playersRef.current[uid]) {
          if (!playersRef.current) playersRef.current = {}
          const memberRef = firestore.collection("publicProfiles").doc(uid)
          playersRef.current[uid] = memberRef.onSnapshot(doc => {
            setPlayers(old => ({ ...old, [doc.id]: doc.data() }))
          })
        } else {
          console.log(
            "listener for publicProfile already exists",
            playersRef.current
          )
        }
      })
    }
  }, [firestore, gameState, gameState.memberUIDs, user.uid])

  return <PlayersCtx.Provider value={{ players }} {...props} />
}

export const usePlayersCtx = () => {
  const ctx = useContext(PlayersCtx)
  if (!ctx)
    throw new Error(
      "usePlayersCtx must be a descendant of PlayersCtxProvider 😕"
    )

  const { players } = ctx
  return { players }
}
