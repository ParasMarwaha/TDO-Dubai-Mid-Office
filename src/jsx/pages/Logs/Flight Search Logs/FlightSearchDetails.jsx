import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { adminAuthToken, Server_URL } from '../../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../../layouts/PageTitle.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../../../store/actions/AuthActions.js";

function FlightSearchDetails() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onLogout() {
        dispatch(Logout(navigate));
    }

    const classMapping = {
        6: 'First Class',
        2: 'Economy',
        3: 'Premium Economy',
        4: 'Business'
    };

    const getClassDescription = (classNumber) => {
        return classMapping[classNumber] || 'Unknown Class';
    };

    async function fetchLogs(id) {
        setLoading(true);
        try {
            const dataLS = localStorage.getItem(adminAuthToken);
            if (!dataLS) {
                throw new Error('No authentication token found.');
            }
            const parsedData = JSON.parse(dataLS);
            const response = await fetch(`${Server_URL}admin/agents-flight-search-stats/${id}`, {
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

    useEffect(() => {
        //console.log(location)
        if (location.state && location.state.id) {
            fetchLogs(location.state.id);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No ID provided, redirecting to the main page.'
            }).then(() => {
                navigate('/');
            });
        }
    }, []);

    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            sortable: false,
            minWidth: '70px',
        },
        { name: 'From', selector: row => row.from || 0, sortable: true,  minWidth: '80px' },
        { name: 'To', selector: row => row.to || 0, sortable: true,  minWidth: '80px' },
        { name: 'Journey Type', selector: row => row.journey_type || 0, sortable: true,  wrap: true, minWidth: '130px' },
        { name: 'Departure Date', selector: row => row.departure_date || 0, sortable: true,  wrap: true, minWidth: '150px' },
        { name: 'Return Date', selector: row => row.return_date || 0, sortable: true, wrap: true, minWidth: '120px' },
        { name: 'Class', selector: row => getClassDescription(row.class), sortable: true, wrap: true},
        {
            name: 'Passengers',
            selector: row => {
                const adults = row.no_of_adults || 0;
                const children = row.no_of_childs || 0;
                const infants = row.no_of_infants || 0;
                const totalPassengers = adults + children + infants;
                return `${totalPassengers} (${adults} + ${children} + ${infants})`;
            },
            sortable: true,
            wrap: true,
            minWidth: '120px'
        },
        { name: 'Search Time', selector: row => row.search_date_time || 0, sortable: true, wrap: true,minWidth: '130px' },
    ];

    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();

        // Calculate the number of adults, children, infants, and total passengers
        const adults = log.no_of_adults || 0;
        const children = log.no_of_childs || 0;
        const infants = log.no_of_infants || 0;
        const totalPassengers = adults + children + infants;

        // Create the passenger string in the format "5 (2 + 1 + 2)"
        const passengerString = `${totalPassengers} (${adults} + ${children} + ${infants})`.toLowerCase();

        return (
            ((log.from || '').toLowerCase().includes(search)) ||
            ((log.to || '').toLowerCase().includes(search)) ||
            ((log.journey_type || '').toLowerCase().includes(search)) ||
            ((log.departure_date || '').toLowerCase().includes(search)) ||
            ((log.return_date || '').toLowerCase().includes(search)) ||
            (getClassDescription(log.class || '').toLowerCase().includes(search)) ||
            ((log.no_of_adults?.toString() || '').toLowerCase().includes(search)) ||
            ((log.no_of_childs?.toString() || '').toLowerCase().includes(search)) ||
            ((log.no_of_infants?.toString() || '').toLowerCase().includes(search)) ||
            ((log.search_date_time || '').toLowerCase().includes(search)) ||
            (passengerString.includes(search))  // Search by formatted passenger string
        );
    });


    const currentData = filteredLogs.slice(
        (currentPage - 1) * rowsPerPage,
        (currentPage - 1) * rowsPerPage + rowsPerPage
    );

    const handlePageChange = page => setCurrentPage(page);
    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage);
        setCurrentPage(page);
    };

    return (
        <div>
            <PageTitle motherMenu="Logs" activeMenu="/search-details" pageContent="Flight Search Details" />
            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive px-3">
                        <h2 className="text-center"><b>Flight Searches Details</b></h2>
                        <hr />
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-3 offset-lg-9">
                                    <input
                                        type="text"
                                        placeholder="Filter Data Table"
                                        className="form-control"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ width: '250px', height: '40px' }}
                                        disabled={loading}
                                    />
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
                                />
                                {filteredLogs.length === 0 && !loading && (
                                    <div className="text-center mt-3">No flight searches found.</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlightSearchDetails;
