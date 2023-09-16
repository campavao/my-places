"use client";

import React from "react";
import { User, onAuthStateChanged, getAuth } from "firebase/auth";
import firebase_app from "../../firebase/firebase.config";

const auth = getAuth(firebase_app);

interface AuthContext {
  user?: User;
}

export const AuthContext = React.createContext<AuthContext>({});

export const useAuthContext = () => React.useContext(AuthContext);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<User>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
