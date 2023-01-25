import { yupResolver } from "@hookform/resolvers/yup";
import { grades } from "core/globals";
import { yup } from "core/schemas";
import { LogRouteForm } from "core/types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { createLog } from "../api/log";
import Button, { ButtonType, Color } from "../elements/Button";
import Form, {AutoComplete} from "../elements/Form";
import Select from "../elements/Select";
import TextArea from "../elements/TextArea";
import { popupError, popupSuccess } from "../helpers/alerts";

const LogRouteSchema = yup
  .object({
    rating: yup.number().min(0).max(3).required("Required"),
    comments: yup.string(),
    suggestedGrade: yup.string().required("Required"),
  })
  .required()
  .noUnknown();

const AddRouteToLog = () => {
  const history = useHistory();
  const { wallId, routeId } = useParams<{ wallId: string, routeId: string }>();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogRouteForm>({
    resolver: yupResolver(LogRouteSchema),
  });

  const formOnSubmit: SubmitHandler<LogRouteForm> = async (value) => {
    try {
      setLoading(true);
      await createLog({wallId, routeId, log: value});
      popupSuccess("Logged!");
      history.replace(`/wall/${wallId}/route/${routeId}`);
    } catch (error) {
      console.error(error);
      popupError("Something has gone wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <Form onSubmit={handleSubmit(formOnSubmit)} autoComplete={ AutoComplete.off }>
          <Select
            label="Rating"
            {...register("rating")}
            error={errors.rating?.message}
            options={[0, 1, 2, 3]}
          />
          <TextArea
            label="Comments"
            {...register("comments")}
            error={errors.comments?.message}
          />
          <Select
            label="Grade"
            {...register("suggestedGrade")}
            error={errors.suggestedGrade?.message}
            options={grades}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={loading}
            icon="fas fa-check"
          >
            Done
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default AddRouteToLog;
