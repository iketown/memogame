// import app from "firebase/app"
import * as firebase from "firebase"
import "firebase/auth"
import "firebase/firestore"
import moment from "moment"

const {
  REACT_APP_API_KEY,
  REACT_APP_AUTHDOMAIN,
  REACT_APP_DATABASEURL,
  REACT_APP_PROJECTID,
  REACT_APP_MESSAGINGSENDERID,
  REACT_APP_APPID
} = process.env

const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTHDOMAIN,
  databaseURL: REACT_APP_DATABASEURL,
  projectId: REACT_APP_PROJECTID,
  storageBucket: "",
  messagingSenderId: REACT_APP_MESSAGINGSENDERID,
  appId: REACT_APP_APPID
}
// Initialize Firebase

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
    this.auth = firebase.auth()
    this.fxns = firebase.functions()
    this.endTurn = firebase.functions().httpsCallable("endTurn")
    this.houseToCenter = firebase.functions().httpsCallable("houseToCenter")
    this.app = firebase
    this.fdb = firebase.database()
    this.firestore = firebase.firestore()
  }
  //// ⭐   Auth API   ⭐ ////

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)
  doSignInWithUserAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)
  doSignOut = () => {
    return this.auth.signOut()
  }
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

  //// ⭐   gameLog API   ⭐ ////
  doAddToLog = ({ gameId, ...logInfo }) => {
    const timeStamp = moment().toISOString()
    const logRef = this.fdb.ref(`/currentGames/${gameId}/gameLog`)
    logRef.push({ ...logInfo, timeStamp })
  }
  doRemoveLog = ({ logId, gameId }) => {
    const logRef = this.fdb.ref(`/currentGames/${gameId}/gameLog/${logId}`)
    logRef.remove()
  }

  //// ⭐   Game PLAY API   ⭐ ////
  playStorageToCenter = async ({ gameId, itemId }) => {
    // remove from storage
    await this._removeFromStorage({ gameId, itemId })
    // add to center
    await this._addToCenter({ gameId, itemId })
    return this._endTurn({ gameId })
  }
  playStorageToHouse = async ({ gameId, itemId, roomId }) => {
    // remove from storage
    const promises = []
    promises.push(this._removeFromStorage({ gameId, itemId }))
    promises.push(this._addToHouse({ itemId, gameId, roomId }))
    promises.push(this._endTurn({ gameId }))
    return Promise.all(promises)
  }
  // houseToCenter = () => {}
  // houseToHouse = () => {}

  // shared Functions 👇
  _getRoomRefAndOldData = async ({ gameId, roomId }) => {
    const uid = this.auth.currentUser.uid
    const roomRef = this.fdb.ref(
      `currentGames/${gameId}/gameStates/${uid}/house/${roomId}`
    )
    const oldRoomData = await roomRef
      .once("value")
      .then(snapshot => snapshot.val())
    return { roomRef, oldRoomData }
  }
  _addToHouse = async ({ itemId, gameId, roomId }) => {
    const { roomRef, oldRoomData } = await this._getRoomRefAndOldData({
      gameId,
      roomId
    })
    const newRoomData = oldRoomData ? [itemId, ...oldRoomData] : [itemId]
    return roomRef.set(newRoomData)
  }
  _removeFromStorage = async ({ gameId, itemId }) => {
    const uid = this.auth.currentUser.uid
    const storagePileRef = this.fdb.ref(
      `currentGames/${gameId}/gameStates/${uid}/storagePile`
    )
    const oldStoragePile = await storagePileRef
      .once("value")
      .then(snapshot => snapshot.val())
    const storagePile = oldStoragePile.filter(_itemId => _itemId !== itemId)
    return storagePileRef.set(storagePile)
  }

  _endTurn = async ({ gameId }) => {
    const uid = this.auth.currentUser.uid
    if (!uid || !gameId) return { error: { message: "missing uid or gameId" } }
    // see who's turn it is now
    const turnRef = this.fdb.ref(`/currentGames/${gameId}/whosTurnItIs`)
    const whosTurn = await turnRef
      .once("value")
      .then(snapshot => snapshot.val())
      .catch(err => console.log("err getting whos turn", err))
    if (uid !== whosTurn.uid) {
      return { error: { message: "it wasnt your turn ???" } }
    }
    // get all members of this game
    const membersRef = this.fdb.ref(`/currentGames/${gameId}/members`)
    const members = await membersRef
      .once("value")
      .then(snap => snap.val())
      .catch(err => console.log("err getting members", err))
    if (!members) return { error: { message: "no members " } }

    //  who's turn is next ?
    const currentTurnMemberIndex = members.findIndex(mem => mem.uid === uid)
    const nextTurnMemberIndex = (currentTurnMemberIndex + 1) % members.length

    // set 'whosTurnItIs' to the next person
    return turnRef.set(members[nextTurnMemberIndex])
  }

  _addPileToStorage = async ({ gameId, pileArr }) => {
    const uid = this.auth.currentUser.uid
    const storagePileRef = this.fdb.ref(
      `currentGames/${gameId}/gameStates/${uid}/storagePile`
    )
    const oldStoragePile = await storagePileRef
      .once("value")
      .then(snapshot => snapshot.val())
    const newStoragePile = [...pileArr, ...oldStoragePile]
    return storagePileRef.set(newStoragePile)
  }

  _addToCenter = async ({ gameId, itemId }) => {
    const centerPileRef = this.fdb.ref(`/currentGames/${gameId}/centerCardPile`)
    const centerPileItems = await centerPileRef.once("value").then(snapshot => {
      const pile = snapshot.val() || []
      return pile
    })
    const topCard = centerPileItems[0] // will be undefined if this is the first play of the game
    const validPlay = !topCard || this._checkMatch(topCard, itemId)
    if (validPlay) {
      centerPileItems.unshift(itemId)
      return centerPileRef.set(centerPileItems)
    } else {
      await this._addPileToStorage({ pileArr: centerPileItems, gameId })
      return centerPileRef.set([itemId])
    }
  }

  _checkMatch = (item1, item2) => {
    if (!item1 || !item2) {
      console.log(`only one value in check match Item1:${item1} Item2:${item1}`)
      return true
    }
    const [col1, type1, firstLet1] = item1.split("_")
    const [col2, type2, firstLet2] = item2.split("_")
    if (col1 === col2) return true
    if (type1 === type2) return true
    if (firstLet1 === firstLet2) return true
    return false
  }

  //// ⭐   Game Admin API   ⭐ ////
  doCreateGame = ({ gameName }) => {
    const user = this.auth.currentUser
    if (!user) {
      console.log("trying to create a game when not signed in")
      return null
    }
    const displayName = (user && user.displayName) || (user && user.email)
    const gamesRef = this.firestore.collection("games")
    return gamesRef.add({
      gameName,
      members: [{ uid: user.uid, displayName }],
      memberUIDs: [user.uid],
      memberRequests: [],
      guestList: [],
      startedBy: user.uid,
      inProgress: false
    })
  }

  doRequestToJoinGame = async gameId => {
    // request to join PENDING game.  you cant join a currentGame rightnow.
    // so you should also not be able to request to join a game that is inProgress
    const uid = this.auth.currentUser.uid
    const displayName =
      this.auth.currentUser.displayName || this.auth.currentUser.email
    const game = await this.getPendingGameValues(gameId)
    let { members, maxMembers, memberRequests = [] } = game
    const iAmInThisGame = members.find(mem => mem.uid === uid)
    const iAlreadyRequested = memberRequests.find(mem => mem.uid === uid)
    if (members.length < maxMembers && !iAmInThisGame && !iAlreadyRequested) {
      memberRequests.push({ uid, displayName })
    }
    this.savePendingGameValues({ gameId, values: { ...game, memberRequests } })
  }
  doHandleGameRequest = async ({ gameId, uid, approved }) => {
    console.log("gameId, uid, approved", gameId, uid, approved)
    const game = await this.getPendingGameValues(gameId)
    let newMembers = [...game.members]
    let newRequests = [...game.memberRequests]
    let memberUIDs = [...game.memberUIDs]
    const requestingMember = newRequests.find(mem => mem.uid === uid)
    if (approved && requestingMember) {
      newMembers.push(requestingMember)
      memberUIDs.push(uid)
    }
    const memberRequests = newRequests.filter(mem => mem.uid !== uid)
    this.savePendingGameValues({
      gameId,
      values: { ...game, members: newMembers, memberRequests, memberUIDs }
    })
  }
  doExitFromGame = async ({ gameId, uid }) => {
    const _uid = uid || this.auth.currentUser.uid
    const game = await this.getPendingGameValues(gameId)
    let { members } = game
    const newMembers = members.filter(mem => mem.uid !== _uid)
    this.savePendingGameValues({
      gameId,
      values: { ...game, members: newMembers }
    })
  }
  getPendingGameValues = gameId => {
    const gameRef = this.fdb.ref(`/pendingGames/${gameId}`)
    let gameValues
    gameRef.once("value", snap => {
      gameValues = snap.val()
    })
    return gameValues
  }
  savePendingGameValues = ({ gameId, values }) => {
    const gameRef = this.fdb.ref(`/pendingGames/${gameId}`)
    gameRef.set({ ...values })
  }

  doCancelGame = async gameId => {
    const gameRef = this.fdb.ref(`/pendingGames/${gameId}`)
    const { startedBy } = await this.getPendingGameValues(gameId)
    console.log("startedBy", startedBy)
    const { uid } = this.auth.currentUser
    if (startedBy === uid) gameRef.remove()
  }
}
export default Firebase
