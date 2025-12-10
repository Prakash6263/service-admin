import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import axios

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { AgCharts } from 'ag-charts-react';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`https://api.mrbikedoctor.cloud/bikedoctor/adminauth/dashboard-counts`);
        // const res = await axios.get(`https://api.mrbikedoctor.cloud/bikedoctor/adminauth/dashboard-counts`);
        if (res.status === 200 && res.data?.data) {
          console.log("Dashboard counts fetched successfully:", res.data.data);
          setDashboardData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        setDashboardData({});
      }
    };

    fetchCounts();
  }, []);

  const dynamicCounts = [
    dashboardData.totalBookings ?? 0,
    dashboardData.totalServices ?? 0,
    dashboardData.totalBikeCompany ?? 0,
    dashboardData.totalOffers ?? 0,
    dashboardData.totalAdmins ?? 0,
    dashboardData.totalCustomers ?? 0,
    dashboardData.totalDealers ?? 0,
    dashboardData.totalInvoices ?? 0
  ];

  const routes = {
    Bookings: "/booking",
    Services: "/services",
    Bikes: "/bikes",
    Offers: "/offers",
    Admins: "/admins",
    Customers: "/customers",
    Dealers: "/dealers",
    Invoices: "/invoices",
  };

  const [chartOptions, setChartOptions] = useState({
    data: [
      { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
      { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
      { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
      { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
      { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
      { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    series: [{ type: 'bar', xKey: 'month', yKey: 'iceCreamSales' }],
  });

  const invoiceData = {
    labels: ['Invoiced', 'Received', 'Pending'],
    datasets: [{
      data: [2132, 1763, 973],
      backgroundColor: ['#3F51B5', '#4CAF50', '#F44336'],
      hoverOffset: 4
    }]
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          {['Bookings', 'Services', 'Bikes', 'Offers', 'Admins', 'Customers', 'Dealers', 'Invoices'].map((title, idx) => (
            <div key={idx} className="col-xl-3 col-sm-6 col-12">
              <div onClick={() => navigate(routes[title])} style={{ cursor: "pointer" }}
                className={`card card-${['purple', 'blue', 'pink', 'green', 'orange', 'yellow', 'blue', 'purple'][idx]}`}
              >
                <div className="card-body">
                  <div className="dash-widget-header">
                    <span className="dash-widget-icon bg-1">
                      <i className={[
                        'fa fa-shopping-bag',
                        'fa fa-tasks',
                        'fa fa-motorcycle',
                        'fa fa-gift',
                        'fa fa-user-secret',
                        'fas fa-users',
                        'fa fa-user-circle',
                        'fas fa-file-alt'
                      ][idx]} />
                    </span>
                    <div className="dash-count">
                      <div className="dash-title">{title}</div>
                      <div className="dash-counts">
                        <p>{dynamicCounts[idx]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="row">
          <div className="col-xl-7 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Sales Analytics</h5>
              </div>
              <div className="card-body">
                <AgCharts options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="col-xl-5 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Invoice Analytics</h5>
              </div>
              <div className="card-body">
                <div className="row h-100">
                  <div className="col-md-12 d-flex align-items-center justify-content-center">
                    <div style={{ width: '280px', height: '280px' }}>
                      <Doughnut
                        data={invoiceData}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div className="row">
                  {['Invoiced', 'Received', 'Pending'].map((status, idx) => (
                    <div key={idx} className="col-4">
                      <div className="text-center">
                        <div className="status-indicator d-inline-block mb-1">
                          <i className={`fas fa-circle text-${['primary', 'success', 'danger'][idx]}`} />
                        </div>
                        <div className="fw-bold">{status}</div>
                        <div className="text-muted">${[2132, 1763, 973][idx].toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
