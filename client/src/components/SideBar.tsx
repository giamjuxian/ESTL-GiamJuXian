import React from "react";
import profileImage from "../assets/default-profile.jpg";
import Button from "./Button";

interface Props {
  onUploadClick: () => unknown;
}
/** Fixed side bar that is only displayed in larger screens */
export default function SideBar(props: Props): JSX.Element {
  const { onUploadClick } = props;

  return (
    <div className="sideBar_container d-none d-md-block">
      <div className="sideBar_container sideBar_fixed d-flex flex-column align-items-center">
        <div className="py-5 d-flex flex-column align-items-center justify-content-center">
          <img
            className="sideBar_profileImage"
            src={profileImage}
            alt="default-profile"
          />
          <p className="sideBar_profileText">thisismylongusername</p>
        </div>
        <Button icon="upload" title={"Upload"} onClick={onUploadClick} />
      </div>
    </div>
  );
}
