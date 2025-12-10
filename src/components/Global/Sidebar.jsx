import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DealerButtunDropDown from "../Dealers/DealerButtunDropDown";
import ServiceDropdown from "../Service/serviceDropdown";
import BikeButtonDropDown from "../Booking/BikeButtonDropDown";
const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const closeSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.remove("open-sidebar");
    }
  };
  function handleLogout() {
    localStorage.removeItem("adminToken")
    navigate("/login")
  }

  const handleMenuClick = (path) => {
    setActiveItem(path);
    closeSidebar();
  };

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll" style={{ overflowY: "auto", maxHeight: "90vh" }}>
        <div id="sidebar-menu" className="sidebar-menu">
          <ul className="sidebar-vertical">
            <li className="menu-title">
              <span>GENERAL</span>
            </li>
            <li className={activeItem === "/" ? "active" : ""}>
              <Link onClick={() => handleMenuClick("/")} to={"/"} style={{ textDecoration: "none" }}>
                <i className="fe fe-home" /> <span> Dashboard</span>{" "}
              </Link>
            </li>

            <li className="menu-title">
              <span>MANAGEMENT</span>
            </li>
            <li>
              <Link onClick={closeSidebar} to="/paymentList" style={{ textDecoration: "none" }}>
                <i className="fe fe-list" /> <span> Payment List</span>{" "}
              </Link>
            </li>
            <li className={activeItem === "/booking" ? "active" : ""}>
              <Link onClick={() => handleMenuClick("/booking")} to={"/booking"} style={{ textDecoration: "none" }}>
                <i className="fa fa-shopping-cart" /> <span> Booking</span>{" "}
              </Link>
            </li>
            <li className={activeItem === "/admins" ? "active" : ""}>
              <Link onClick={() => handleMenuClick("/admins")} to={"/admins"} style={{ textDecoration: "none" }}>
                <i className="fa fa-user-secret" /> <span> Admins</span>{" "}
              </Link>
            </li>
            <DealerButtunDropDown activeItem={activeItem} handleMenuClick={handleMenuClick} />

            <li className={activeItem === "/customers" ? "active" : ""}>
              <Link onClick={() => handleMenuClick("/customers")} to={"/customers"} style={{ textDecoration: "none" }}>
                <i className="fe fe-home" /> <span> Customers</span>{" "}
              </Link>
            </li>
            <ServiceDropdown activeItem={activeItem} handleMenuClick={handleMenuClick} />
            <li>
              <Link onClick={closeSidebar} to={"/rewards"} style={{ textDecoration: "none" }}>
                <i className="fa fa-tasks" />{" "}
                <span> Rewards</span>{" "}
              </Link>
            </li>
            <li className={activeItem === "/bannerList" ? "active" : ""}>
              <Link onClick={() => handleMenuClick("/bannerList")} to={"/bannerList"} style={{ textDecoration: "none" }}>
                <i className="fa fa-image" /> <span> Banners</span>{" "}
              </Link>
            </li>
            <BikeButtonDropDown activeItem={activeItem} handleMenuClick={handleMenuClick} />
            <li className={activeItem === "/offers" ? "active" : ""}>
              <Link onClick={() => handleMenuClick("/offers")} to={"/offers"} style={{ textDecoration: "none" }}>
                <i className="fa fa-gift" /> <span> Offers</span>{" "}
              </Link>
            </li>
            <li className={activeItem === "/all-tickets" ? "active" : ""}>
              <Link onClick={() => handleMenuClick("/all-tickets")} to={"/all-tickets"} style={{ textDecoration: "none" }}>
                <i className="fa fa-gift" /> <span> Tickets</span>{" "}
              </Link>
            </li>
            <li className={activeItem === "/Login" ? "active" : ""}>
              <Link onClick={handleLogout} style={{ textDecoration: "none" }}>
                <i className="fe fe-power" /> <span> Logout</span>{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;