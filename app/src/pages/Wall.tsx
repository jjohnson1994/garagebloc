import { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { Wall, Route } from "core/types";
import { Link, useParams } from "react-router-dom";
import { getWall } from "../api/wall";
import { getRoutes } from "../api/route";
import LoadingSpinner from "../components/LoadingSpinner";
import { popupError } from "../helpers/alerts";
import WallTitleTags from "../components/WallTitleTags";
import Button from "../elements/Button";
import Box from "../elements/Box";

const WallView = () => {
  const { wallId } = useParams<{ wallId: string }>();
  const [wall, setWall] = useState<Wall>();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const doGetWall = async () => {
      try {
        setLoading(true);
        const { wall: newWall } = await getWall(wallId);
        const url = await Storage.get(newWall.imageKey);
        setWall(newWall);
        setImageUrl(url);

        const { routes } = await getRoutes(wallId);
        setRoutes(routes);
      } catch (error) {
        console.error("Error loading wall", error);
        popupError("Somethings gone wrong, try again");
      } finally {
        setLoading(false);
      }
    };

    doGetWall();
  }, [wallId]);

  return (
    <>
      {loading && !wall && (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      )}
      {!loading && wall && (
        <section className="section">
          <div className="block container">
            <div className="columns">
              <div className="column">
                <img src={imageUrl} alt={wall?.wallName} />
              </div>
              <div className="column">
                <h1 className="title">{wall.wallName}</h1>
                <WallTitleTags
                  routeCount={wall.routeCount}
                  logCount={wall.logCount}
                  memberCount={wall.memberCount}
                />
                <div className="buttons">
                  <Link to={`/wall/${wall.wallId}/create-route`}>
                    <Button icon="fas fa-plus">Add Route</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="block container">
            <h1 className="title">Routes</h1>
            {routes?.map((route) => (
              <Link to={`/wall/${wall?.wallId}/route/${route.routeId}`} key={route.routeId} className="pb-2">
                <Box>
                  <p className="subtitle is-5">
                    <strong>{route.title}</strong>
                  </p>
                  <div className="tags">
                    { route.userLogs && (
                      <div className="tag is-success"><i className="fas fa-check mr-1"/>Done</div>
                    )}
                    <div className="tag">Grade {route.grade}</div>
                    <div className="tag">Logs { route.logCount }</div>
                  </div>
                </Box>
                <span className="mb-2"></span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default WallView;
