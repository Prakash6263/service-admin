import React from 'react'
import { Link } from 'react-router-dom'

const BookingTrack = () => {
  return (
    <div><>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Header */}
        <div className="header header-one">
          <Link
            to="/"
            className="d-inline-flex d-sm-inline-flex align-items-center d-md-inline-flex d-lg-none align-items-center device-logo"
          >
            <img
              src="assets/img/logo.png"
              className="img-fluid logo2"
              alt="Logo"
              style={{ width: 60 }}
            />
          </Link>
          <div className="main-logo d-inline float-start d-lg-flex align-items-center d-none d-sm-none d-md-none">
            <div className="logo-color">
              <Link to="/">
                <img
                  src="assets/img/logo.png"
                  className="img-fluid logo-blue"
                  alt="Logo"
                  style={{ width: 60 }}
                />
              </Link>
              <Link to="/">
                <img
                  src="assets/img/logo-small.png"
                  className="img-fluid logo-small"
                  alt="Logo"
                  style={{ width: 50 }}
                />
              </Link>
            </div>
          </div>
          {/* Sidebar Toggle */}
          <button id="toggle_btn">
            <span className="toggle-bars">
              <span className="bar-icons" />
              <span className="bar-icons" />
              <span className="bar-icons" />
              <span className="bar-icons" />
            </span>
          </button>
          {/* /Sidebar Toggle */}
          {/* Search */}
          <div className="top-nav-search">
            <form>
              <input
                type="text"
                className="form-control"
                placeholder="Search here"
              />
              <button className="btn" type="submit">
                <img src="assets/img/icons/search.svg" alt="img" />
              </button>
            </form>
          </div>
          {/* /Search */}
          {/* Mobile Menu Toggle */}
          <button className="mobile_btn" id="mobile_btn">
            <i className="fas fa-bars" />
          </button>
          {/* /Mobile Menu Toggle */}
          {/* Header Menu */}
          <ul className="nav nav-tabs user-menu">
            {/* User Menu */}
            <li className="nav-item dropdown">
              <button
                className="user-link  nav-link"
                data-bs-toggle="dropdown"
              >
                <span className="user-img">
                  <img
                    src="assets/img/profiles/avatar-07.jpg"
                    alt="img"
                    className="profilesidebar"
                  />
                  <span className="animate-circle" />
                </span>
                <span className="user-content">
                  <span className="user-details">Admin</span>
                  <span className="user-name">John Smith</span>
                </span>
              </button>
              <div className="dropdown-menu menu-drop-user">
                <div className="profilemenu">
                  <div className="subscription-logout">
                    <ul>
                      <li className="pb-0">
                        <a className="dropdown-item" href="login.html">
                          Log Out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            {/* /User Menu */}
          </ul>
          {/* /Header Menu */}
        </div>
        {/* /Header */}
        {/* Sidebar */}
        <div className="sidebar" id="sidebar">
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul className="sidebar-vertical">
                {/* Main */}
                <li className="menu-title">
                  <span>GENERAL</span>
                </li>
                <li>
                  <a href="dashboard.html">
                    <i className="fe fe-home" /> <span> Dashboard</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li className="menu-title">
                  <span>MANAGEMENT</span>
                </li>
                <li>
                  <a href="payment-list.html">
                    <i className="fe fe-list" /> <span> Payment List</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="booking.html">
                    <i className="fa fa-shopping-cart" /> <span> Booking</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="booking-tracking.html" className="active">
                    <i className="fa fa-road" /> <span> Booking Tracking</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="admins.html">
                    <i className="fa fa-user-secret" /> <span> Admins</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li className="submenu">
                  <button>
                    <i className="fa fa-user-circle" /> <span> Dealers </span>{" "}
                    <span className="menu-arrow" />
                  </button>
                  <ul>
                    <li>
                      <a href="dealers.html">Dealers</a>
                    </li>
                    <li>
                      <a href="dealers-payin.html">Dealers PayIn</a>
                    </li>
                    <li>
                      <a href="approve.html">Dealers PayOut</a>
                    </li>
                  </ul>
                </li>
                {/*  <li>
                    <a href="approve.html"><i class="fa fa-user-circle"></i> <span> Dealers Payout </span> <span class="menu-arrow"></span></a>
                   
                 </li> */}
                <li>
                  <a href="customers.html">
                    <i className="fa fa-users" /> <span> Customers </span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="services.html">
                    <i className="fa fa-tasks" /> <span> Services </span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="service-features.html">
                    <i className="fa fa-tasks" /> <span> Service Features </span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="banners.html">
                    <i className="fa fa-tasks" />{" "}
                    <span> Service Salient Features</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="banners.html">
                    <i className="fa fa-image" /> <span> Banners</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="bikes.html">
                    <i className="fa fa-motorcycle" /> <span> Bikes</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="additional-problems.html">
                    <i className="fe fe-settings" />{" "}
                    <span> Additional Problems</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="offers.html">
                    <i className="fa fa-gift" /> <span> Offers</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="reports.html">
                    <i className="fa fa-file" /> <span> Reports</span>{" "}
                    <span className="menu-arrow" />
                  </a>
                </li>
                <li>
                  <a href="../index.html">
                    <i className="fe fe-power" /> <span>Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Sidebar */}
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Booking Tracking</h5>
                <div className="list-btn" style={{ justifySelf: "end" }}>
                  <ul className="filter-list">
                    <li>
                      <div
                        className="dropdown dropdown-action"
                        data-bs-placement="bottom"
                        data-bs-original-title="Download"
                      >
                        <button
                          className="btn btn-primary"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span>
                            <i className="fe fe-download me-2" />
                          </span>{" "}
                          Downloads{" "}
                        </button>
                        <div className="dropdown-menu dropdown-menu-end" style={{}}>
                          <ul className="d-block">
                            <li>
                              <button
                                className="d-flex align-items-center download-item"
                                download=""
                              >
                                <i className="far fa-file-text me-2" />
                                EXCEL
                              </button>
                            </li>
                            <li>
                              <button
                                className="d-flex align-items-center download-item"
                                download=""
                              >
                                <i className="far fa-file-pdf me-2" />
                                PDF
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-2">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table
                        id="example"
                        className="table table-striped"
                        style={{ width: "100%" }}
                      >
                        <thead class="thead-light">
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Booking_ID</th>
                            <th>Service_Name</th>
                            <th>User_ID</th>
                            <th>Dealer_ID</th>
                            <th>Booking Status</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>22/01/2025</td>
                            <td>18:27:20</td>
                            <td>B-738</td>
                            <td>TT TRAVEL</td>
                            <td>U-47</td>
                            <td>D-132</td>
                            <td>
                              <span className="badge badge-success">completed</span>
                            </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>22/01/2025</td>
                            <td>17:10:52</td>
                            <td>B-737</td>
                            <td>GENERAL SERVICE</td>
                            <td>U-47</td>
                            <td />
                            <td>
                              <span className="badge badge-danger">rejected</span>
                            </td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>22/01/2025</td>
                            <td>13:25:37</td>
                            <td>B-736</td>
                            <td>GENERAL SERVICE</td>
                            <td>U-47</td>
                            <td />
                            <td>
                              <span className="badge badge-primary">
                                Order Confirmed
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>22/01/2025</td>
                            <td>12:45:55</td>
                            <td>B-735</td>
                            <td>GENERAL SERVICE</td>
                            <td>U-47</td>
                            <td />
                            <td>
                              <span className="badge badge-danger">rejected</span>
                            </td>
                          </tr>
                          <tr>
                            <td>5</td>
                            <td>22/01/2025</td>
                            <td>12:39:41</td>
                            <td>B-734</td>
                            <td>GENERAL SERVICE</td>
                            <td>U-47</td>
                            <td>D-126</td>
                            <td>
                              <span className="badge badge-success">completed</span>
                            </td>
                          </tr>
                          <tr>
                            <td>6</td>
                            <td>22/01/2025</td>
                            <td>12:34:33</td>
                            <td>B-733</td>
                            <td>MINER REPAIRS</td>
                            <td>U-47</td>
                            <td>D-126</td>
                            <td>
                              <span className="badge badge-success">completed</span>
                            </td>
                          </tr>
                          <tr>
                            <td>7</td>
                            <td>21/01/2025</td>
                            <td>16:32:37</td>
                            <td>B-732</td>
                            <td>TT TRAVEL</td>
                            <td>U-47</td>
                            <td>D-132</td>
                            <td>
                              <span className="badge badge-success">completed</span>
                            </td>
                          </tr>
                          <tr>
                            <td>8</td>
                            <td>21/01/2025</td>
                            <td>14:51:55</td>
                            <td>B-731</td>
                            <td>MINER REPAIRS</td>
                            <td>U-47</td>
                            <td>D-126</td>
                            <td>
                              <span className="badge badge-success">completed</span>
                            </td>
                          </tr>
                          <tr>
                            <td>9</td>
                            <td>20/01/2025</td>
                            <td>15:50:26</td>
                            <td>B-730</td>
                            <td>GENERAL SERVICE</td>
                            <td>U-2</td>
                            <td>D-126</td>
                            <td>
                              <span className="badge badge-success">completed</span>
                            </td>
                          </tr>
                          <tr>
                            <td>10</td>
                            <td>20/01/2025</td>
                            <td>13:08:20</td>
                            <td>B-729</td>
                            <td>GENERAL SERVICE</td>
                            <td>U-2</td>
                            <td>D-126</td>
                            <td>
                              <span className="badge badge-priary">
                                cash received
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
      </div>

    </>
    </div>
  )
}

export default BookingTrack