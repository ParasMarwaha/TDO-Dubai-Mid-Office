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
import {parseJSON} from "date-fns";


function SearchHotelBookings() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBookingId, setSearchBookingId] = useState(''); // New state for Booking ID
    const [searchPNR, setSearchPNR] = useState(''); // New state for PNR
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [filterBy, setFilterBy] = useState('bookingDate'); // Default to Booking Date


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
            const response = await fetch(`${Server_URL}admin/getHotelBookingData`, {
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
                if (result.data.length > 0) {
                    const firstBooking = result.data[result.data.length - 1];
                    const lastBooking = result.data[0];

                    // Use the `booking_date_time` string directly
                    const firstBookingDate = new Date(firstBooking.booking_DateTime);
                    const lastBookingDate = new Date(lastBooking.booking_DateTime);

                    // Set the dates in the correct format for the input fields (YYYY-MM-DD)
                    if (!isNaN(firstBookingDate) && !isNaN(lastBookingDate)) {
                        setFromDate(firstBookingDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                        setToDate(lastBookingDate.toISOString().split('T')[0]);
                        //console.log(fromDate);
                    } else {
                        //console.error("Invalid date format in transactions.");
                    }
                }
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


    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();
        const bookingIdSearch = searchBookingId.toLowerCase();
        const pnrSearch = searchPNR.toLowerCase();

        // Convert fromDate and toDate to Date objects
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1)) : null;

        // Determine the date to filter by based on the filterBy value
        const logDate = filterBy === 'bookingDate'
            ? new Date(log.booking_DateTime) // Use booking date
            : new Date(log.departure); // Use travel date (departure)


        return (
            // Check if booking_id matches the searchBookingId filter
            (log.booking_id || '').toString().toLowerCase().includes(bookingIdSearch) &&

            // Check if the log date falls within the date range
            (!from || !to || (logDate >= from && logDate <= to)) &&

            // Check if the search term matches any of the columns
            (
                search === '' ||
                (log.api_booking_id || '').toString().toLowerCase().includes(search) ||
                (log.paymentStatus || '').toString().toLowerCase().includes(search) ||
                (log.booking_status || '').toString().toLowerCase().includes(search) ||
                (log.published_rate || '').toString().toLowerCase().includes(search) ||
                (log.baseAmount || '').toString().toLowerCase().includes(search) ||
                (log.platform_fee || '').toString().toLowerCase().includes(search) ||
                (log.platform_tax || '').toString().toLowerCase().includes(search) ||
                (new Date(log.booking_DateTime).toLocaleDateString('en-GB').toLowerCase().includes(search)) ||
                (new Date(log.checkOut).toLocaleDateString('en-GB').toLowerCase().includes(search)) ||
                (new Date(log.checkIN).toLocaleDateString('en-GB').toLowerCase().includes(search))
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
                <Link to="/hotels-booking-details" state={{id: row.id}}>
                    <i
                        className="fa fa-eye text-info"
                        style={{cursor: 'pointer'}} // Add cursor style to indicate it's clickable
                    />
                </Link>
            )
        },
        // {name: <div> Sr.<br/>No.</div>, selector: (row,index) => index +1 || '', sortable: true, wrap: true},
        {name: <div>Booking <br/>ID</div>, selector: row => row.api_booking_id || '', sortable: true, wrap: true},
        {name: <div>Agent <br/>Mail</div>, selector: row => row.agentEmail || '', sortable: true, wrap: true},
        {name: <div>Payment <br/>Status</div>, selector: row => row.paymentStatus || '', sortable: true, wrap: true},
        {
            name: <div>Booking <br />Status</div>,
            selector: row => row.booking_status || '',
            sortable: true,
            wrap: true,
            minWidth: '120px',
            cell: row => {
                let backgroundColor = '';

                // Apply background color based on the ticket_status value
                switch (row.booking_status) {
                    case 'Confirmed':
                        backgroundColor = 'bg-success text-white p-1'; // Light Green for Success
                        break;
                    case 'Fail':
                        backgroundColor = 'bg-danger text-white p-1'; // Red for Failed
                        break;
                    case 'Cancelled':
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
                            {row.booking_status || ''}
                        </div>
                    );
                }
                if(backgroundColor === 'bg-info text-black p-2'){
                    return (
                        <div className="text-black p-1" style={{borderRadius: '7px',background:"lightblue"}}>
                            {row.booking_status || ''}
                        </div>
                    );
                }
                // Return the formatted cell with background color
                return (
                    <div className={backgroundColor} style={{borderRadius: '7px'}}>
                        {row.booking_status || ''}
                    </div>
                );
            }
        },
        {
            name: <div>Booking <br />On</div>,
            selector: row => {
                if (row.booking_DateTime) {
                    const dateObj = new Date(row.booking_DateTime); // Convert to Date object
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
            name: <div>Primary Pax <br />Name</div>,
            cell: (row) => {
                // Parse the JSON safely
                let passenger = row.roomTravellerInfo[0].travellerInfo[0] || "{}" ;

                // Check if passenger exists and return the name or 'N/A'
                return passenger ? `${passenger.fN || "N/A"} ${passenger.lN || "N/A"}` : "N/A";
            },
            sortable: true,
            wrap: true,
            minWidth: '120px'
        },
        {
            name: <div>Check In <br />Date</div>,
            selector: row => {
                if (row.checkIN) {
                    const dateObj = new Date(row.checkIN); // Convert to Date object
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
            name: <div>Check Out <br />Date</div>,
            selector: row => {
                if (row.checkOut) {
                    const dateObj = new Date(row.checkOut); // Convert to Date object
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
            name: <div>Published<br />Amount <br/>(AED)</div>,
            cell: (row) => row.published_rate,
            sortable: true,
            wrap: true,
            minWidth: '120px'
        },
        {
            name: <div>Base<br />Amount <br/>(AED)</div>,
            cell: (row) => row.baseAmount,
            sortable: true,
            wrap: true,
            minWidth: '120px'
        },
        {
            name: <div>Total<br />Tax</div>,
            cell: (row) => row.totalTaxes,
            sortable: true,
            wrap: true,
            minWidth: '120px'
        },
        {name: <div>Total <br/>No. of <br/>Pax</div>, selector: row => row.totalPax || '', sortable: true, wrap: true},
        {name: <div>Total <br/>Adult</div>, selector: row => row.totalAdult || 0, sortable: true, wrap: true},
        {name: <div>Total <br/>Child <br/></div>, selector: row => row.totalChild || 0, sortable: true, wrap: true},
        {name: <div>Admin <br/>Markup <br/>(AED)</div>, selector: row => row.admin_markup || 0, sortable: true, wrap: true},
        {name: <div>Platform <br/>Fee<br/>(AED)</div>, selector: row => row.platform_fee || '', sortable: true, wrap: true},
        {name: <div>Platform <br/>Tax<br/>(AED)</div>, selector: row => row.platform_tax || '', sortable: true, wrap: true},
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

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fromDate') {
            setFromDate(value);
        } else if (name === 'toDate') {
            setToDate(value);
        }
        // Check if 'From' date is greater than 'To' date
        if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            setDateError("'From' date cannot be greater than 'To' date.");
        } else {
            setDateError(''); // Clear error if dates are valid
        }
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
            <PageTitle motherMenu="Hotels" activeMenu="/search-booked-flights" pageContent="Search Bookings"/>

            <div className="card mb-4 fixed">
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
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label>Filter By:</label>
                                        <select
                                            className="form-control"
                                            value={filterBy}
                                            style={{width: '200px', height: '40px', cursor: 'pointer'}}
                                            onChange={(e) => setFilterBy(e.target.value)}
                                        >
                                            <option value="bookingDate">Booking Date</option>
                                            <option value="travelDate">Travel Date</option>
                                        </select>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label>From:</label>
                                        <input
                                            type="date"
                                            name="fromDate"
                                            className="form-control"
                                            value={fromDate}
                                            max={toDate}
                                            onChange={handleDateChange}
                                            style={{width: '200px', height: '40px'}}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label>To:</label>
                                        <input
                                            type="date"
                                            name="toDate"
                                            className="form-control"
                                            value={toDate}
                                            min={fromDate}
                                            onChange={handleDateChange}
                                            style={{width: '200px', height: '40px'}}
                                        />
                                    </div>
                                    {dateError && <div className="text-danger mb-3">{dateError}</div>}
                                    <div className="col-md-3">
                                        <button onClick={() => exportToExcel(columns, filteredLogs, 'data.xlsx')}
                                                className="btn-sm btn btn-primary offset-5">Export to Excel
                                        </button>
                                    </div>
                                </div>
                                <br/>

                                <div className="mb-4">
                                    <div className="row">
                                        <div className=" mb-3 offset-lg-9">
                                            <label
                                                htmlFor="searchTerm"
                                                style={{marginRight: '10px'}}
                                            >
                                                Smart Search
                                            </label>
                                            <input
                                                type="text"
                                                id="searchTerm"
                                                placeholder="Search..."
                                                className="form-control"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{width: '230px', height: '40px'}}
                                            />
                                        </div>
                                    </div>
                                </div>
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

export default SearchHotelBookings;
