import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { adminAuthToken, Server_URL } from '../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../layouts/PageTitle.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../../store/actions/AuthActions.js";

function BookedFlights() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBookingId, setSearchBookingId] = useState(''); // New state for Booking ID
    const [searchPNR, setSearchPNR] = useState(''); // New state for PNR
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expandedRows, setExpandedRows] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(Logout(navigate));
    };

    useEffect(() => {
        async function fetchLogs() {
            setLoading(true);
            try {
                const dataLS = localStorage.getItem(adminAuthToken);
                if (!dataLS) {
                    throw new Error('No authentication token found.');
                }
                const parsedData = JSON.parse(dataLS);
                const response = await fetch(`${Server_URL}admin/flight-book-search-stats`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${parsedData.idToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const result = await response.json();

                if (result.message === 'Session Expired' || result.message === 'Token Missing') {
                    return onLogout();
                }
                if (result.responseCode === 2) {
                    setLogs(result.data);
                } else {
                    Swal.fire({ icon: 'error', title: result.message });
                }
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'An error occurred', text: error.message });
            } finally {
                setLoading(false);
            }
        }

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();
        const bookingIdSearch = searchBookingId.toLowerCase();
        const pnrSearch = searchPNR.toLowerCase();

        return (
            (log.booking_id || '').toString().toLowerCase().includes(bookingIdSearch) &&
            (log.PNR || '').toString().toLowerCase().includes(pnrSearch) &&
            (
                search === '' ||
                (log.booking_id || '').toString().toLowerCase().includes(search) ||
                (log.PNR || '').toString().toLowerCase().includes(search) ||
                (log.details?.[0]?.booking_status || '').toString().toLowerCase().includes(search)
            )
        );
    });

    const toggleRowExpanded = (booking_id) => {
        setExpandedRows((prevExpandedRows) =>
            prevExpandedRows.includes(booking_id)
                ? prevExpandedRows.filter(id => id !== booking_id)
                : [...prevExpandedRows, booking_id]
        );
    };

    const columns = [
        {
            name: 'Booking ID',
            selector: row => row.booking_id || '',
            sortable: true,
            wrap: true,
            cell: (row) => (
                <div
                    onClick={() => toggleRowExpanded(row.booking_id)}
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {row.booking_id || ''}
                </div>
            )
        },
        { name: 'Agent Email', selector: row => row.email || '', sortable: true, wrap: true, minWidth: '250px' },
        { name: 'Booking Status', selector: row => row.details?.[0]?.booking_status || '', sortable: true, wrap: true },
        { name: 'PNR', selector: row => row.PNR || '', sortable: true, wrap: true },
        { name: 'Published Amount', selector: row => row.total_net_fare || 0, sortable: true, wrap: true },
        { name: 'Sector', selector: row => `${row.details?.[0]?.origin || ''} - ${row.details?.[0]?.destination || ''}`, sortable: true, wrap: true },
    ];

    const currentData = filteredLogs.slice(
        (currentPage - 1) * rowsPerPage,
        (currentPage - 1) * rowsPerPage + rowsPerPage
    );

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage);
        setCurrentPage(page);
    };

    const ExpandedComponent = ({ data }) => (
        <div style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
            {data.details?.map((typeData, index) => (
                <div key={index} className="row mb-2">
                    <div className="col-sm-4"><b>Passenger Name:</b> {typeData.first_name + ' ' + typeData.last_name || 'N/A'}</div>
                    <div className="col-sm-4"><b>PAX Type:</b> {typeData.pax_type || 'N/A'}</div>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <PageTitle motherMenu="Flights" activeMenu="Confirmed Flights Tickets"
                       pageContent="Confirmed Flights Tickets" />

            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive px-3">
                        <h2 className="text-center"><b> Confirmed Tickets</b></h2>
                        <hr />
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-4 d-flex flex-column align-items-start">
                                            <label htmlFor="searchBookingId" className="form-label">Filter by Booking
                                                ID</label>
                                            <input
                                                type="text"
                                                id="searchBookingId"
                                                placeholder="Enter Booking ID"
                                                className="form-control"
                                                value={searchBookingId}
                                                onChange={(e) => setSearchBookingId(e.target.value)}
                                                style={{width: '200px', height: '40px'}}
                                            />
                                        </div>

                                        <div className="col-lg-4 d-flex flex-column align-items-start">
                                            <label htmlFor="searchPNR" className="form-label">Filter by PNR</label>
                                            <input
                                                type="text"
                                                id="searchPNR"
                                                placeholder="Enter PNR"
                                                className="form-control"
                                                value={searchPNR}
                                                onChange={(e) => setSearchPNR(e.target.value)}
                                                style={{width: '200px', height: '40px'}}
                                            />
                                        </div>

                                        <div className="col-lg-4 d-flex flex-column align-items-start">
                                            <label htmlFor="searchTerm" className="form-label">General Search</label>
                                            <input
                                                type="text"
                                                id="searchTerm"
                                                placeholder="Search..."
                                                className="form-control"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{width: '250px', height: '40px'}}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <DataTable
                                    columns={columns}
                                    data={currentData}
                                    pagination
                                    paginationServer
                                    paginationPerPage={rowsPerPage}
                                    paginationTotalRows={filteredLogs.length}
                                    onChangePage={handlePageChange}
                                    onChangeRowsPerPage={handlePerRowsChange}
                                    highlightOnHover
                                    dense
                                    striped
                                    expandableRows
                                    expandableRowExpanded={row => expandedRows.includes(row.booking_id)}
                                    expandableRowsComponent={ExpandedComponent}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookedFlights;
