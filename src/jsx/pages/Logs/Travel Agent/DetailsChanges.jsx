import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Server_URL, adminAuthToken } from '../../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../../store/actions/AuthActions.js";

function DetailsChanges() {
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
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const dataLS = localStorage.getItem(adminAuthToken);
            if (!dataLS) {
                throw new Error('No authentication token found.');
            }
            const parsedData = JSON.parse(dataLS);
            const response = await fetch(`${Server_URL}admin/travel-agents-details-changes`, {
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
    };

    // Apply filtering to logs based on the search term
    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();
        return (
            (log.establishment_name || '').toLowerCase().includes(search) ||
            log.agent_id.toString().includes(search) ||
            (log.updated_by || '').toLowerCase().includes(search)
        );
    });

    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            minWidth: '70px',  // Set a minimum width to ensure it doesn't shrink too much
        },
        {
            name: 'Agent Name',
            selector: row => row.establishment_name || '',
            sortable: true,
            wrap: true,  // Enable text wrapping for long names
            minWidth: '150px'  // Set a minimum width for readability
        },
        {
            name: 'Updated By',
            selector: row => row.updated_by || '',
            sortable: true,
            wrap: true,  // Enable text wrapping for longer values
            minWidth: '150px'
        },
        {
            name: 'Updated On',
            selector: row => row.updated_on ? new Date(row.updated_on).toLocaleString() : '',
            sortable: true,
            wrap: true,  // Enable wrapping for longer date-time values
            minWidth: '160px'  // Provide sufficient width for date-time display
        },
        {
            name: 'IP Address',
            selector: row => row.client_ip || '',
            sortable: true,
            wrap: true,  // Enable text wrapping for long names
            minWidth: '150px'  // Set a minimum width for readability
        },
    ];

    // Function to render only the changes between old and new values
    const renderChangedValues = (oldValues, newValues) => {
        const oldObj = JSON.parse(oldValues || '{}');
        const newObj = JSON.parse(newValues || '{}');

        // Filter only the changed values
        const changes = Object.keys(newObj).reduce((acc, key) => {
            if (oldObj[key] !== newObj[key]) {
                acc[key] = { old: oldObj[key], new: newObj[key] };
            }
            return acc;
        }, {});

        return (
            <div className="table-responsive p-4">
                <table className="table table-bordered align-middle mb-0"
                       style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                    <thead className="bg-primary text-white">
                    <tr>
                        <th className="text-center py-3" style={{ fontWeight: 600 }}>Field</th>
                        <th className="text-center py-3" style={{ fontWeight: 600 }}>Old Value</th>
                        <th className="text-center py-3" style={{ fontWeight: 600 }}>New Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(changes).map(([key, { old, new: newValue }]) => (
                        <tr key={key} className="border-bottom">
                            <td className="text-center"
                                style={{ whiteSpace: 'nowrap', fontSize: '0.95rem', fontWeight: 500 }}>{key}</td>
                            <td className="text-center"
                                style={{ color: '#B22222', backgroundColor: '#fff5f5', fontSize: '0.9rem' }}>
                                {old || 'N/A'}
                            </td>
                            <td className="text-center"
                                style={{ color: '#228B22', backgroundColor: '#f5fff5', fontSize: '0.9rem' }}>
                                {newValue || 'N/A'}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Expandable content for displaying only the changes between old and new values
    const expandableRow = ({ data }) => renderChangedValues(data.old_values, data.new_values);

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
            <PageTitle motherMenu="Logs" activeMenu="Travel Agent Details Changes" pageContent="Travel Agent Details Changes" />

            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive px-3">
                        <h2 className="text-center"><b>Details Changes</b></h2>
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
                                    expandableRows
                                    expandableRowsComponent={expandableRow}
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

export default DetailsChanges;
