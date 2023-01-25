import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { ButtonType, Color } from "../elements/Button";
import Form, {AutoComplete} from "../elements/Form";
import Input, { InputType } from "../elements/Input";
import { yup } from "core/schemas";
import { popupError } from "../helpers/alerts";
import { Auth } from "aws-amplify";
import { useAppContext } from "../context/appContext";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useState } from "react";

export interface LoginForm {
  email: string;
  password: string;
}

export const LoginFormSchema = yup
  .object({
    email: yup.string().email("Not an email address").required("Required"),
    password: yup.string().required("Required"),
  })
  .required();

const Login = () => {
  const history = useHistory();
  const { search } = useLocation();
  const { setIsAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(LoginFormSchema),
  });

  const formOnSubmit: SubmitHandler<LoginForm> = async (value: LoginForm) => {
    setIsLoading(true);

    try {
      await Auth.signIn(value.email, value.password);
      const searchParams = new URLSearchParams(search);
      const redirect = searchParams.get("redirect");
      const path = redirect ? redirect : "/profile";
      setIsAuthenticated(true);
      history.replace(path);
    } catch (error: any) {
      if (error.code === "UserNotConfirmedException") {
        history.replace("/signup-confirm", { email: value.email });
      } else {
        popupError("Something has gone wrong, try again");
      }

      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Login</h1>
        <Form onSubmit={handleSubmit(formOnSubmit)} autoComplete={ AutoComplete.on }>
          <Input
            label="Email"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            type={InputType.Password}
          />
          <hr />
          <Button
            color={Color.isPrimary}
            type={ButtonType.Submit}
            loading={isLoading}
          >
            Login
          </Button>
      </Form>
      <Link to="/reset-password">Forgot Password?</Link>
      </div>
    </section>
  );
};

export default Login;
