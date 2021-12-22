import { yupResolver } from "@hookform/resolvers/yup";
import { Storage } from "aws-amplify";
import { holdLayouts } from "core/globals";
import {
  SetupWallFormDrawing,
  SetupWallFormHoldLayoutSchema,
} from "core/schemas";
import { Hold, HoldLayout, SetupWallForm } from "core/types";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { getWall, setupWall } from "../api/wall";
import Button, { ButtonType, Color } from "../elements/Button";
import Form, { AutoComplete } from "../elements/Form";
import RadioGroup from "../elements/RadioGroup";
import { popupError, popupSuccess } from "../helpers/alerts";
import { domToSvgPoint } from "../helpers/svg";
import "./CreateRoute.css";
import { useSetupWallFormStateMachine } from "./setupWallFormStateMachine";

enum Tool {
  Cut,
  Mirror,
}

const pathHandleRadius = 6;

const SetupWall = () => {
  const history = useHistory();
  const { wallId } = useParams<{ wallId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [holds, setHolds] = useState<Hold[]>([]);
  const [selectedHoldId, setSelectedHoldId] = useState<string | undefined>();
  const [pointerXY, setPointerXY] = useState<[number, number]>([-10, -10]);
  const { formStage, next } = useSetupWallFormStateMachine();

  const selectedTool = formStage === "drawHolds" ? Tool.Cut : Tool.Mirror;

  const {
    register: setupWallFormRegister,
    handleSubmit: setupWallFormHandleSubmit,
    formState: { errors: setupWallFormErrors },
    getValues: setupWallFormGetValues,
    watch: setupWallFormWatch,
  } = useForm<{ holdLayout: HoldLayout }>({
    resolver: yupResolver(SetupWallFormHoldLayoutSchema),
  });

  const {
    handleSubmit: drawHoldsFormHandleSubmit,
    setValue: drawHoldsFormSetValue,
    getValues: drawHoldsFormGetValues,
    formState: { errors: drawHoldsFormErrors },
  } = useForm<SetupWallForm["drawing"]>({
    resolver: yupResolver(SetupWallFormDrawing),
  });

  useEffect(() => {
    const doGetWall = async () => {
      try {
        const { wall } = await getWall(wallId);
        const url = await Storage.get(wall.imageKey);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading wall", error);
        popupError("Somethings gone wrong, try again");
      }
    };

    doGetWall();
  }, [wallId]);

  const settingsOnSubmit: SubmitHandler<{ holdLayout: HoldLayout }> = () => {
    next();
  };

  const drawHoldsOnSubmit: SubmitHandler<SetupWallForm["drawing"]> = () => {
    next();
  };

  const confirmOnSubmit = async () => {
    try {
      setLoading(true);
      const setupData: SetupWallForm = {
        holdLayout: setupWallFormGetValues("holdLayout"),
        drawing: {
          schemaVersion: drawHoldsFormGetValues("schemaVersion"),
          holds: drawHoldsFormGetValues("holds"),
        },
      };
      await setupWall(wallId, setupData);
      await popupSuccess("Setup Complete!");
      history.push(`/wall/${wallId}`);
    } catch (error) {
      console.error(error);
      popupError("Something has gone wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  const clearHolds = () => {
    setHolds([]);
    setSelectedHoldId(undefined);
  };

  const clearHoldMirrorsKeys = () => {
    setHolds(
      holds.map((hold) => {
        return {
          id: hold.id,
          points: hold.points,
        };
      })
    );
    setSelectedHoldId(undefined);
  };

  const canvasOnPointerUp = ({ clientX, clientY }: PointerEvent) => {
    const canvasElement = document.querySelector("svg");

    if (!canvasElement) {
      throw new Error("Error: Canvas Element is Not on Page");
    }

    if (loading) {
      return;
    }

    const { x, y } = domToSvgPoint({ clientX, clientY }, canvasElement);

    if (selectedTool === Tool.Cut) {
      if (!selectedHoldId) {
        const newId = nanoid();
        const newHolds: Hold[] = [
          ...holds,
          {
            id: newId,
            points: [[parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))]],
          },
        ];

        setHolds(newHolds);
        setSelectedHoldId(newId);
      } else if (
        Math.abs(
          (holds.find(({ id }) => id === selectedHoldId)?.points[0][0] || 0) - x
        ) < pathHandleRadius &&
        Math.abs(
          (holds.find(({ id }) => id === selectedHoldId)?.points[0][1] || 0) - y
        ) < pathHandleRadius
      ) {
        const newHolds: Hold[] = holds.map((hold) => {
          if (hold.id === selectedHoldId) {
            return {
              ...hold,
              points: [...hold.points, [hold.points[0][0], hold.points[0][1]]],
            };
          }

          return hold;
        });

        setHolds(newHolds);
        setSelectedHoldId(undefined);
      } else {
        const newHolds: Hold[] = holds.map((hold) => {
          if (hold.id === selectedHoldId) {
            return {
              ...hold,
              points: [
                ...hold.points,
                [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))],
              ],
            };
          }

          return hold;
        });

        setHolds(newHolds);
      }

      drawHoldsFormSetValue("schemaVersion", 2);
      drawHoldsFormSetValue("holds", holds);
    }
  };

  const holdOnPointerUp = (holdId: string) => {
    if (selectedTool === Tool.Mirror) {
      if (!selectedHoldId) {
        setSelectedHoldId(holdId);
      } else {
        setMirroredHolds(holdId, selectedHoldId);
        setSelectedHoldId(undefined);
      }
    }
  };

  const setMirroredHolds = (holdIdA: string, holdIdB: string) => {
    const newHolds = holds.map((hold) => {
      if (hold.id === holdIdA) {
        return {
          ...hold,
          mirrors: holdIdB,
        };
      }

      if (hold.id === holdIdB) {
        return {
          ...hold,
          mirrors: holdIdA,
        };
      }

      return hold;
    });

    setHolds(newHolds);
    drawHoldsFormSetValue("schemaVersion", 2);
    drawHoldsFormSetValue("holds", newHolds);
  };

  const canvasOnPointerMove = ({ clientX, clientY }: PointerEvent) => {
    const canvasElement = document.querySelector("svg");

    if (!canvasElement) {
      throw new Error("Error: Canvas Element is Not on Page");
    }

    if (loading) {
      return;
    }

    const { x, y } = domToSvgPoint({ clientX, clientY }, canvasElement);
    setPointerXY([parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))]);
  };

  const drawHolds = ({ hideMirrored = false }: { hideMirrored: boolean }) => {
    return holds
      .filter((hold) => hideMirrored === false || !hold.mirrors)
      .map((hold) => (
        <>
          <path
            d={hold.points.reduce(
              (acc, [x, y], index) =>
                `${acc} ${index === 0 ? "M" : "L"} ${x} ${y}`,
              ""
            )}
            strokeWidth="2"
            stroke={hold.id === selectedHoldId ? "yellow" : "white"}
            fill="transparent"
            onPointerUp={() => holdOnPointerUp(hold.id)}
          />
          {hold.id === selectedHoldId && selectedTool === Tool.Cut && (
            <>
              <line
                x1={hold.points[hold.points.length - 1][0]}
                y1={hold.points[hold.points.length - 1][1]}
                x2={pointerXY[0]}
                y2={pointerXY[1]}
                strokeWidth="2"
                stroke="yellow"
              />
              <ellipse
                cx={hold.points[0][0]}
                cy={hold.points[0][1]}
                rx={pathHandleRadius}
                ry={pathHandleRadius}
                strokeWidth="2"
                stroke="yellow"
                fill="transparent"
              />
            </>
          )}
        </>
      ));
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Setup Wall</h1>
        {formStage === "wallSettings" && (
          <Form
            onSubmit={setupWallFormHandleSubmit(settingsOnSubmit)}
            autoComplete={AutoComplete.off}
          >
            <RadioGroup
              label="Hold Layout"
              {...setupWallFormRegister("holdLayout")}
              error={setupWallFormErrors.holdLayout?.message}
              radioOptions={holdLayouts.reduce((acc, cur) => {
                return {
                  ...acc,
                  [cur.name]: cur.name,
                };
              }, {})}
              radioOptionDescriptions={holdLayouts.reduce((acc, cur) => {
                return {
                  ...acc,
                  [cur.name]: cur.descriptions,
                };
              }, {})}
            />
            <Button
              color={Color.isPrimary}
              type={ButtonType.Submit}
              loading={loading}
            >
              Next
            </Button>
          </Form>
        )}
        {formStage === "drawHolds" && (
          <>
            <div className="notification is-primary">
              <strong>Draw Holds</strong>
              <p>
                Click the image below to start cutting out each hold. Click
                'next' at the bottom of the page when you're done
              </p>
            </div>
            <div className="canvasContainer">
              <img
                className="canvasBackground"
                src={imageUrl}
                alt="draw route background"
              />
              <div className="canvas">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 1000"
                  onPointerUp={(event) =>
                    canvasOnPointerUp(event as unknown as PointerEvent)
                  }
                  onPointerMove={(event) =>
                    canvasOnPointerMove(event as unknown as PointerEvent)
                  }
                >
                  {drawHolds({ hideMirrored: false })}
                </svg>
              </div>
            </div>
            <div className="buttons">
              <Button onClick={clearHolds} icon="fas fa-trash-alt">
                Clear
              </Button>
              <Button
                onClick={drawHoldsFormHandleSubmit(drawHoldsOnSubmit)}
                color={Color.isPrimary}
              >
                {setupWallFormWatch("holdLayout") === "Splatter"
                  ? "Submit"
                  : "Next"}
              </Button>
              <p className="has-text-danger">
                {Object.keys(drawHoldsFormErrors).length
                  ? "You haven't drawn any holds"
                  : ""}
              </p>
            </div>
          </>
        )}
        {formStage === "setMirroredHolds" && (
          <>
            <div className="notification is-primary">
              <strong>Mirror Holds</strong>
              <p>
                To link any mirrored holds: first click on a hold, then click on
                the hold it is paired with. If a hold is in the centre of the
                wall, so the same when mirrored, click it twice. Click 'Setup
                Wall' at the bottom of the page when you're done
              </p>
            </div>
            <div className="canvasContainer">
              <img
                className="canvasBackground"
                src={imageUrl}
                alt="draw route background"
              />
              <div className="canvas">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1000 1000"
                  onPointerUp={(event) =>
                    canvasOnPointerUp(event as unknown as PointerEvent)
                  }
                  onPointerMove={(event) =>
                    canvasOnPointerMove(event as unknown as PointerEvent)
                  }
                >
                  {drawHolds({ hideMirrored: true })}
                </svg>
              </div>
            </div>
            <div className="buttons">
              <Button onClick={clearHoldMirrorsKeys} icon="fas fa-trash-alt">
                Clear
              </Button>
              <Button onClick={confirmOnSubmit} color={Color.isPrimary}>
                Setup Wall
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SetupWall;
