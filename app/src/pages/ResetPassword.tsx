import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "../elements/Button";
import Form, { AutoComplete } from "../elements/Form";
import Input, { InputType } from "../elements/Input";
import { yup } from "core/schemas";
import { popupError, popupSuccess } from "../helpers/alerts";
import { Auth } from "aws-amplify";
import { useAppContext } from "../context/appContext";
import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";

export interface EmailForm {
  email: string;
}

export interface PasswordForm {
  confirmationCode: string;
  password: string;
  confirmPassword: string;
}

export const EmailFormSchema = yup
  .object({
    email: yup.string().email("Not an email address").required("Required"),
  })
  .required();

export const PasswordFormSchema = yup
  .object({
    confirmationCode: yup.string().required("Required"),
    password: yup.string().required("Required").min(8),
    confirmPassword: yup
      .string()
      .required("Required")
      .test("confirmPassword", "Passwords Do Not Match", function (value) {
        const { password } = this.parent;
        return value === password;
      }),
  })
  .required();

const ResetPassword = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { setIsAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCodeSend, setConfirmationCodeSent] = useState(false);

  const {
    register: emailFormRegister,
    handleSubmit: emailFormHandleSubmit,
    formState: { errors: emailFormErrors },
    getValues,
  } = useForm<EmailForm>({
    resolver: yupResolver(EmailFormSchema),
  });

  const {
    register: passwordFormRegister,
    handleSubmit: passwordFormHandleSubmit,
    formState: { errors: passwordFormErrors },
  } = useForm<PasswordForm>({
    resolver: yupResolver(PasswordFormSchema),
  });

  const formOnSubmit: SubmitHandler<EmailForm> = async (value: EmailForm) => {
    setIsLoading(true);

    try {
      await Auth.forgotPassword(value.email);
      setConfirmationCodeSent(true);
    } catch (error: any) {
      console.log(JSON.stringify(error));

      if (error.code === "CodeMismatchException") {
        popupError("Incorrect Confirmation Code, check your code and try again");
      } else {
        popupError("Something has gone wrong, try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordResetFormOnSubmit: SubmitHandler<PasswordForm> = async (
    value: PasswordForm
  ) => {
    setIsLoading(true);

    try {
      await Auth.forgotPasswordSubmit(
        getValues("email"),
        value.confirmationCode,
        value.password
      );
      popupSuccess("Password Reset");
      history.replace("/login");
    } catch (error: any) {
      console.log(JSON.stringify(error));
      popupError("Something has gone wrong, try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Reset Password</h1>
        {!confirmationCodeSend && (
          <Form
            onSubmit={emailFormHandleSubmit(formOnSubmit)}
            autoComplete={AutoComplete.on}
          >
            <Input
              label="Email"
              {...emailFormRegister("email")}
              error={emailFormErrors.email?.message}
            />
            <hr />
            <Button
              color={Color.isPrimary}
              type={ButtonType.Submit}
              loading={isLoading}
            >
              Send Confirmation Code
            </Button>
          </Form>
        )}
        {confirmationCodeSend && (
          <Form
            onSubmit={passwordFormHandleSubmit(passwordResetFormOnSubmit)}
            autoComplete={AutoComplete.off}
          >
            <Input
              label="Confirmation Code"
              {...passwordFormRegister("confirmationCode")}
              error={passwordFormErrors.confirmationCode?.message}
            />
            <Input
              label="New Password"
              {...passwordFormRegister("password")}
              error={passwordFormErrors.password?.message}
              type={InputType.Password}
            />
            <Input
              label="Confirm New Password"
              {...passwordFormRegister("confirmPassword")}
              error={passwordFormErrors.confirmPassword?.message}
              type={InputType.Password}
            />
            <hr />
            <Button
              color={Color.isPrimary}
              type={ButtonType.Submit}
              loading={isLoading}
            >
              Reset Password
            </Button>
          </Form>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;
