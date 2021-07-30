import React from "react";
import {HorizontalField} from "./HorizontalField";

interface HorizontalFieldProperties {
  name: string,
  label: string,
  placeholder?: string
  type: string
  onChange:  React.ChangeEventHandler<HTMLInputElement>
  value: string | number | readonly string[] | undefined
}

const HorizontalInput: React.FunctionComponent<HorizontalFieldProperties> = ({name, label, placeholder, type, onChange, value}) => {
  return (
    <HorizontalField label={label} name={name}>
      <input name={name} className="input" type={type} placeholder={placeholder} onChange={onChange} value={value}/>
    </HorizontalField>
  )
}

export {
  HorizontalInput
}
