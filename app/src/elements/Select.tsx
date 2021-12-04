import { ChangeEventHandler, FocusEventHandler, ForwardedRef, forwardRef, FunctionComponent } from 'react'

interface InputProps {
  label?: string
  placeholder?: string
  addOnRight?: any
  onChange: ChangeEventHandler<HTMLSelectElement>
  onBlur: FocusEventHandler<HTMLSelectElement>
  name: string
  options: any[]
  error?: string
}

const Input: FunctionComponent<InputProps> = forwardRef((props, ref: ForwardedRef<HTMLSelectElement>) => {
  const getFieldClassNames = (): string => {
    const classNames = ['field']

    if (props.addOnRight) {
      classNames.push('has-addons')
    }

    return classNames.join(' ')
  }

  return (
    <div className="field">
      { props.label && (
        <label className="label" htmlFor={ props.name }>{ props.label }</label>
      )}
      <div className={ getFieldClassNames() }>
        <div className="control is-fullwidth select">
          <select
            ref={ ref }
            onChange={ props.onChange }
            onBlur={ props.onBlur }
            name={ props.name }
            id={ props.name }
            {
              ...(props.placeholder && {
                placeholder: props.placeholder
              })
            }
          >
            { props.options.map(option => (
              <option key={ option } value={ option }>{ option }</option> 
            ))}
          </select>
        </div>
        { props.addOnRight && (
          props.addOnRight
        )}
      </div>
      <p className="help is-danger">{ props.error }</p>
    </div>
  )
})

export default Input
