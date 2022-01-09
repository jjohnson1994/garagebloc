import { appTitle } from "../config.json";
import { useAppContext } from "../context/appContext";
import Home from "./Home";

const Landing = () => {
  const { isAuthenticated, isAuthenticating } = useAppContext();

  const Landing = () => (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">{ appTitle }</h1>
          <p className="subtitle">The app for logging board climbs</p>
            <div className="columns">
              <div className="column">
                <img src="exampleboard.png" alt="example board"/>
              </div>
              <div className="column"></div>
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
