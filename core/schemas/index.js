"use strict";
exports.__esModule = true;
exports.NewRouteFormSchema = exports.yup = void 0;
var yup = require("yup");
exports.yup = require("yup");
exports.NewRouteFormSchema = yup
    .object({
    title: yup.string().required("Required"),
    description: yup.string(),
    grade: yup.string().required("Required"),
    drawing: yup
        .object()
        .shape({
        schemaVersion: yup.number().required("Required").oneOf([1]),
        points: yup.array().of(yup.array().of(yup.number()).length(2))
    })
        .required()
        .noUnknown()
})
    .required()
    .noUnknown();
/*
 * TODO Importing the schema end up with an error
 *
 * export const NewWallFormSchema = yup
 *   .object({
 *     wallName: yup.string().required("Required"),
 *     overhangDeg: yup
 *       .number()
 *       .typeError("Must be a number")
 *       .required("Required")
 *       .min(-90)
 *       .max(90),
 *     widthCm: yup.number().typeError("Must be a number").required("Required"),
 *     heightCm: yup.number().typeError("Must be a number").required("Required"),
 *     imageFile: yup.string().required("Required"),
 *     visibility: yup
 *       .string()
 *       .oneOf(['public', 'private'])
 *       .required("Required"),
 *   })
 *   .required();
 */
