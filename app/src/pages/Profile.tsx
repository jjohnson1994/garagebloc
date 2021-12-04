import { Auth } from "aws-amplify";
import { useAppContext } from "../context/appContext";
import Button from "../elements/Button";
import { useHistory } from "react-router-dom";

const Profile = () => {
  const { setIsAuthenticated } = useAppContext();
  const history = useHistory();


  const handleLogout = async () => {
    await Auth.signOut();
    setIsAuthenticated(false);
    history.replace("/login");
  };

  return (
    <section className="section">
      <div className="container">
        <Button onClick={() => handleLogout()}>Sign Out</Button>
      </div>
    </section>
  );
};

export default Profile;
