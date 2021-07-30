import React from "react";

interface HorizontalFieldProperties {
  name: string
  label: string
}

const HorizontalField: React.FunctionComponent<HorizontalFieldProperties> = ({name, label, children}) => {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label htmlFor={name} className="label">{label}</label>
      </div>
      <div className="field-body">
        <div className="field is-narrow">
          <div className="control">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  HorizontalField
}
