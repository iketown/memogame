import app from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

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
    app.initializeApp(firebaseConfig)
    this.auth = app.auth()
    this.app = app
    // this.fsdb = app.firestore()
    this.fdb = app.database()
  }
  //// ⭐   Auth API   ⭐ ////

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)
  doSignInWithUserAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)
  doSignOut = () => this.auth.signOut()
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

  //// ⭐   Game API   ⭐ ////
  doCreateGame = ({ maxMembers = 3, gameName }) => {
    const uid = this.auth.currentUser.uid
    const displayName =
      this.auth.currentUser.displayName || this.auth.currentUser.email
    console.log("uid", uid)
    if (!uid) return null
    const pendingGamesRef = this.fdb.ref(`/pendingGames`)
    pendingGamesRef.push().set({
      gameName,
      members: [{ uid, displayName }],
      memberRequests: [],
      maxMembers,
      startedBy: uid,
      guestList: [],
      inProgress: false
    })
  }
  doStartGame = gameId => {
    // change a game from 'pending' to 'current'
    const values = this.getPendingGameValues(gameId)
    if (values.startedBy !== this.auth.currentUser.uid) {
      console.log("you cant start someone elses game mofo")
      return null
    }
    values.inProgress = true
    values.startedAt = new Date()
    this.savePendingGameValues({ gameId, values })
    const currentGamesRef = this.fdb.ref(`/currentGames/${gameId}`)
    currentGamesRef.set(values)
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
    const requestingMember = newRequests.find(mem => mem.uid === uid)
    console.log("requestingMember", requestingMember)
    if (approved && requestingMember) newMembers.push(requestingMember)
    const memberRequests = newRequests.filter(mem => mem.uid !== uid)
    this.savePendingGameValues({
      gameId,
      values: { ...game, members: newMembers, memberRequests }
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
