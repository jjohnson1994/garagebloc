import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  exact: boolean
  path: string
}

const AuthenticatedRoute: React.FC<Props> = ({ children, ...rest }) => {
  const { pathname, search } = useLocation();
  const { isAuthenticated, isAuthenticating } = useAppContext();

  return (
    <Route {...rest}>
      {isAuthenticating && (
        <LoadingSpinner />
      )}
      {isAuthenticated && !isAuthenticating && (
        children
      )}
      {!isAuthenticated && !isAuthenticating && (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  );
}

export default AuthenticatedRoute
