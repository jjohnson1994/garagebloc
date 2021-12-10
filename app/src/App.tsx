import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CreateWall from "./pages/CreateWall";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import { AppContext } from "./context/appContext";
import Signup from "./pages/Signup";
import SignupConfirm from "./pages/SignupConfirm";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Wall from "./pages/Wall";
import RouteView from "./pages/Route";
import CreateRoute from "./pages/CreateRoute";
import AddRouteToLog from "./pages/AddRouteToLog";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      setIsAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        console.error(error)
        alert(error);
      }
    }

    setIsAuthenticating(false);
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAuthenticating,
        setIsAuthenticating
      }}
    >
      <BrowserRouter>
        <div id="app">
          <NavBar />
          <Switch>
            <UnauthenticatedRoute exact path="/login">
              <Login />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute exact path="/signup">
              <Signup />
            </UnauthenticatedRoute>
            <UnauthenticatedRoute exact path="/signup-confirm">
              <SignupConfirm />
            </UnauthenticatedRoute>
            <AuthenticatedRoute exact path="/create-wall">
              <CreateWall />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/wall/:wallId">
              <Wall />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/wall/:wallId/route/:routeId">
              <RouteView />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/wall/:wallId/route/:routeId/add-to-log">
              <AddRouteToLog />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/wall/:wallId/create-route">
              <CreateRoute />
            </AuthenticatedRoute>
            <AuthenticatedRoute exact path="/profile">
              <Profile />
            </AuthenticatedRoute>
            <Route path="/">
              <Landing />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
