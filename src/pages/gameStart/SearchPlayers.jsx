import React, { useState, useEffect } from "react"
import { DialogContent, TextField, List } from "@material-ui/core"
import { useFirebase } from "../../contexts/FirebaseCtx"
import { FriendListItem } from "./ListItems.jsx"
import { useAuthCtx } from "../../contexts/AuthCtx"
import { useDialogCtx } from "../../contexts/DialogCtx"
//
//
const SearchPlayers = () => {
  const { publicProfile } = useAuthCtx()
  const [searchString, setSearchString] = useState("")
  const [searchResultsName, setSearchResultsName] = useState([])
  const [searchResultsEmail, setSearchResultsEmail] = useState([])
  const { firestore, doSendInvite } = useFirebase()
  const { state, handleCloseForm } = useDialogCtx()
  function handleSendInvite({ uid }) {
    const { displayName, avatarNumber } = publicProfile
    const { gameId, gameName } = state
    if (!uid || !displayName || !avatarNumber || !gameId || !gameName) {
      handleCloseForm()
      return null
    }
    doSendInvite({ uid, displayName, avatarNumber, gameId, gameName })
    handleCloseForm()
  }
  useEffect(() => {
    if (searchString && searchString.length > 2) {
      const byNameRef = firestore
        .collection("publicProfiles")
        .where("displayName", "==", searchString.trim())
      byNameRef.get().then(snapshot => {
        const _searchResults = []
        snapshot.forEach(doc =>
          _searchResults.push({ ...doc.data(), id: doc.id })
        )
        setSearchResultsName(_searchResults)
      })
      const byEmailRef = firestore
        .collection("publicProfiles")
        .where("email", "==", searchString.trim())
      byEmailRef.get().then(snapshot => {
        const _searchResults = []
        snapshot.forEach(doc =>
          _searchResults.push({ ...doc.data(), id: doc.id })
        )
        setSearchResultsEmail(_searchResults)
      })
    }
  }, [firestore, searchString])
  const allResults = [...searchResultsName, ...searchResultsEmail]
  return (
    <DialogContent>
      <TextField
        fullWidth
        label="search username or email"
        value={searchString}
        onChange={e => setSearchString(e.target.value)}
      />
      <List dense>
        {allResults.map(profile => {
          return (
            <FriendListItem
              key={profile.id}
              profile={{ ...profile, uid: profile.id }}
              handleSendInvite={handleSendInvite}
              disabled={
                state.sentInvites &&
                state.sentInvites.find(inv => inv.invited === profile.id)
              }
            />
          )
        })}
      </List>

      {/* <ShowMe obj={state} name="state" noModal />
      <ShowMe obj={searchResultsName} name="searchResultsName" noModal />
      <ShowMe obj={searchResultsEmail} name="searchResultsEmail" noModal /> */}
    </DialogContent>
  )
}

export default SearchPlayers
