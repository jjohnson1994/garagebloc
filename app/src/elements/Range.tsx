import {
  ChangeEventHandler,
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  FunctionComponent,
} from "react";

interface InputProps {
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  name: string;
  error?: string;
  min: number;
  max: number;
  value: number;
  valueLabel?: string;
}

const Range: FunctionComponent<InputProps> = forwardRef(
  (props, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <div className="field">
        {props.label && (
          <label className="label" htmlFor={props.name}>
            {props.label}
          </label>
        )}
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              type="range"
              ref={ref}
              min={props.min}
              max={props.max}
              value={props.value}
              onChange={props.onChange}
              onBlur={props.onBlur}
              name={props.name}
              id={props.name}
            />
          </div>
          <p className="control">
            <a className="button is-static">{ props.valueLabel || props.value }</a>
          </p>
        </div>
        <p className="help is-danger">{props.error}</p>
      </div>
    );
  }
);

export default Range;
