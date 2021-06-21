import React from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  onUploadClick: () => unknown;
}

/** Top bar that is only displayed for mobile and small screens */
export default function TopBar(props: Props) {
  const { onUploadClick } = props;

  return (
    <div className="topBar_container d-xs-inline d-lg-none">
      <Dropdown>
        <Dropdown.Toggle
          className="m-2 d-flex flex-row align-items-center"
          variant="outline"
        >
          <FontAwesomeIcon color={"#ffffff"} icon="align-justify" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onUploadClick}>Upload</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
