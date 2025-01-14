import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {adminAuthToken, Server_URL} from '../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../layouts/PageTitle.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";
import button from "../../components/bootstrap/Button.jsx";
import * as XLSX from "xlsx";


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
                (log.customer_amount || '').toString().toLowerCase().includes(search) ||
                (log.platform_fee || '').toString().toLowerCase().includes(search) ||
                (log.platform_tax || '').toString().toLowerCase().includes(search) ||
                (log.gateway_charges || '').toString().toLowerCase().includes(search)
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
            name: 'Action',
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
        {name: <div> Sr.<br/>No.</div>, selector: (row,index) => index +1 || '', sortable: true, wrap: true},
        {name: <div> TDO <br/>Booking <br/>ID</div>, selector: row => row.booking_id || '', sortable: true, wrap: true},
        {name: <div>Agent <br/>Name</div>, selector: row => row.agent_name || '', sortable: true, wrap: true},
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
            minWidth: '120px'
        },
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
        {
            name: <div>Booked <br/>By</div>,
            selector: row =>
                `${row.SubFirstName || ''} ${row.SubLastName || ''}`.trim(),
            sortable: true,
            wrap: true,
            minWidth: '70px'
        },
        {name: <div>Location</div>, selector: row => row.SubLocation || '', sortable: true, wrap: true,minWidth:'80px'},
        // {name: <div>Agent <br/>Email</div>, selector: row => row.agent_email || '', sortable: true, wrap: true,minWidth:'250px'},
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
                    case 'HOLD':
                        backgroundColor = 'bg-info text-black p-1'; // Mustard for Aborted
                        break;
                    case 'RELEASED':
                        backgroundColor = 'bg-info text-black p-2'; // Mustard for Aborted
                        break;
                    default:
                        backgroundColor = ''; // Default (no background color)
                        break;
                }

                if(backgroundColor === 'bg-info text-black p-1'){
                    return (
                        <div className="text-black p-1" style={{borderRadius: '7px',background:"greenyellow"}}>
                            {row.ticket_status || ''}
                        </div>
                    );
                }
                if(backgroundColor === 'bg-info text-black p-2'){
                    return (
                        <div className="text-black p-1" style={{borderRadius: '7px',background:"lightblue"}}>
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
        {name: <div>Supplier</div>, selector: row => row.supplier || '', sortable: true, wrap: true},
        {name: <div>Payment <br/>Method</div>, selector: row => row.payment_type || '', sortable: true, wrap: true},
        {name: <div>Agent <br/>Amount <br/>(AED)</div>, selector: row => row.agent_amount || '', sortable: true, wrap: true},
        {name: <div>Customer <br/>Amount<br/>(AED)</div>, selector: row => row.customer_amount || '', sortable: true, wrap: true},
        {name: <div>Platform <br/>Fee<br/>(AED)</div>, selector: row => row.platform_fee || '', sortable: true, wrap: true},
        {name: <div>Platform <br/>Tax<br/>(AED)</div>, selector: row => row.platform_tax || '', sortable: true, wrap: true},
        {name: <div>Gateway <br/>Charges<br/>(AED)</div>, selector: row => row.gateway_charges || '', sortable: true, wrap: true},
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

    const exportToExcel = (columns, data, fileName = "data.xlsx") => {
        // Exclude the first column and "Action" column
        const filteredColumns = columns.filter(col =>
            col.name !== "" && col.name !== "Action"
        );

        // Extract headers from the filtered columns
        const headers = filteredColumns.map(col => {
            if (typeof col.name === "string") {
                return col.name; // For plain text headers
            }
            if (col.name?.props?.children) {
                if (Array.isArray(col.name.props.children)) {
                    // Replace <br /> with space in array of children
                    return col.name.props.children
                        .map(child => (typeof child === "string" ? child : " "))
                        .join("");
                }
                // Handle single child (replace <br /> with space)
                return typeof col.name.props.children === "string"
                    ? col.name.props.children
                    : " ";
            }
            return ""; // Default to empty string if no header is found
        });

        // Transform data to match the filtered headers
        const rows = data.map((row, index) => {
            const transformedRow = {};
            filteredColumns.forEach((col, colIndex) => {
                const selector = col.selector || (() => ""); // Default to empty string if no selector
                transformedRow[headers[colIndex]] = selector(row, index); // Use index for row-related calculations
            });
            return transformedRow;
        });

        // Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write the Excel file
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div>
            <PageTitle motherMenu="Flights" activeMenu="/search-booked-flights" pageContent="Search Bookings"/>

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
                                <div className="mb-2"><button onClick={() => exportToExcel(columns,filteredLogs,'data.xlsx')} className="btn-sm btn btn-primary offset-10">Export to Excel</button></div>
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
