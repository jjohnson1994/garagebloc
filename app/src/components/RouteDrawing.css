import { Storage } from "aws-amplify";
import { yupResolver } from "@hookform/resolvers/yup";
import { grades } from "core/globals";
import { NewRouteFormSchema, yup } from "core/schemas";
import { CreateRouteForm } from "core/types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { createRoute } from "../api/route";
import { getWall } from "../api/wall";
import Button, { ButtonType, Color } from "../elements/Button";
import Form from "../elements/Form";
import Input from "../elements/Input";
import Select from "../elements/Select";
import TextArea from "../elements/TextArea";
import { popupError, popupSuccess } from "../helpers/alerts";

import "./CreateRoute.css";
import { domToSvgPoint } from "../helpers/svg";

const CreateRoute = () => {
  const history = useHistory();
  const { wallId } = useParams<{ wallId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [points, setPoints] = useState<[number, number][]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateRouteForm>({
    resolver: yupResolver(NewRouteFormSchema),
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

  const formOnSubmit: SubmitHandler<CreateRouteForm> = async (value) => {
    try {
      setLoading(true);
      const { routeId } = await createRoute(wallId, value);
      popupSuccess("Created!");
      history.replace(`/wall/${wallId}/route/${routeId}`);
    } catch (error) {
      console.error(error);
      popupError("Something has gone wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  const clearPoints = () => {
    const newPoints: [number, number][] = [];
    setPoints(newPoints);
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

    const newPoints: [number, number][] = [
      ...points,
      [parseFloat(x.toFixed(2)), parseFloat(y.toFixed(2))],
    ];
    setPoints(newPoints);
    setValue("drawing", {
      schemaVersion: 1,
      points: newPoints,
    });
  };

  const drawPoints = () => {
    return points.map(([x, y], index, arr) => (
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
    <section className="section">
      <div className="container">
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
            >
              {drawPoints()}
            </svg>
          </div>
        </div>
        <Button onClick={clearPoints} icon="fas fa-trash-alt">
          Clear
        </Button>
        <hr />
        <h1 className="title">Route Details</h1>
        <Form onSubmit={handleSubmit(formOnSubmit)}>
          <Input
            label="Title"
            {...register("title")}
            error={errors.title?.message}
          />
          <TextArea
            label="Description"
            {...register("description")}
            error={errors.description?.message}
          />
          <Select
            label="Grade"
            {...register("grade")}
            error={errors.grade?.message}
            options={grades}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={loading}
          >
            Create
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default CreateRoute;
