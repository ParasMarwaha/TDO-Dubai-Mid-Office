import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Server_URL, adminAuthToken } from '../../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../../store/actions/AuthActions.js";

function MidOfficeLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLogs() {
            setLoading(true);
            try {
                const dataLS = localStorage.getItem(adminAuthToken);
                if (!dataLS) {
                    throw new Error('No authentication token found.');
                }
                const parsedData = JSON.parse(dataLS);
                const response = await fetch(`${Server_URL}admin/mid-office-logs`, {
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

    function onLogout() {
        dispatch(Logout(navigate));
    }

    const filteredLogs = logs.filter(log =>
        (log.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.Remarks || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.time || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => (filteredLogs.length - (currentPage - 1) * rowsPerPage - index),
            sortable: true,
            minWidth: '80px'  // Ensures a reasonable minimum width without fixing it
        },
        {
            name: 'Name',
            selector: row => row.name || '',
            sortable: true,
            wrap: true  // Enables wrapping in case of long names
        },
        {
            name: 'Email',
            selector: row => row.email || '',
            sortable: true,
            wrap: true,  // Allows long email addresses to wrap
            minWidth: '200px'  // Minimum width to handle common email lengths
        },
        {
            name: 'Status',
            selector: row => row.status || '',
            sortable: true,
        },
        {
            name: 'Remark',
            selector: row => row.Remarks || '',
            sortable: true,
            wrap: true,  // Enable text wrapping for potentially long remarks
            minWidth: '150px'  // Minimum width to handle common remarks
        },
        {
            name: 'Date-Time',
            selector: row => row.time || '',
            sortable: true,
            wrap: true  // Enable wrapping for long time values
        },
        {
            name: 'IP Address',
            selector: row => row.client_ip || '',
            sortable: true,
            wrap: true  // Enable wrapping for long time values
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
                <PageTitle motherMenu="Logs" activeMenu="/mid-office-log" pageContent="Mid Office"/>

                <div className="card mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="table-responsive px-3">
                                <h2 className="text-center"><b>Mid Office Logins:</b></h2>
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

export default MidOfficeLog;
