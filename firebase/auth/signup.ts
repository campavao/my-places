import firebase_app from "../firebase.config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signUp(email: string, password: string) {
  let result = null;
  let error: { code: string } | null = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    error = e;
  }

  return { result, error };
}
