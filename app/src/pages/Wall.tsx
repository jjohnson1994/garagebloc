import { useEffect, useState, ChangeEventHandler, FormEvent } from "react";
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
import RouteDrawing from "../components/RouteDrawing";
import Form, { AutoComplete } from "../elements/Form";
import Range from "../elements/Range";

const WallView = () => {
  const { wallId } = useParams<{ wallId: string }>();
  const [wall, setWall] = useState<Wall>();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<
    Record<string, (route: Route) => boolean>
  >({});
  const [minGradeFilterValue, setMinGradeFilterValue] =
    useState<number>(0);
  const [maxGradeFilterValue, setMaxGradeFilterValue] =
    useState<number>(0);
  const [routeGradeRange, setRouteGradeRange] = useState<Record<number, string>>(
    {}
  );

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

        const routeGradeRange = routes
          .map((route) => route.grade)
          .sort()
          .reduce((acc: string[], cur: string) => {
            if (Object.values(acc).includes(cur)) {
              return acc;
            }

            return [...acc, cur];
          }, [])
          .reduce((acc, cur, index) => {
            return {
              ...acc,
              [index]: cur,
            };
          }, {});

        setRouteGradeRange(routeGradeRange);
        setMaxGradeFilterValue(Object.values(routeGradeRange).length - 1)
        console.log(routeGradeRange);
      } catch (error) {
        console.error("Error loading wall", error);
        popupError("Somethings gone wrong, try again");
      } finally {
        setLoading(false);
      }
    };

    doGetWall();
  }, [wallId]);

  const getFilteredRoutes = () => {
    return Object.values(filters).reduce((routes: Route[], filter) => {
      return routes.filter(filter);
    }, routes);
  };

  const setMinGradeFilter = (event: FormEvent<HTMLInputElement>) => {
    const minGradeIndex = parseInt(event.currentTarget.value, 10);
    const minGradeString = routeGradeRange[minGradeIndex];
    const filter = (route: Route) => route.grade >= minGradeString;

    const newFilters = {
      ...filters,
      gradesAbove: filter,
    };

    setMinGradeFilterValue(minGradeIndex);
    setFilters(newFilters);
  };

  const setMaxGradeFilter = (event: FormEvent<HTMLInputElement>) => {
    const maxGradeIndex = parseInt(event.currentTarget.value, 10);
    const maxGradeString = routeGradeRange[maxGradeIndex];
    const filter = (route: Route) => route.grade <= maxGradeString;

    const newFilters = {
      ...filters,
      gradesBelow: filter,
    };

    setMaxGradeFilterValue(maxGradeIndex);
    setFilters(newFilters);
  };

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
                  {wall.drawing && (
                    <Link to={`/wall/${wall.wallId}/create-route`}>
                      <Button icon="fas fa-plus">Add Route</Button>
                    </Link>
                  )}
                  <Link to={`/wall/${wall.wallId}/setup`}>
                    <Button icon="fas fa-plus">Setup</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="block container">
            <h1 className="title">Routes</h1>
            <button className="button">
              <span className="icon is-small">
                <i className="fas fa-filter"></i>
              </span>
              <span>Filter</span>
            </button>
            {getFilteredRoutes()?.map((route) => (
              <Link
                to={`/wall/${wall?.wallId}/route/${route.routeId}`}
                key={route.routeId}
              >
                <Box>
                  <article className="media">
                    <div className="media-left">
                      {imageUrl && (
                        <figure className="image is-128x128">
                          <RouteDrawing
                            backgroundImageUrl={imageUrl}
                            drawing={route.drawing}
                            holdHighlightStroke={12}
                          />
                        </figure>
                      )}
                    </div>
                    <div className="media-content">
                      <div className="content">
                        <p className="subtitle is-5">
                          <strong>{route.title}</strong>
                        </p>
                      </div>
                      <div className="tags">
                        {route.userLogs.length > 0 && (
                          <div className="tag is-success">
                            <i className="fas fa-check mr-1" />
                            Done
                          </div>
                        )}
                        <div className="tag">Grade {route.grade}</div>
                        <div className="tag">Logs {route.logCount}</div>
                      </div>
                    </div>
                  </article>
                </Box>
                <span className="mb-2"></span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="box">
            <p className="title is-5">Filter Routes</p>
            <Form autoComplete={AutoComplete.off} onSubmit={() => { }}>
              <Range
                label="Minimum Grade"
                name="filterMinGrade"
                min={0}
                max={maxGradeFilterValue}
                value={minGradeFilterValue}
                valueLabel={routeGradeRange[minGradeFilterValue]}
                onChange={setMinGradeFilter}
              />
              <Range
                label="Maximum Grade"
                name="filterMaxGrade"
                min={minGradeFilterValue}
                max={Object.values(routeGradeRange).length - 1}
                value={maxGradeFilterValue}
                valueLabel={routeGradeRange[maxGradeFilterValue]}
                onChange={setMaxGradeFilter}
              />
            </Form>
          </div>
        </div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>
    </>
  );
};

export default WallView;
