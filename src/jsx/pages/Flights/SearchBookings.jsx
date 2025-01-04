import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {adminAuthToken, Server_URL} from '../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../layouts/PageTitle.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";
import button from "../../components/bootstrap/Button.jsx";

function SearchBookings() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBookingId, setSearchBookingId] = useState(''); // New state for Booking ID
    const [searchPNR, setSearchPNR] = useState(''); // New state for PNR
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(Logout(navigate));
    };

    async function fetchLogs() {
        setLoading(true);
        try {
            const dataLS = localStorage.getItem(adminAuthToken);
            if (!dataLS) {
                throw new Error('No authentication token found.');
            }
            const parsedData = JSON.parse(dataLS);
            const response = await fetch(`${Server_URL}admin/getFlightBookingData`, {
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
                console.log(result.data)
                setLogs(result.data);
            } else {
                Swal.fire({icon: 'error', title: result.message});
            }
        } catch (error) {
            Swal.fire({icon: 'error', title: 'An error occurred', text: error.message});
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchLogs().then();
    }, []);

    const handleAbort = async (row) => {
        console.log("Aborting ticket:", row.booking_id);
        try {
            const dataLS = localStorage.getItem(adminAuthToken);
            if (!dataLS) {
                throw new Error('No authentication token found.');
            }
            const parsedData = JSON.parse(dataLS);
            const response = await fetch(`${Server_URL}admin/abort-booking/${row.booking_id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${parsedData.idToken}`
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();

            if (result.message === 'Session Expired' || result.message === 'Token Missing') {
                return onLogout();
            }
            if (result.responseCode === 2) {
                Swal.fire({icon: 'success', title: result.message}).then(()=>{
                    fetchLogs();
                });
            } else {
                Swal.fire({icon: 'error', title: result.message});
            }
        }
        catch (error) {
            Swal.fire({icon: 'error', title: 'An error occurred', text: error.message});
        }
    };


    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();
        const bookingIdSearch = searchBookingId.toLowerCase();
        const pnrSearch = searchPNR.toLowerCase();

        return (
            // Check if booking_id matches the searchBookingId filter
            (log.booking_id || '').toString().toLowerCase().includes(bookingIdSearch) &&

            // Check if PNR matches the searchPNR filter
            (log.gdspnr || '').toString().toLowerCase().includes(pnrSearch) &&

            // Check if the search term matches any of the columns
            (
                search === '' ||
                (log.booking_id || '').toString().toLowerCase().includes(search) ||
                (log.gdspnr || '').toString().toLowerCase().includes(search) ||
                (log.trip_type || '').toString().toLowerCase().includes(search) ||
                (log.agent_email || '').toString().toLowerCase().includes(search) ||
                (log.payment_status || '').toString().toLowerCase().includes(search) ||
                (log.ticket_status || '').toString().toLowerCase().includes(search) ||
                ((log.origin || '') + '-' + (log.destination || '')).toLowerCase().includes(search) ||
                (log.supplier || '').toString().toLowerCase().includes(search) ||
                (log.payment_type || '').toString().toLowerCase().includes(search) ||
                (log.agent_amount || '').toString().toLowerCase().includes(search) ||
                (log.customer_amount || '').toString().toLowerCase().includes(search)
            )
        );
    });

    const columns = [
        {
            name: '',
            sortable: true,
            wrap: true,
            width: '40px',
            cell: (row) => (
                <Link to="/search-booked-flight-details" state={{id: row.booking_id}}>
                    <i
                        className="fa fa-eye text-info"
                        style={{cursor: 'pointer'}} // Add cursor style to indicate it's clickable
                    />
                </Link>
            )
        },
        {
            name: <div>Action</div>,
            selector: row => {
                if (row.ticket_status === "Failed") {
                    return (
                        <button
                            type="button" className="btn btn-sm btn-primary p-1" style={{background:"yellowgreen"}}
                            onClick={() => handleAbort(row)}
                        >
                            Abort
                        </button>
                    );
                }
                return ''; // Fallback for rows without "Failed" status
            },
            sortable: true,
            wrap: true,
            minWidth: '100px',
        },
        {name: <div>Booking <br/>ID</div>, selector: row => row.booking_id || '', sortable: true, wrap: true},
        {name: <div>Flight <br/>Type</div>, selector: row => row.trip_type || '', sortable: true, wrap: true,minWidth: '120px'},
        {
            name: <div>Booking <br />Date</div>,
            selector: row => {
                if (row.booking_date_time) {
                    const dateObj = new Date(row.booking_date_time); // Convert to Date object
                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const month = monthNames[dateObj.getMonth()]; // Get month name
                    const day = dateObj.getDate(); // Get day of the month
                    const year = dateObj.getFullYear(); // Get year
                    return `${day} ${month} ${year}`; // Return formatted date
                }
                return ''; // Fallback for empty date
            },
            sortable: true,
            wrap: true,
            minWidth: '150px'
        },
        {name: <div>Agent <br/>Email</div>, selector: row => row.agent_email || '', sortable: true, wrap: true,minWidth:'250px'},
        {name: <div>Payment <br/>Status</div>, selector: row => row.payment_status || '', sortable: true, wrap: true},
        {
            name: <div>Booking <br />Status</div>,
            selector: row => row.ticket_status || '',
            sortable: true,
            wrap: true,
            cell: row => {
                let backgroundColor = '';

                // Apply background color based on the ticket_status value
                switch (row.ticket_status) {
                    case 'SUCCESS':
                        backgroundColor = 'bg-success text-white p-1'; // Light Green for Success
                        break;
                    case 'Failed':
                        backgroundColor = 'bg-danger text-white p-1'; // Red for Failed
                        break;
                    case 'ABORTED':
                        backgroundColor = 'bg-info text-black p-1'; // Mustard for Aborted
                        break;
                    default:
                        backgroundColor = ''; // Default (no background color)
                        break;
                }

                if(backgroundColor === 'bg-info text-black p-1'){
                    return (
                        <div className="text-black p-1" style={{borderRadius: '7px',background:"yellow"}}>
                            {row.ticket_status || ''}
                        </div>
                    );
                }
                // Return the formatted cell with background color
                return (
                    <div className={backgroundColor} style={{borderRadius: '7px'}}>
                        {row.ticket_status || ''}
                    </div>
                );
            }
        },
        {name: <div>Sectors</div>, selector: row => row.origin + '-' + row.destination || '', sortable: true, wrap: true},
        {
            name: <div>PNR</div>,
            selector: row => {
                if (row.gdspnr === "Not Processed") {
                    return ''; // Leave empty if "Not Processed"
                }
                return row.gdspnr || ''; // Return the gdspnr value or empty string if undefined
            },
            sortable: true,
            wrap: true
        },
        {name: <div>Supplier</div>, selector: row => row.supplier || '', sortable: true, wrap: true},
        {name: <div>Payment <br/>Method</div>, selector: row => row.payment_type || '', sortable: true, wrap: true},
        {name: <div>Agent <br/>Amount</div>, selector: row => row.agent_amount || '', sortable: true, wrap: true},
        {name: <div>Customer <br/>Amount</div>, selector: row => row.customer_amount || '', sortable: true, wrap: true},
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


    return (
        <div>
            <PageTitle motherMenu="Flights" activeMenu="Search Bookings" pageContent="Search Bookings"/>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive px-3">
                        <h2 className="text-center"><b> Search Bookings</b></h2>
                        <hr/>
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
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
<br/>
<br/>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchBookings;
