import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {Server_URL, adminAuthToken, Server_URL_FILE} from '../../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../../layouts/PageTitle.jsx";
import moment from 'moment';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Logout} from "../../../../store/actions/AuthActions.js";

function DocumentChanges() {
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
                const response = await fetch(`${Server_URL}admin/travel-agents-document-changes`, {
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

    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();
        return (
            (log.establishment_name || '').toLowerCase().includes(search) ||
            (log.document_type || '').toLowerCase().includes(search) ||
            (log.updated_by || '').toLowerCase().includes(search) ||
            (log.remarks || '').toLowerCase().includes(search)
        );
    });

    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            center: true,
            width: '90px',  // Minimum width for better responsiveness
        },
        {
            name: 'Agent Name',
            selector: row => row.establishment_name || '',
            sortable: true,
            wrap: true,  // Enable wrapping for long names
            minWidth: '150px',  // Minimum width for readability
        },
        {
            name: 'Document Type',
            selector: row => row.document_type || '',
            sortable: true,
            wrap: true,  // Enable wrapping for long document types
            minWidth: '160px',  // Minimum width for readability
        },
        {
            name: 'Document',
            cell: row => (
                <a
                    href={`${Server_URL_FILE}${row.document_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                >
                    View Document
                </a>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '150px'  // Set minimum width for consistent button size
        },
        {
            name: 'Remarks',
            selector: row => row.remarks || '',
            sortable: true,
            wrap: true,  // Enable wrapping for longer remarks
        },
        {
            name: 'Updated By',
            selector: row => row.updated_by || '',
            sortable: true,
            wrap: true,
        },
        {
            name: 'Updated On',
            selector: row => moment(row.updated_on).format('DD MMM YYYY, HH:mm:ss') || '',
            sortable: true,
            wrap: true,  // Enable wrapping for long date strings
        },
        {
            name: 'IP Address',
            selector: row => row.client_ip || '',
            sortable: true,
            wrap: true,
        },
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
            <PageTitle motherMenu="Logs" activeMenu="/document-changes" pageContent="Travel Agent Document Changes" />

            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive px-3">
                        <h2 className="text-center"><b>Document Changes</b></h2>
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
                                    noHeader
                                    className="table table-striped table-hover"
                                    customStyles={{
                                        header: {
                                            style: {
                                                minHeight: '56px',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                            },
                                        },
                                        rows: {
                                            style: {
                                                minHeight: '48px',
                                            },
                                        },
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentChanges;
