"use client"

import { useRef, useState, useEffect } from "react"
import DealerServiceTable from "../../components/Service/DealerServiceTable"
import { getDealerServices } from "../../api"

const DealerServices = () => {
  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)

  const tableHeaders = ["#", "Service Image", "Service Name", "Bike Details (CC & Price)", "Action"]

  const triggerDownloadExcel = useRef(null)
  const triggerDownloadPDF = useRef(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        console.log("[v0] Fetching dealer services...")
        const response = await getDealerServices()
        if (response && response.status === true) {
          console.log("[v0] Dealer services data received:", response.data)
          setData(response.data || [])
        } else {
          console.error("[v0] API error or no data:", response)
          setData([])
        }
      } catch (error) {
        console.error("[v0] Error fetching dealer services:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [refresh])

  const handleRefresh = () => {
    setRefresh((prev) => !prev)
  }

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>My Services</h5>
          </div>
        </div>

        <DealerServiceTable
          datas={data}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text="Services"
          loading={loading}
        />
      </div>
    </div>
  )
}

export default DealerServices
