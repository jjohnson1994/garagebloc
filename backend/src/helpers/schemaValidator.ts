import { yup } from "core/schemas"

export const validateDataAgainstSchema = async (data: any, schema: yup.AnySchema) => {
  const isValid = await schema.isValid(data, {
    strict: true
  })

  if (isValid) {
    return true;
  } else {
    throw new Error("Invalid Schema")
  }
}
