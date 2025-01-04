import React, { useState, useEffect,useMemo } from 'react';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { Server_URL, adminAuthToken,customStyles } from '../../../../helpers/config.js';
import PageTitle from "../../../layouts/PageTitle.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../../../store/actions/AuthActions.js";
import DataTable from 'react-data-table-component';

function FlightCommercial() {
    const [markups, setMarkups] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState([]);



    function onLogout() {
        dispatch(Logout(navigate));
    }

    async function deletePlan(id) {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                let dataLS = localStorage.getItem(adminAuthToken);
                if (dataLS) {
                    dataLS = JSON.parse(dataLS);
                }

                const api = Server_URL + `admin/delete-flight-commercial/${id}`;
                let response = await fetch(api, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataLS.idToken}`
                    },
                });
                response = await response.json();

                if (response.message === 'Session Expired' || response.message === 'Token Missing') {
                    return onLogout();
                }
                if (response.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: 'Deleted!', text: response.message })
                        .then(() => {
                            fetchMarkups(); // Refresh the markups list after deletion
                        });
                } else {
                    Swal.fire({ icon: 'error', title: response.message });
                }
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message
            });
        }
    }

    async function fetchMarkups() {
        setLoading(true);
        try {
            const dataLS = localStorage.getItem(adminAuthToken);
            if (!dataLS) {
                throw new Error('No authentication token found.');
            }
            const parsedData = JSON.parse(dataLS);
            const response = await fetch(`${Server_URL}admin/get-flight-commercial`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${parsedData.idToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            if (result.responseCode === 2) {
                setMarkups(result.data);
                setLogs(result.data);
                console.log(result.data);
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
        fetchMarkups();
    }, []);

    // Define columns for the DataTable
    const columns = useMemo(() => [
        {
            name: "",
            button: true,
            cell: row => (
                <i
                    style={{ cursor: 'pointer' }}
                    onClick={() => deletePlan(row?.id)}
                    className="fa fa-trash icon-size text-primary"
                ></i>
            ),
            width: '50px',
        },
        {
            name: "",
            button: true,
            cell: row => (
                <Link to="/edit-flight-commercial" state={{ row: row }}>
                    <i className="fa fa-edit icon-size text-primary"></i>
                </Link>
            ),
            width: '50px',
        },
        {
            name: "Product",
            selector: row => row?.product,
            sortable: true,
            minWidth: '100px',
            wrap:true
        },
        {
            name: "Vendor",
            selector: row => row?.vendor,
            sortable: true,
            minWidth: '90px',
            wrap: true
        },
        {
            name: "Booking Type",
            selector: row => row?.booking_type,
            sortable: true,
            minWidth: '140px',
            wrap: true
        },
        {
            name: "Fare Type",
            selector: row => row?.fare,
            sortable: true,
            minWidth: '110px',
            wrap: true
        },
        {
            name: "Airline",
            selector: row => row?.carriers,
            sortable: true,
            minWidth: '100px',
            wrap: true
        },
        {
            name: "Markup Type",
            selector: row => row?.markup_type,
            sortable: true,
            minWidth: '130px',
            wrap: true
        },
        {
            name: "Markup PLB",
            selector: row => row?.markup_plb,
            sortable: true,
            minWidth: '120px',
            wrap: true
        },
        {
            name: "Markup %",
            selector: row => row?.markup_percentage,
            sortable: true,
            minWidth: '110px',
            wrap: true
        },
        {
            name: "Group Type",
            selector: row => row?.group_name,
            sortable: true,
            minWidth: '120px',
            wrap: true
        },
    ], []);

    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();

        return (
            ((log.product || '').toLowerCase().includes(search)) || // Product column
            ((log.vendor || '').toLowerCase().includes(search)) || // Vendor column
            ((log.booking_type || '').toLowerCase().includes(search)) || // Booking Type column
            ((log.fare || '').toLowerCase().includes(search)) || // Fare Type column
            ((log.carriers || '').toLowerCase().includes(search)) || // Airline column
            ((log.markup_type || '').toLowerCase().includes(search)) || // Markup Type column
            ((log.markup_plb?.toString() || '').toLowerCase().includes(search)) || // Markup PLB column
            ((log.markup_percentage?.toString() || '').toLowerCase().includes(search)) || // Markup % column
            ((log.group_name || '').toLowerCase().includes(search))  // Group Type column
        );
    });


    return (
        <div>
            <PageTitle motherMenu="Control Panel" activeMenu="/manage-flight-commission" pageContent="Flights/ Flight Commercial" />

            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <h2 className="text-center"><b>Commercial Details</b></h2>
                        <hr/>
                        <div className="bg-light-subtle py-2 mb-3">
                            <Link to="/add-flight-commercial">
                                <button type="button" className="btn btn-primary"> + Create New</button>
                            </Link>
                        </div>

                        <div className="mb-3 offset-lg-9">
                            <input
                                type="text"
                                placeholder="Filter Data Table"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{width: '250px', height: '40px'}}
                                disabled={loading}
                            />
                        </div>

                        <DataTable
                            columns={columns}
                            data={filteredLogs}
                            progressPending={loading}
                            highlightOnHover
                            pagination
                            style={customStyles}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlightCommercial;