import { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { Wall, Route } from "core/types";
import { Link, useParams } from "react-router-dom";
import { getWall } from "../api/wall";
import { getRoute } from "../api/route";
import LoadingSpinner from "../components/LoadingSpinner";
import { popupError } from "../helpers/alerts";
import Button from "../elements/Button";
import RouteDrawing from "../components/RouteDrawing";

const RouteView = () => {
  const { wallId, routeId } = useParams<{ wallId: string; routeId: string }>();
  const [wall, setWall] = useState<Wall>();
  const [route, setRoute] = useState<Route>();
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
      } catch (error) {
        console.error("Error loading wall", error);
        popupError("Somethings gone wrong, try again");
      } finally {
        setLoading(false);
      }
    };

    doGetWall();
  }, [wallId]);

  useEffect(() => {
    const doGetRoute = async () => {
      try {
        setLoading(true);
        const { route } = await getRoute(routeId);
        setRoute(route);
      } catch (error) {
        console.error("Error loading route", error);
        popupError("Somethings gone wrong, try again");
      } finally {
        setLoading(false);
      }
    };

    doGetRoute();
  }, [routeId]);

  return (
    <>
      {loading && !wall && (
        <section className="section">
          <div className="container">
            <LoadingSpinner />
          </div>
        </section>
      )}
      {!loading && wall && route && imageUrl && (
        <>
          <section className="section">
            <div className="block container">
              <div className="columns">
                <div className="column">
                  <h1 className="title">{route.title}</h1>
                  <div className="tags">
                    {route.userLogs.length > 0 && (
                      <div className="tag is-success">
                        <i className="fas fa-check mr-1"></i>Done
                      </div>
                    )}
                    <div className="tag">Grade {route.grade}</div>
                    <div className="tag">Logs {route.logCount}</div>
                  </div>
                  <p>{route.description}</p>
                </div>
                <div className="column">
                  <div className="buttons">
                    <Link to={`/wall/${wallId}/route/${routeId}/add-to-log`}>
                      {route.userLogs.length > 0 ? (
                        <Button icon="fas fa-check">Log Repeat</Button>
                      ) : (
                        <Button icon="fas fa-check">Log Ascent</Button>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="block container">
              <RouteDrawing
                backgroundImageUrl={imageUrl}
                drawing={route.drawing}
              />
            </div>
            <div className="block container">
              <table className="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Comments</th>
                    <th>Grade</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {route.userLogs.map((log) => (
                    <tr>
                      <td>{log.createdAt}</td>
                      <td>{log.comments}</td>
                      <td>{log.suggestedGrade}</td>
                      <td>{log.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default RouteView;
