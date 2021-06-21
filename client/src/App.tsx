import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import UploadModal from "./components/UploadModal";
import MainPage from "./pages/MainPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./icon.ts";

function App() {
  const [showUpload, setShowUpload] = useState(false);
  const handleUploadClose = () => setShowUpload(false);
  const handleUploadShow = () => setShowUpload(true);

  return (
    <div className="app_container">
      <TopBar onUploadClick={handleUploadShow} />
      <SideBar onUploadClick={handleUploadShow} />
      <MainPage />
      <UploadModal show={showUpload} onHide={handleUploadClose} />
    </div>
  );
}

export default App;
