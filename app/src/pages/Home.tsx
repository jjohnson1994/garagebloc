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
import { Storage } from "aws-amplify";

const Home = () => {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [wallImageUrls, setWallImageUrls] = useState<Record<string, string>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { walls }: { walls: Wall[] } = await getWalls();
        setWalls(walls);

        const wallImageRequests = await Promise.all(
          walls.map(async ({ wallId, imageKey }) => {
            const image = await Storage.get(imageKey);

            return { wallId, image };
          })
        );

        const wallImages = wallImageRequests.reduce((acc, cur) => {
          return {
            ...acc,
            [cur.wallId]: cur.image
          }
        }, {})

        setWallImageUrls(wallImages);
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
        <div className="block container">
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
            <Link
              to={`/wall/${wall.wallId}`}
              key={wall.wallId}
            >
              <Box>
                <article className="media">
                  <div className="media-left">
                    <figure className="image is-128x128">
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        src={wallImageUrls[wall.wallId]}
                        alt={wall.wallName}
                      />
                    </figure>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <p className="subtitle is-5">
                        <strong>{wall.wallName}</strong>
                      </p>
                      <WallTitleTags
                        routeCount={wall.routeCount}
                        logCount={wall.logCount}
                        memberCount={wall.memberCount}
                      />
                    </div>
                  </div>
                </article>
              </Box>
              <span className="mb-2"></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
