import { FormEventHandler, FunctionComponent } from "react"

interface FormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
}

const Form: FunctionComponent<FormProps> = ({ children, onSubmit }) => (
  <form
    onSubmit={ onSubmit }
    autoComplete="off"
  >
    { children }
  </form>
)

export default Form
