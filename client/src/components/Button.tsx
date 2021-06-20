import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface ButtonProps {
  /** Text title for the button */
  title: string;

  /** If present, displays an icon on the left of the button */
  icon?: IconProp;

  /** Handles the click event of the button */
  onClick: () => unknown;
}

/**
 * Custom button component
 */
export default function Button(props: ButtonProps): JSX.Element {
  const { title, icon, onClick } = props;

  return (
    <div>
      {icon && <FontAwesomeIcon color={"#ffffff"} icon={icon} />}
      <button onClick={onClick}>{title}</button>
    </div>
  );
}
