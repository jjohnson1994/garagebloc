"use strict";
exports.__esModule = true;
exports.LogRouteSchema = exports.SetupWallFormSchema = exports.SetupWallFormDrawing = exports.SetupWallFormHoldLayoutSchema = exports.SetupWallFormHoldLayout = exports.NewRouteFormSchema = exports.DrawingSchemaVersions = exports.yup = void 0;
var yup = require("yup");
var globals_1 = require("../globals");
exports.yup = require("yup");
exports.DrawingSchemaVersions = yup
    .number()
    .required("Required")
    .min(1)
    .max(globals_1.DrawingSchemaVersion);
exports.NewRouteFormSchema = yup
    .object({
    title: yup.string().required("Required"),
    description: yup.string(),
    grade: yup.string().oneOf(globals_1.grades).required("Required"),
    drawing: yup
        .object()
        .shape({
        schemaVersion: exports.DrawingSchemaVersions,
        holds: yup.array().of(yup.object().shape({
            id: yup.string().required().length(21),
            mirrors: yup.string().length(21),
            points: yup
                .array()
                .of(yup.array().of(yup.number().required()).length(2))
        })
            .required()
            .noUnknown())
    })
        .required()
        .noUnknown()
})
    .required()
    .noUnknown();
exports.SetupWallFormHoldLayout = yup
    .string()
    .oneOf(globals_1.holdLayouts.map(function (_a) {
    var name = _a.name;
    return name;
}))
    .required("Required");
exports.SetupWallFormHoldLayoutSchema = yup
    .object()
    .shape({
    holdLayout: exports.SetupWallFormHoldLayout
})
    .required()
    .noUnknown();
exports.SetupWallFormDrawing = yup
    .object()
    .shape({
    schemaVersion: yup
        .number()
        .required("Required")
        .oneOf([globals_1.DrawingSchemaVersion]),
    holds: yup.array().of(yup.object().shape({
        id: yup.string().required().length(21),
        mirrors: yup.string().length(21),
        points: yup
            .array()
            .of(yup.array().of(yup.number().required()).length(2))
    })
        .required()
        .noUnknown())
})
    .required()
    .noUnknown();
exports.SetupWallFormSchema = yup
    .object({
    holdLayout: exports.SetupWallFormHoldLayout,
    drawing: exports.SetupWallFormDrawing
})
    .required()
    .noUnknown();
exports.LogRouteSchema = yup
    .object({
    rating: yup.number().min(0).max(3).required("Required"),
    comments: yup.string(),
    suggestedGrade: yup.string().oneOf(globals_1.grades).required("Required")
})
    .required()
    .noUnknown();
