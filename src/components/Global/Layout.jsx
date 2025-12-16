import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Import your Sidebar component

const Layout = () => {
  return (
    <div className="main-wrapper">
      <Sidebar />
      <div className="page-wrapper ">
        <div className="content container-fluid">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;