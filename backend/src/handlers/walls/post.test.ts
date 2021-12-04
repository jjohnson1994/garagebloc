import { handler } from "./post";

describe("POST Wall", () => {
  it("returns 400 if schema validation fails", async () => {
    const event = {
      body: {
        wallName: "only one field",
      },
    };

    // @ts-ignore
    const response = await handler(event);

    expect(response).toMatchObject({
      statusCode: 400,
    });
  });
});
