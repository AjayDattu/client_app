import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth"; // ✅ Import RecaptchaVerifier properly

const firebaseConfig = {
  apiKey: "AIzaSyC3AWBcjsmjxOY9c-NRiWRB748u9hg4l-Y",
  authDomain: "surya-d31ee.firebaseapp.com",
  projectId: "surya-d31ee",
  storageBucket: "surya-d31ee.firebasestorage.app",
  messagingSenderId: "483141156724",
  appId: "1:483141156724:web:a88c32864053eb814ef621",
  measurementId: "G-PB0SWNQMDV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signOut, RecaptchaVerifier, signInWithPhoneNumber }; // ✅ Ensure RecaptchaVerifier is exported
