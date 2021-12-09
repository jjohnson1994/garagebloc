import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "../elements/Button";
import Form, {AutoComplete} from "../elements/Form";
import Input, { InputType } from "../elements/Input";
import RadioGroup from "../elements/RadioGroup";
import { createWall } from "../api/wall";
import { CreateWallForm, Visibility } from "core/types";
import { yup } from "core/schemas";
import { popupError, popupSuccess } from "../helpers/alerts";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const NewWallFormSchema = yup
  .object({
    wallName: yup.string().required("Required"),
    overhangDeg: yup
      .number()
      .typeError("Must be a number")
      .required("Required")
      .min(-90)
      .max(90),
    widthCm: yup.number().typeError("Must be a number").required("Required"),
    heightCm: yup.number().typeError("Must be a number").required("Required"),
    imageFile: yup.mixed().required("Required"),
    visibility: yup
      .mixed()
      .oneOf(Object.values(Visibility))
      .required("Required"),
  })
  .required();

const CreateBoard = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWallForm>({
    resolver: yupResolver(NewWallFormSchema),
  });

  const formOnSubmit: SubmitHandler<CreateWallForm> = async (value) => {
    try {
      setIsLoading(true);
      const { id  }= await createWall(value);
      popupSuccess("Created!");
      history.replace(`/wall/${id}`);
    } catch (error) {
      console.error(error);
      popupError("Something has gone wrong, try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Create a Wall</h1>
        <Form onSubmit={handleSubmit(formOnSubmit)} autoComplete={ AutoComplete.off }>
          <Input
            label="Wall Name"
            {...register("wallName")}
            error={errors.wallName?.message}
          />
          <Input
            label="Overhang"
            {...register("overhangDeg")}
            error={errors.overhangDeg?.message}
            placeholder="45"
            type={InputType.Number}
            addOnRight={
              <p className="control">
                <span className="button is-static">degrees</span>
              </p>
            }
          />
          <Input
            label="Width"
            {...register("widthCm")}
            error={errors.widthCm?.message}
            placeholder="360"
            type={InputType.Number}
            addOnRight={
              <p className="control">
                <span className="button is-static">cm</span>
              </p>
            }
          />
          <Input
            label="Height"
            {...register("heightCm")}
            error={errors.heightCm?.message}
            placeholder="240"
            type={InputType.Number}
            addOnRight={
              <p className="control">
                <span className="button is-static">cm</span>
              </p>
            }
          />

          <Input
            label="Image"
            {...register("imageFile")}
            error={errors.imageFile?.message}
            type={InputType.File}
          />

          <RadioGroup
            label="Visibility"
            {...register("visibility")}
            radioOptions={Visibility}
            error={errors.visibility?.message}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Create
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default CreateBoard;
