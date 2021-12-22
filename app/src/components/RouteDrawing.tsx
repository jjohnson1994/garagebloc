import { Route } from "core/types";

interface Props extends Pick<Route, "drawing"> {
  backgroundImageUrl: string;
}

const RouteDrawing: React.FC<Props> = ({ backgroundImageUrl, drawing }) => {
  const drawHolds = () => {
    return drawing.holds.map((hold) => (
      <path
        d={hold.points.reduce(
          (acc, [x, y], index) => `${acc} ${index === 0 ? "M" : "L"} ${x} ${y}`,
          ""
        )}
        strokeWidth="2"
        stroke="yellow"
        fill="transparent"
      />
    ));
  };

  return (
    <div className="canvasContainer">
      <img
        className="canvasBackground"
        src={backgroundImageUrl}
        alt="draw route background"
      />
      <div className="canvas">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000">
          {drawHolds()}
        </svg>
      </div>
    </div>
  );
};

export default RouteDrawing;
