// src/services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

/**
 * Creates a new user account and saves profile to Firestore
 */
export async function signupUser(name, email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const user = credential.user

  await updateProfile(user, { displayName: name })

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    createdAt: serverTimestamp(),
  })

  return user
}

/**
 * Signs in an existing user with email and password
 */
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/**
 * Signs out the current user
 */
export async function logoutUser() {
  await signOut(auth)
}

/**
 * Returns the currently authenticated user object
 */
export function getCurrentUser() {
  return auth.currentUser
}

/**
 * Fetches user profile document from Firestore
 */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

/**
 * Maps Firebase auth error codes to readable messages
 */
export function getAuthErrorMessage(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential': 'Invalid email or password.',
  }
  return map[code] || 'An unexpected error occurred. Please try again.'
}
