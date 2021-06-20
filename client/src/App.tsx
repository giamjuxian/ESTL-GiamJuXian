import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import MainPage from "./MainPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./icon.ts";

function App() {
  return (
    <div className="app_container">
      <TopBar />
      <SideBar />
      <MainPage />
    </div>
  );
}

export default App;
