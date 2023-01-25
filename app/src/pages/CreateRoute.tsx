import { Storage } from "aws-amplify";
import { yupResolver } from "@hookform/resolvers/yup";
import { grades } from "core/globals";
import { NewRouteFormSchema } from "core/schemas";
import { CreateRouteForm, Hold, WallDrawing } from "core/types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { createRoute } from "../api/route";
import { getWall } from "../api/wall";
import Button, { ButtonType, Color } from "../elements/Button";
import Form, { AutoComplete } from "../elements/Form";
import Input from "../elements/Input";
import Select from "../elements/Select";
import TextArea from "../elements/TextArea";
import { popupError, popupSuccess } from "../helpers/alerts";

import "./CreateRoute.css";

const CreateRoute = () => {
  const history = useHistory();
  const { wallId } = useParams<{ wallId: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [wallDrawing, setWallDrawing] = useState<WallDrawing>();
  const [selectedHolds, setSelectedHolds] = useState<Hold[]>([]);

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
        setWallDrawing(wall.drawing);
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
    setSelectedHolds([]);
  };

  const holdOnPointerUp = (holdId: string) => {
    if (selectedHolds.find(({ id }) => id === holdId)) {
      deselectHold(holdId);
    } else {
      selectHold(holdId);
    }
  };

  const deselectHold = (holdId: string) => {
    const newSelectedHolds = selectedHolds.reduce((acc: Hold[], cur: Hold) => {
      if (cur.id === holdId) {
        return acc;
      }

      return [...acc, cur];
    }, []);

    setSelectedHolds(newSelectedHolds);
    setValue("drawing", {
      schemaVersion: 2,
      holds: newSelectedHolds,
    });
  };

  const selectHold = (holdId: string) => {
    const hold = wallDrawing?.holds.find(({ id }) => id === holdId);

    if (!hold) {
      return;
    }

    const newSelectedHolds = [...selectedHolds, hold];

    setSelectedHolds(newSelectedHolds);
    setValue("drawing", {
      schemaVersion: 2,
      holds: newSelectedHolds,
    });
  };

  const drawWallHolds = () => {
    return wallDrawing?.holds.map((hold) => (
      <path
        d={hold.points.reduce(
          (acc, [x, y], index) => `${acc} ${index === 0 ? "M" : "L"} ${x} ${y}`,
          ""
        )}
        strokeWidth="2"
        stroke="white"
        fill="transparent"
        onPointerUp={() => holdOnPointerUp(hold.id)}
      />
    ));
  };

  const drawSelectedHolds = () => {
    return selectedHolds.map((hold) => (
      <path
        d={hold.points.reduce(
          (acc, [x, y], index) => `${acc} ${index === 0 ? "M" : "L"} ${x} ${y}`,
          ""
        )}
        strokeWidth="2"
        stroke="yellow"
        fill="transparent"
        onPointerUp={() => holdOnPointerUp(hold.id)}
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
            >
              {drawWallHolds()}
              {drawSelectedHolds()}
            </svg>
          </div>
        </div>
        <Button onClick={clearPoints} icon="fas fa-trash-alt">
          Clear
        </Button>
        <hr />
        <h1 className="title">Route Details</h1>
        <Form
          onSubmit={handleSubmit(formOnSubmit)}
          autoComplete={AutoComplete.off}
        >
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
