import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import FirebaseAuth from "../handlers/auth";

const { signIn, signOut, getCurrentUser } = FirebaseAuth;
const Context = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback(() => signIn().then(setCurrentUser), []);
  const logout = useCallback(
    () => signOut().then(() => setCurrentUser(null)),
    []
  );
  const authenticate = useCallback(
    () => getCurrentUser().then(setCurrentUser),
    []
  );

  const value = useMemo(() => {
    return {
      login,
      logout,
      authenticate,
      currentUser,
    };
  }, [login, logout, authenticate, currentUser]); // Add functions to the dependencies array

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAuthContext = () => {
  return useContext(Context);
};

export default AuthProvider;
