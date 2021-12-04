import Tippy from "@tippyjs/react";
import { Link } from "react-router-dom";
import Button from "../elements/Button";
import { Wall } from "core/types";
import { useEffect, useState } from "react";
import { getWalls } from "../api/wall";
import { popupError } from "../helpers/alerts";
import Box from "../elements/Box";
import LoadingSpinner from "../components/LoadingSpinner";
import WallTitleTags from "../components/WallTitleTags";

const Home = () => {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("user effect");
    (async () => {
      try {
        setLoading(true);
        const { walls } = await getWalls();
        console.log(walls);
        setWalls(walls);
      } catch (error) {
        console.error(error);
        popupError("Somethings gone wrong, try again");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <section id="home" className="section">
        <div className="container">
          <h1 className="title">Your Walls</h1>

          <Tippy
            trigger="click"
            interactive={true}
            placement="bottom-start"
            hideOnClick={true}
            content={
              <div className="dropdown is-active">
                <div className="dropdown-menu" style={{ position: "relative" }}>
                  <div className="dropdown-content">
                    <button className="dropdown-item button is-white is-cursor-pointer">
                      <span className="icon">
                        <i className="fas fw fa-search"></i>
                      </span>
                      <span>Find a Wall</span>
                    </button>
                    <Link to="/create-wall">
                      <button className="dropdown-item button is-white is-cursor-pointer">
                        <span className="icon">
                          <i className="fas fw fa-plus"></i>
                        </span>
                        <span>Create New Wall</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            }
          >
            <Button icon="fas fw fa-plus">Add More</Button>
          </Tippy>
          <hr />
          {loading && !walls.length && <LoadingSpinner />}
          {walls?.map((wall) => (
            <>
              <Link to={`/wall/${wall.wallId}`} key={ wall.wallId }>
                <Box>
                  <p className="subtitle is-5">
                    <strong>{wall.wallName}</strong>
                  </p>
                  <WallTitleTags
                    routeCount={ wall.routeCount }
                    logCount={ wall.logCount }
                    memberCount={ wall.memberCount }
                  />
                </Box>
              </Link>
            </>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
