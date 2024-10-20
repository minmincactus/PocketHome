import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBDOu8SFxtaLwsAPfpwFM6NIY3clL4zLh0',
  authDomain: 'pockethome-58852.firebaseapp.com',
  projectId: 'pockethome-58852',
  storageBucket: 'pockethome-58852.appspot.com',
  messagingSenderId: '335838734439',
  appId: '1:335838734439:web:cb1bcf94b3f36639118cc2',
  measurementId: 'G-7V5Z37V8B9',
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase Authentication for React Native
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code !== 'auth/already-initialized') {
    console.error('Firebase initialization error:', error);
  }
  auth = getAuth(app);
}

// Initialize Firestore
const firestore = getFirestore(app);

export { auth, firestore };
