import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { Server_URL, adminAuthToken } from '../../../../helpers/config.js';
import PageTitle from "../../../layouts/PageTitle.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../../../store/actions/AuthActions.js";
import DataTable from 'react-data-table-component';

function ManageMarkups() {
    const [markups, setMarkups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedPlanId, setExpandedPlanId] = useState(null);  // Track expanded plan
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

                const api = Server_URL + `admin/delete-flight-markup/${id}`;
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
            const response = await fetch(`${Server_URL}admin/markups`, {
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
    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => index + 1,
            center: true
        },
        {
            name: 'Plan Name',
            cell: row => (
                <span
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={() => handlePlanClick(row.id)}
                >
                    {row.plan_name}
                </span>
            ),
            center: true
        },
        {
            name: 'Type',
            selector: row => row.type,
            center: true
        },
        {
            name: 'Markup Value',
            selector: row => row.value,
            center: true
        },
        {
            name: 'Cancellation Charge',
            selector: row => row.cancellation,
            center: true
        },
        {
            name: 'Rescheduling Charge',
            selector: row => row.rescheduling,
            center: true
        },
        {
            name: '',
            cell: row => (
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePlan(row.id)}
                    title="Delete Plan"
                >
                    <i className="fa fa-trash" aria-hidden="true" style={{ fontSize: '16px' }}></i>
                </button>
            ),
            center: true
        }
    ];

    const handlePlanClick = (id) => {
        setExpandedPlanId(expandedPlanId === id ? null : id);  // Toggle plan details visibility
    };

    const ExpandedComponent = ({ data }) => {
        return (
            <div style={{ padding: '10px', backgroundColor: '#f5f5f5' }}>
                {data.additionalData.map((typeData, index) => (
                    <div key={index} className="row mb-2">
                        <div className="col-sm-4"><b>Carrier Name:</b> {typeData.carriers}</div>
                        <div className="col-sm-4"><b>Fare Type:</b> {typeData.fare}</div>
                        <div className="col-sm-4"><b>Supplier Name:</b> {typeData.supplier}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <PageTitle motherMenu="Control Panel" activeMenu="Flights/ Manage Markups" pageContent="Flights/ Manage Markups" />

            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <h2 className="text-center"><b>Already Added Markups:</b></h2>
                        <hr />
                        <div className="bg-light-subtle py-2 mb-3">
                            <Link to="/add-flight-markups">
                                <button type="button" className="btn btn-primary">Add New Markups</button>
                            </Link>
                        </div>

                        <DataTable
                            columns={columns}
                            data={markups}
                            progressPending={loading}
                            highlightOnHover
                            expandableRows
                            expandableRowsComponent={ExpandedComponent} // Define expanded content
                            expandableRowExpanded={row => row.id === expandedPlanId}  // Link expanded state to the clicked plan
                            pagination
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageMarkups;