// import app from "firebase/app"
import * as firebase from "firebase"
import "firebase/auth"
import "firebase/firestore"
import moment from "moment"
import { randomListOfItemIds } from "../utils/gameLogic"

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

  proposeGame = ({ gameName }) => {
    const user = this.auth.currentUser
    if (!user) {
      console.error("trying to create a game when not signed in")
      return null
    }
    const gamesRef = this.firestore.collection("games")
    return gamesRef.add({
      gameName,
      startedBy: user.uid,
      inProgress: false,
      completed: false
    })
  }
  createGameFromInvites = ({ memberUIDs, gameId, gameName }) => {
    const _promises = []
    const user = this.auth.currentUser
    const gameRef = this.fdb.ref(`/currentGames/${gameId}`)
    const startedBy = user.uid
    const gameStates = memberUIDs.reduce((obj, uid) => {
      const storagePile = randomListOfItemIds(uid)
      obj[uid] = {
        storagePile,
        house: {},
        inviteStillExists: true,
        lastSeen: false
      }
      return obj
    }, {})
    _promises.push(
      gameRef.update({
        gameName,
        startedBy,
        memberUIDs,
        whosTurnItIs: { uid: memberUIDs[0], startTime: moment().toISOString() },
        centerCardPile: [],
        gameStates
      })
    )
    const firestoreRef = this.firestore.doc(`/games/${gameId}`)
    _promises.push(
      firestoreRef.update({
        memberUIDs,
        inProgress: true,
        completed: false
      })
    )
    return Promise.all(_promises)
  }
  doSendInvite = ({
    uid,
    displayName = "unknown",
    avatarNumber,
    gameName,
    gameId,
    confirmed = false
  }) => {
    const user = this.auth.currentUser
    const invitesRef = this.firestore.collection("invites")
    return invitesRef.add({
      invited: uid,
      invitedBy: user.uid,
      avatarNumber,
      confirmed,
      displayName,
      gameName,
      gameId,
      timeStamp: moment().toISOString()
    })
  }
  cancelInvitation = ({ inviteId, uid }) => {
    const user = this.auth.currentUser
    if (uid === user.uid) {
      console.error("dont disinvite yourself")
      return null
    }
    return this.firestore.doc(`/invites/${inviteId}`).delete()
  }
  cancelMyInviteFromThisGame = async ({ gameId }) => {
    const user = this.auth.currentUser
    const inviteRef = this.firestore
      .collection("invites")
      .where("invited", "==", user.uid)
      .where("gameId", "==", gameId)
    const docs = await inviteRef.get().then(snapshot => {
      const _docs = []
      snapshot.forEach(doc => {
        _docs.push(doc.id)
      })
      return _docs
    })
    await Promise.all(
      docs.map(docId => this.firestore.doc(`invites/${docId}`).delete())
    )

    const myGameStateRef = this.fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}`
    )
    await myGameStateRef.update({ inviteStillExists: false })
  }
  doAcceptInvite = ({ inviteId }) => {
    return this.firestore
      .doc(`/invites/${inviteId}`)
      .update({ confirmed: true })
  }
  convertInviteToGame = ({ inviteId }) => {
    return this.firestore.doc(`/invites/${inviteId}`).update({ started: true })
  }
  updateLastSeen = ({ gameId }) => {
    const user = this.auth.currentUser
    const myGameStateRef = this.fdb.ref(
      `/currentGames/${gameId}/gameStates/${user.uid}`
    )
    const lastSeen = moment().toISOString()
    myGameStateRef.update({ lastSeen })
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

  deleteGame = async ({ gameId }) => {
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
