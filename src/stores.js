import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyDDn00uprCYk36uf4UKH-COOPzsLuc1JkA',
  authDomain: 'putzfee-a3b88.firebaseapp.com',
  databaseURL: 'https://putzfee-a3b88-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'putzfee-a3b88',
  storageBucket: 'putzfee-a3b88.appspot.com',
  messagingSenderId: '174903135777',
  appId: '1:174903135777:web:69ca3465bc5ab545c65d60'
}

export const app = initializeApp(config)
export const auth = getAuth(app)
export const db = getFirestore(app)
