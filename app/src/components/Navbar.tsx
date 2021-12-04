import { Link } from "react-router-dom";
import { appTitle } from "../config.json";
import {useAppContext} from "../context/appContext";
import Button, {Color} from "../elements/Button";

const NarBar = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <nav
      className="navbar has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a
          className="navbar-item has-text-weight-medium"
          href={window.location.origin}
        >
          {appTitle}
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            {isAuthenticated ? (
              <Link to="/profile">
                <Button icon="fas fa-user">Profile</Button>
              </Link>
            ) : (
              <div className="field is-grouped">
                <p className="control">
                  <Link to="/login">
                    <Button>Login</Button>
                  </Link>
                </p>
                <p className="control">
                  <Link to="/signup">
                    <Button color={ Color.isPrimary }>Signup</Button>
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NarBar;
