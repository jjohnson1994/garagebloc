import {
  ChangeEventHandler,
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  FunctionComponent,
} from "react";

interface InputProps {
  label?: string;
  addOnRight?: any;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  error?: string;
  radioOptions: Record<string, string | number>;
  name: string;
}

const Input: FunctionComponent<InputProps> = forwardRef(
  (props, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div className="field">
        {props.label && <label className="label">{props.label}</label>}
        <div className="control is-expanded">
          {Object.entries(props.radioOptions).map(([key, value]) => (
            <label className="radio is-capitalized" key={key}>
              <input
                type="radio"
                className="mr-2"
                name={props.name}
                value={value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                ref={ref}
              />
              {key}
            </label>
          ))}
        </div>
        <p className="help is-danger">{props.error}</p>
      </div>
    );
  }
);

export default Input;
