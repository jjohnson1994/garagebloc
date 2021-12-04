import * as yup from "yup";

export * as yup from "yup";

export const NewRouteFormSchema = yup
  .object({
    title: yup.string().required("Required"),
    description: yup.string(),
    grade: yup.string().required("Required"),
    drawing: yup
      .object()
      .shape({
        schemaVersion: yup.number().required("Required").oneOf([1]),
        points: yup.array().of(yup.array().of(yup.number()).length(2)),
      })
      .required()
      .noUnknown(),
  })
  .required()
  .noUnknown();

export const LogRouteSchema = yup
  .object({
    rating: yup.number().min(0).max(3).required("Required"),
    comments: yup.string(),
    suggestedGrade: yup.string().required("Required"),
  })
  .required()
  .noUnknown();
