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

  //// ⭐   Game Admin API   ⭐ ////
  doCreateGame = ({ gameName }) => {
    const user = this.auth.currentUser
    if (!user) {
      console.log("trying to create a game when not signed in")
      return null
    }
    const gamesRef = this.firestore.collection("games")
    return gamesRef.add({
      gameName,
      memberUIDs: [user.uid],
      memberRequests: [],
      guestList: [],
      startedBy: user.uid,
      inProgress: false,
      completed: false
    })
  }
  doSendInvite = ({ uid, displayName = "unknown", gameName }) => {
    const user = this.auth.currentUser
    const invitesRef = this.firestore.collection("invites")
    return invitesRef.add({
      invited: uid,
      invitedBy: user.uid,
      displayName,
      gameName,
      timeStamp: moment().toISOString()
    })
  }
  doDisInvite = inviteId => {
    this.firestore.doc(`/invites/${inviteId}`).delete()
  }

  doRematch = async ({ oldGameId, gameName, memberUIDs, rematchNumber }) => {
    const oldGameRef = this.firestore.doc(`/games/${oldGameId}`)
    const [strippedGameId] = oldGameId.split("-rematch")

    const rematchLoc = `${strippedGameId}-rematch${rematchNumber}`
    oldGameRef.update({ rematchLoc })
    const user = this.auth.currentUser
    const gamesRef = this.firestore.doc(`games/${rematchLoc}`)

    return gamesRef
      .set({
        gameName,
        memberUIDs,
        memberRequests: [],
        startedAt: moment().toISOString(),
        startedBy: user.uid,
        rematchNumber,
        inProgress: false,
        completed: false
      })
      .then(() => ({ newLoc: rematchLoc }))
  }

  doRequestToJoinGame = async gameId => {
    // request to join PENDING game.  you cant join a currentGame rightnow.
    // so you should also not be able to request to join a game that is inProgress
    const uid = this.auth.currentUser.uid
    const displayName =
      this.auth.currentUser.displayName || this.auth.currentUser.email
    const game = await this.getPendingGameValues(gameId)
    let { memberUIDs, maxMembers, memberRequests = [] } = game
    const iAmInThisGame = memberUIDs.includes(uid)
    const iAlreadyRequested = memberRequests.find(mem => mem.uid === uid)
    if (
      memberUIDs.length < maxMembers &&
      !iAmInThisGame &&
      !iAlreadyRequested
    ) {
      memberRequests.push(uid)
    }
    this.savePendingGameValues({ gameId, values: { ...game, memberRequests } })
  }
  doHandleGameRequest = async ({ gameId, uid, approved }) => {
    console.log("gameId, uid, approved", gameId, uid, approved)
    const game = await this.getPendingGameValues(gameId)
    // let newMembers = [...game.members]
    let newRequests = [...game.memberRequests]
    let memberUIDs = [...game.memberUIDs]
    const requestingMember = newRequests.find(mem => mem.uid === uid)
    if (approved && requestingMember) {
      // newMembers.push(requestingMember)
      memberUIDs.push(uid)
    }
    const memberRequests = newRequests.filter(mem => mem.uid !== uid)
    this.savePendingGameValues({
      gameId,
      values: { ...game, memberRequests, memberUIDs }
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
  deleteGame = async ({ gameId }) => {
    console.log("deleting game", gameId)
    const gameRef = this.fdb.ref(`/currentGames/${gameId}`)
    const firestoreRef = this.firestore.doc(`/games/${gameId}`)
    gameRef.remove()
    firestoreRef.delete()
  }
  handleEndGame = async ({ gameId, scores }) => {
    const firestoreRef = this.firestore.doc(`/games/${gameId}`)
    firestoreRef.update({
      completed: moment().toISOString(),
      inProgress: false,
      scores
    })
  }
}
export default Firebase
