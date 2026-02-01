import React, { useState, useMemo, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImagePreview from "../../components/Global/ImagePreview";

const AllServices = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, text, onServiceDeleted }) => {

    const tableRef = useRef(null);
    const navigate = useNavigate();
    console.log("datas", datas);

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: "Service_List",
        sheet: "Services",
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Service List", 14, 10);

        const table = tableRef.current;
        if (!table) {
            console.error("Table not found!");
            return;
        }

        doc.autoTable({
            html: "#example",
            startY: 20,
            theme: "striped",
        });

        doc.save(`${text}.pdf`);
    };

    const handleView = (service) => {
        navigate(`/additional-services/view/${service._id}`, {
            state: { serviceData: service }
        });
    };

    const handleEdit = (service) => {
        navigate(`/additional-services/edit/${service._id}`, {
            state: { serviceData: service }
        });
    };

    const handleDelete = async (data) => {
        try {
            console.log("Deleting service with ID:", data._id);
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const response = await axios.delete(
                    `https://api.mrbikedoctor.cloud/bikedoctor/service/deleteAdditionalService/${data._id}`)

                if (response.data.status === 200) {
                    Swal.fire('Deleted!', 'Service deleted successfully', 'success');
                    if (onServiceDeleted) onServiceDeleted();
                }
            }
        } catch (error) {
            Swal.fire(
                'Error!',
                error.response?.data?.message || 'Failed to delete service',
                'error'
            );
            console.error("Delete error:", error);
        }
    };

    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(datas.length / rowsPerPage);
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return datas.slice(start, start + rowsPerPage);
    }, [datas, currentPage]);

    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    triggerDownloadExcel.current = onDownload;
    triggerDownloadPDF.current = exportToPDF;

    const memoizedServiceList = useMemo(() => {
        return currentData.map((data, index) => (
            <tr key={data._id}>
                <td>{index + 1}</td>
                <td>{data.serviceId || "N/A"}</td>
                <td>{data.name || "N/A"}</td>
                <td>
                    {data.image ? <ImagePreview image={data.image} /> : "N/A"}
                    {/* {data.image} */}
                </td>
                <td>{data.description || "N/A"}</td>

                <td>{data.dealer_id?.shopName || "N/A"}</td>

                <td>
                    {data.bikes && data.bikes.length > 0 ? (
                        <ul>
                            {data.bikes.map((bike, idx) => (
                                <li key={idx}>{bike.cc} CC - ₹{bike.price}</li>
                            ))}
                        </ul>
                    ) : "N/A"}
                </td>

                <td>{new Date(data.createdAt).toLocaleDateString()}</td>
                <td>{new Date(data.updatedAt).toLocaleDateString()}</td>

                <td className="d-flex align-items-center">
                    <div className="dropdown">
                        <button className="btn-action-icon" data-bs-toggle="dropdown">
                            <i className="fas fa-ellipsis-v" />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleView(data)}
                                >
                                    <i className="far fa-eye me-2" /> View
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleEdit(data)}
                                >
                                    <i className="far fa-edit me-2" /> Edit
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => handleDelete(data)}
                                >
                                    <i className="far fa-trash-alt me-2" /> Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        ));
    }, [currentData]);


    return (
        <>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card-table card p-2">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table ref={tableRef} id="example" className="table table-striped">
                                    <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                                        <tr>{tableHeaders.map((header, index) => (<th key={index}>{header}</th>))}</tr>
                                    </thead>
                                    <tbody className="list">{memoizedServiceList}</tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllServices