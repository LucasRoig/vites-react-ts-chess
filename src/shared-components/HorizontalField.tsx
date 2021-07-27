import React from "react";

interface HorizontalFieldProperties {
  name: string,
  label: string,
  placeholder: string
  type: string
  onChange:  React.ChangeEventHandler<HTMLInputElement>
  value: string | number | readonly string[] | undefined
}

const HorizontalField: React.FunctionComponent<HorizontalFieldProperties> = ({name, label, placeholder, type, onChange, value}) => {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label htmlFor={name} className="label">{label}</label>
      </div>
      <div className="field-body">
        <div className="field is-narrow">
          <div className="control">
            <input name={name} className="input" type={type} placeholder={placeholder} onChange={onChange} value={value}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  HorizontalField
}
