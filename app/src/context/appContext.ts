import { useContext, createContext } from "react";

export const AppContext = createContext<{
  isAuthenticated: boolean,
  setIsAuthenticated: (isAuthenticated: boolean) => void
  isAuthenticating: boolean,
  setIsAuthenticating: (isAuthenticating: boolean) => void
}>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isAuthenticating: false,
  setIsAuthenticating: () => {}
});

export function useAppContext() {
  return useContext(AppContext);
}
