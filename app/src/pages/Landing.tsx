import {Link} from "react-router-dom";
import { appTitle } from "../config.json";
import { useAppContext } from "../context/appContext";
import Button, {Color} from "../elements/Button";
import Home from "./Home";

const Landing = () => {
  const { isAuthenticated, isAuthenticating } = useAppContext();

  const Landing = () => (
    <>
      <section className="section">
        <div className="container">
            <div className="columns">
              <div className="column">
                <img src="exampleboard.png" alt="example board"/>
              </div>
              <div className="column">
                <div className="content">
                  <h1 className="title">{ appTitle }</h1>
                  <p className="subtitle">The app for logging board climbs</p>
                  <p>Upload your board to the GarageBloc app, create and log climbs, track progress and share climbs:</p>
                  <ul>
                    <li>GarageBloc is free for everyone</li>
                    <li>There are no limits on the number of holds or climbs</li>
                    <li>Easily add new holds to a board, without having to re-log every climb</li>
                    <li>Problems can be mirrored automatically</li>
                  </ul>
                  <div className="pt-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to="/signup">
                      <Button color={ Color.isPrimary }>Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>
    </>
  );

  return (
    <>
      {isAuthenticating && <p>Loading...</p>}
      {!isAuthenticating && isAuthenticated && <Home />}
      {!isAuthenticating && !isAuthenticated && <Landing />}
    </>
  );
};

export default Landing;
