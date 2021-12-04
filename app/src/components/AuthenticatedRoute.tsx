import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { useAppContext } from "../context/appContext";

interface Props {
  exact: boolean
  path: string
}

const AuthenticatedRoute: React.FC<Props> = ({ children, ...rest }) => {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();

  return (
    <Route {...rest}>
      {isAuthenticated ? (
        children
      ) : (
        <Redirect to={`/login?redirect=${pathname}${search}`} />
      )}
    </Route>
  );
}

export default AuthenticatedRoute
