import { yup } from "core/schemas";
import { validateDataAgainstSchema } from "./schemaValidator";

const schema = yup
  .object({
    name: yup.string().required("Required"),
    age: yup
      .number()
      .typeError("Must be a number")
      .required("Required")
      .min(1)
      .max(100),
  })
  .required()
  .noUnknown();

describe("validateDataAgainstSchema", () => {
  it("Throws is data is undefined", () => {
    return expect(validateDataAgainstSchema('', schema)).rejects.toThrow(
      "Invalid Schema"
    );
  });

  it("Throws is data is invalid", () => {
    return expect(
      validateDataAgainstSchema({ name: 123, age: 200 }, schema)
    ).rejects.toThrow("Invalid Schema");
  });

  it("Throws is data is missing a field", () => {
    return expect(
      validateDataAgainstSchema({ name: "Garth" }, schema)
    ).rejects.toThrow("Invalid Schema");
  });

  it("Throws is data has extra fields", () => {
    return expect(
      validateDataAgainstSchema({ name: "Garth", age: 50, foo: 'bar' }, schema)
    ).rejects.toThrow("Invalid Schema");
  });

  it("Return true is data is valid", () => {
    return expect(
      validateDataAgainstSchema({ name: "Garth", age: 50 }, schema)
    ).resolves.toBe(true);
  });
});
