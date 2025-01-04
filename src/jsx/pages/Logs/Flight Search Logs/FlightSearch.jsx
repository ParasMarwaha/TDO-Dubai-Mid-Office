import React, {useEffect, useState} from 'react';
import Swal from 'sweetalert2';
import {adminAuthToken, Server_URL} from '../../../../helpers/config.js';
import DataTable from 'react-data-table-component';
import PageTitle from "../../../layouts/PageTitle.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../../store/actions/AuthActions.js";

function FlightSearch() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                const response = await fetch(`${Server_URL}admin/agents-search-stats`, {
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
                    return onLogout()
                }
                if (result.responseCode === 2) {
                    //00console.log(result.data[0].additionalData)
                    setLogs(result.data);
                    console.log(result.data);
                } else {
                    Swal.fire({icon: 'error', title: result.message});
                }
            } catch (error) {
                Swal.fire({icon: 'error', title: 'An error occurred', text: error.message});
            } finally {
                setLoading(false);
            }
        }

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const search = searchTerm.toLowerCase();

        // Calculate look to book ratio for filtering
        const bookCount = log.additionalData.book_count || 0;
        const searchCount = log.additionalData.search_count || 0;
        const ratio = `${bookCount} : ${searchCount}`;
        const percentage = searchCount > 0 ? ((bookCount / searchCount) * 100).toFixed(2) : '0';
        const lookToBookRatio = `${ratio} (${percentage}%)`;

        return (
            (log.establishment_name || '').toLowerCase().includes(search) ||
            (log.additionalData.search_count?.toString() || '').toLowerCase().includes(search) ||
            (log.additionalData.book_count?.toString() || '').toLowerCase().includes(search) ||
            lookToBookRatio.toLowerCase().includes(search) // Search in Look to Book Ratio
        );
    });

// Inside the column definition for the details button
    const columns = [
        {
            name: '',
            cell: (row) => (
                <Link to="/search-details" state={{id: row.id}}>
                    <i
                        className="fa fa-eye text-info"
                        style={{cursor: 'pointer'}}  // Add cursor style to indicate it's clickable
                    />
                </Link>

            ),
            sortable: false,
            width: '100px',
            center: true,
        },
        {name: 'Agent Name', selector: row => row.establishment_name || '', sortable: true, center: true},
        {name: 'Search Count', selector: row => row.additionalData.search_count || 0, sortable: true, center: true},
        {name: 'Book Count', selector: row => row.additionalData.book_count || 0, sortable: true, center: true},
        {
            name: 'Book to Look Ratio',
            selector: row => {
                const bookCount = row.additionalData.book_count || 0;
                const searchCount = row.additionalData.search_count || 0;

                // Calculate ratio and percentage
                const ratio = `${bookCount} : ${searchCount}`;
                const percentage = searchCount > 0 ? ((bookCount / searchCount) * 100).toFixed(2) : 0;

                return `${ratio} (${percentage}%)`;
            },
            center: true,
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

    // const handleDetailsClick = (id) => {
    //     navigate(`/search-details`, { state: { id } });
    // };

    return (
        <div>
            <PageTitle motherMenu="Logs" activeMenu="/search-log"
                       pageContent="Travel Agent Flight Search"/>

            <div className="card mb-4">
                <div className="card-body">
                    <div className="table-responsive px-3">
                        <h2 className="text-center"><b>Flight Searches</b></h2>
                        <hr/>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlightSearch;
