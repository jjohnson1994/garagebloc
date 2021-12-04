import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { createWall } from "../api/wall";
import CreateWall from "./CreateWall";
import { popupError, popupSuccess } from "../helpers/alerts";
import userEvent from "@testing-library/user-event";

jest.mock("@auth0/auth0-react", () => {
  return {
    useAuth0: () => ({
      getAccessTokenSilently: () => 'access_token'
    })
  }
});

jest.mock("../api/wall", () => {
  const createWall = jest.fn();

  return {
    createWall,
  };
});

jest.mock("../helpers/alerts", () => {
  const popupSuccess = jest.fn();
  const popupError = jest.fn();

  return {
    popupSuccess,
    popupError,
  };
});

const file = new File(["board"], "board.jpg", { type: "image/jpg" });

describe("CreateWall.tsx", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each`
    wallName         | overhangDeg | widthCm | heightCm | visibility
    ${"my new wall"} | ${45}       | ${320}  | ${240}   | ${"private"}
    ${"anothe wall"} | ${50}       | ${500}  | ${300}   | ${"public"}
    ${"Slab"}        | ${-10}      | ${600}  | ${432}   | ${"public"}
  `(
    "Passes form entries to createWall API method",
    async ({ wallName, overhangDeg, widthCm, heightCm, visibility }) => {
      await act(async () => {
        render(<CreateWall></CreateWall>);
      });

      await act(async () => {
        fireEvent.input(screen.getByRole("textbox", { name: /Wall Name/i }), {
          target: {
            value: wallName,
          },
        });

        fireEvent.input(screen.getByRole("spinbutton", { name: /Overhang/i }), {
          target: {
            value: overhangDeg,
          },
        });

        fireEvent.input(screen.getByRole("spinbutton", { name: /Width/i }), {
          target: {
            value: widthCm,
          },
        });

        fireEvent.input(screen.getByRole("spinbutton", { name: /Height/i }), {
          target: {
            value: heightCm,
          },
        });

        userEvent.upload(screen.getByLabelText(/image/i), file);

        fireEvent.click(
          screen.getByRole("radio", { name: new RegExp(`${visibility}`, "i") })
        );

        fireEvent.submit(screen.getByRole("button", { name: "Create" }));
      });

      expect(createWall).toHaveBeenCalledWith('access_token', {
        wallName,
        overhangDeg,
        widthCm,
        heightCm,
        imageFile: expect.objectContaining({
          0: file,
          length: 1,
        }),
        visibility,
      });
    }
  );

  it.each`
    isSuccess | expectedPopup
    ${true}   | ${popupSuccess}
    ${false}  | ${popupError}
  `(
    "Shows the Correct Popup for Success and Error Responses",
    async ({ isSuccess, expectedPopup }) => {
      (createWall as jest.Mock).mockImplementationOnce(() => {
        return isSuccess ? Promise.resolve() : Promise.reject();
      });

      await act(async () => {
        render(<CreateWall></CreateWall>);

        fireEvent.input(screen.getByRole("textbox", { name: /Wall Name/i }), {
          target: {
            value: "my new wall",
          },
        });

        fireEvent.input(screen.getByRole("spinbutton", { name: /Overhang/i }), {
          target: {
            value: 45,
          },
        });

        fireEvent.input(screen.getByRole("spinbutton", { name: /Width/i }), {
          target: {
            value: 320,
          },
        });

        fireEvent.input(screen.getByRole("spinbutton", { name: /Height/i }), {
          target: {
            value: 240,
          },
        });

        userEvent.upload(screen.getByLabelText(/image/i), file);

        fireEvent.click(screen.getByRole("radio", { name: /Public/i }));

        fireEvent.submit(screen.getByRole("button", { name: "Create" }));
      });

      await new Promise((resolve) => {
        window.setTimeout(() => {
          resolve(true);
        }, 250);
      });

      expect(expectedPopup).toHaveBeenCalled();
    }
  );

  it("Does not call createWall API method is the form is invalid", async () => {
    await act(async () => {
      render(<CreateWall></CreateWall>);
    });

    await act(async () => {
      fireEvent.input(screen.getByRole("textbox", { name: /Wall Name/i }), {
        target: {
          value: "a wall name",
        },
      });

      fireEvent.submit(screen.getByRole("button", { name: "Create" }));
    });

    expect(createWall).not.toHaveBeenCalled();
  });
});
