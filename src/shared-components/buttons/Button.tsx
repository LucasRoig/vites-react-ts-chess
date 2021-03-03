import React from 'react'
export interface ButtonProps {
  color: "primary" | "link" | "default"
}

const Button: React.FC<ButtonProps> = ({children, color, ...props}) => {
  let classes = ["button"]
  if (color === "primary") {
    classes.push("is-primary")
  } else if (color === "link"){
    classes.push("is-link")
  }
  return <button className={classes.join(" ")} {...props}>{children}</button>
}

export {
  Button
}
