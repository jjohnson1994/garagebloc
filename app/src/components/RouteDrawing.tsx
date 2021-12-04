import {Route} from "core/types"

interface Props extends Pick<Route, 'drawing'> {
  backgroundImageUrl: string,
}

const RouteDrawing: React.FC<Props> = ({ backgroundImageUrl, drawing }) => {
  const drawPoints = () => {
    return drawing.points.map(([x, y], index, arr) => (
      <ellipse
        key={index}
        cx={x}
        cy={y}
        rx="14"
        ry="14"
        fill="transparent"
        stroke="yellow"
        strokeWidth="4"
        style={{
          ...((index as number) === arr.length - 1 && {
            pointerEvents: "none",
          }),
        }}
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
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
        >
          {drawPoints()}
        </svg>
      </div>
    </div>

  )
}

export default RouteDrawing
