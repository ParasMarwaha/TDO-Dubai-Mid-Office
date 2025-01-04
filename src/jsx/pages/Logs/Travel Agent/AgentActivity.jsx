import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Server_URL, adminAuthToken } from '../../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../../store/actions/AuthActions.js";

function TravelAgentActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    function onLogout() {
        dispatch(Logout(navigate));
    }

    useEffect(() => {
        async function fetchLogs() {
            setLoading(true);
            try {
                const dataLS = localStorage.getItem(adminAuthToken);
                if (!dataLS) {
                    throw new Error('No authentication token found.');
                }
                const parsedData = JSON.parse(dataLS);
                const response = await fetch(`${Server_URL}admin/travel-agent-activity-logs`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${parsedData.idToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const result = await response.json();
                if(result.message === 'Session Expired' || result.message === 'Token Missing') {
                    return onLogout()
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

    const filteredLogs = logs.filter(log =>
        (log.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.remarks || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.time || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => (filteredLogs.length - (currentPage - 1) * rowsPerPage - index),
            sortable: true,
            width: '90px'  // Minimum width to ensure the column doesn't shrink too much
        },
        {
            name: 'Agent Name',
            selector: row => row.name || '',
            sortable: true,
            wrap: true,  // Enable text wrapping for long names
            minWidth: '100px'  // Minimum width for better readability
        },
        {
            name: 'Email',
            selector: row => row.email || '',
            sortable: true,
            wrap: true,  // Allow long email addresses to wrap
            minWidth: '250px'  // Set a minimum width to handle longer email addresses
        },
        {
            name: 'Remark',
            selector: row => row.remarks || '',
            sortable: true,
            wrap: true,  // Enable wrapping for potentially long remarks
            minWidth: '180px'  // Minimum width to accommodate longer remarks
        },
        {
            name: 'Date-Time',
            selector: row => row.time || '',
            sortable: true,
            wrap: true  // Enable wrapping for time if it's too long
        },
        {
            name: 'ID Address',
            selector: row => row.client_ip || '',
            sortable: true,
            wrap: true  // Enable wrapping for time if it's too long
        }
    ];

    // Slice data based on current page and rows per page
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
            <div>
                <PageTitle motherMenu="Logs" activeMenu="/travel-agent-activity-log" pageContent="Travel Agent Activity"/>

                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="table-responsive px-3">
                                <h2 className="text-center"><b>Travel Agent Activities:</b></h2>
                                <hr/>
                                {loading ? (
                                    <div className="text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row">
                                        <div className="mb-3 offset-lg-9">
                                            <input
                                                type="text"
                                                placeholder="Filter Table Data"
                                                className="form-control"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{width: '250px', height: '40px'}}
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
                                    </div>
                                )}
                                <br/>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
        ;
}

export default TravelAgentActivityLogs;
