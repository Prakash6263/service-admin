import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ServiceDropdown = ({ activeItem, handleMenuClick }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = () => {
    setOpenDropdown(openDropdown === "Services" ? null : "Services");
  };

  const isServiceActive = ["/addServices", "/additionalservices", "/createaddServices"].includes(activeItem);

  return (
    <li className={`submenu ${isServiceActive ? "active" : ""}`}>
      <Link to="#" onClick={toggleDropdown} style={{ textDecoration: "none" }}>
        <i className="fa fa-tasks" /> <span> Services </span>
        <span className="menu-arrow" />
      </Link>
      <ul style={{ display: openDropdown === "Services" ? "block" : "none" }}>
        <li className={activeItem === "/services" ? "active" : ""}>
          <Link onClick={() => handleMenuClick("/services")} to="/services" style={{ textDecoration: "none" }}>
            View Services
          </Link>
        </li>
        <li className={activeItem === "/additionalservices" ? "active" : ""}>
          <Link onClick={() => handleMenuClick("/additionalservices")} to="/additionalservices" style={{ textDecoration: "none" }}>
            Additional Service
          </Link>
        </li>
        {/* <li className={activeItem === "/createaddServices" ? "active" : ""}>
          <Link onClick={() => handleMenuClick("/createaddServices")} to="/createaddServices" style={{ textDecoration: "none" }}>
            Create Additional
          </Link>
        </li> */}
      </ul>
    </li>
  );
};

export default ServiceDropdown;
