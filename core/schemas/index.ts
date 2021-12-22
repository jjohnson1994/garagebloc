import * as yup from "yup";
import { DrawingSchemaVersion, grades, holdLayouts } from "../globals";

export * as yup from "yup";

export const DrawingSchemaVersions = yup
  .number()
  .required("Required")
  .min(1)
  .max(DrawingSchemaVersion);

export const NewRouteFormSchema = yup
  .object({
    title: yup.string().required("Required"),
    description: yup.string(),
    grade: yup.string().oneOf(grades).required("Required"),
    drawing: yup
      .object()
      .shape({
        schemaVersion: DrawingSchemaVersions,
        holds: yup.array().of(
          yup.object().shape({
            id: yup.string().required().length(21),
            mirrors: yup.string().length(21),
            points: yup
              .array()
              .of(yup.array().of(yup.number().required()).length(2)),
          })
          .required()
          .noUnknown()
        ),
      })
      .required()
      .noUnknown(),
  })
  .required()
  .noUnknown();

export const SetupWallFormHoldLayout = yup
  .string()
  .oneOf(holdLayouts.map(({ name }) => name))
  .required("Required");

export const SetupWallFormHoldLayoutSchema = yup
  .object()
  .shape({
    holdLayout: SetupWallFormHoldLayout,
  })
  .required()
  .noUnknown();

export const SetupWallFormDrawing = yup
  .object()
  .shape({
    schemaVersion: yup
      .number()
      .required("Required")
      .oneOf([DrawingSchemaVersion]),
    holds: yup.array().of(
      yup.object().shape({
        id: yup.string().required().length(21),
        mirrors: yup.string().length(21),
        points: yup
          .array()
          .of(yup.array().of(yup.number().required()).length(2)),
      })
      .required()
      .noUnknown()
    ),
  })
  .required()
  .noUnknown();

export const SetupWallFormSchema = yup
  .object({
    holdLayout: SetupWallFormHoldLayout,
    drawing: SetupWallFormDrawing,
  })
  .required()
  .noUnknown();

export const LogRouteSchema = yup
  .object({
    rating: yup.number().min(0).max(3).required("Required"),
    comments: yup.string(),
    suggestedGrade: yup.string().oneOf(grades).required("Required"),
  })
  .required()
  .noUnknown();
