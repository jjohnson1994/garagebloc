import React, { cloneElement } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAppContext } from "../context/appContext";

interface Props {
  exact: boolean;
  path: string;
}

const UnauthenticatedRoute: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const { isAuthenticated } = useAppContext();

  return (
    <Route {...rest}>
      {
        // @ts-ignore
        !isAuthenticated ? cloneElement(children, props) : <Redirect to="/profile" />
      }
    </Route>
  );
};

export default UnauthenticatedRoute;
