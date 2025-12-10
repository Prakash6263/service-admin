import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BikeButtonDropDown = ({ activeItem, handleMenuClick }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const isBikeActive = ["/addBikeCompany", "/bikes", "/add-bike-variant"].includes(activeItem);

  return (
    <li className={`menu-item ${isBikeActive ? "active" : ""}`} onClick={() => toggleDropdown("bikes")}>
      <Link to="#" onClick={() => toggleDropdown("bikes")} style={{textDecoration:"none"}}>
        <i className="fa fa-motorcycle" /> <span> Bikes </span>
        <span className="menu-arrow"/>
      </Link>
      <ul style={{ display: openDropdown === "bikes" ? "block" : "none" }}>
        <li>
          <Link onClick={() => handleMenuClick("/bikes")} to="/bikes" style={{textDecoration:"none"}}>
            Bikes
          </Link>
        </li>
        <li>
          <Link onClick={() => handleMenuClick("/addBikeCompany")} to="/addBikeCompany" style={{textDecoration:"none"}}>
            Add Bike Company
          </Link>
        </li>
        {/* <li>
          <Link onClick={() => handleMenuClick("/add-bike-variant")} to="/add-bike-variant" style={{textDecoration:"none"}}>
            Add Bike Variant
          </Link>
        </li> */}
      </ul>
    </li>
  );
};

export default BikeButtonDropDown;
