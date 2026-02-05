'use client'

import { useRef, useState, useEffect } from 'react'
import BaseAdditionalServiceTable from '../../components/Additional/BaseAdditionalServiceTable'
import { Link } from 'react-router-dom'
import { getBaseAdditionalServices } from '../../api/additionalServiceApi'

const BaseAdditionalServices = () => {
  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)

  const tableHeaders = ['#', 'Service Image', 'Service Name', 'Created At', 'Actions']

  const triggerDownloadExcel = useRef(null)
  const triggerDownloadPDF = useRef(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        console.log('[v0] Fetching base additional services...')
        const response = await getBaseAdditionalServices()
        if (response && response.status === true) {
          console.log('[v0] Base additional services data received:', response.data)
          setData(response.data || [])
        } else {
          console.error('[v0] API error or no data:', response)
          setData([])
        }
      } catch (error) {
        console.error('[v0] Error fetching base additional services:', error)
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
            <h5>Base Additional Services</h5>
            <div className="list-btn">
              <ul className="filter-list">
                <li>
                  <Link className="btn btn-primary" to="/create-base-additional-service">
                    <i className="fa fa-plus-circle me-2" /> Add Base Additional Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <BaseAdditionalServiceTable
          datas={data}
          triggerDownloadExcel={triggerDownloadExcel}
          triggerDownloadPDF={triggerDownloadPDF}
          tableHeaders={tableHeaders}
          text="Base Additional Services"
          onServiceDeleted={handleRefresh}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default BaseAdditionalServices
