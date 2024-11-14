import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { adminAuthToken, Server_URL } from "../../../../helpers/config.js";
import { Logout } from "../../../../store/actions/AuthActions.js";
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import PageTitle from "../../../layouts/PageTitle.jsx";
import * as XLSX from "xlsx";


function ViewUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState([]); // Complete user data
    const [allUsers, setAllUsers] = useState([]); // Store all users
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page

    function onLogout() {
        dispatch(Logout(navigate));
    }

    async function ReadUser() {
        setLoading(true);
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const url = Server_URL + "admin/staff";
            let response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
            });
            let data = await response.json();

            if(data.message === 'Session Expired' || data.message === 'Token Missing') {
                return onLogout()
            }
            if (data) {
                if (data.responseCode === 1) {
                    if (data.message === 'Token Missing') {
                        onLogout();
                        Swal.fire({
                            icon: 'error',
                            title: 'Session Expired ',
                            showConfirmButton: true,
                            timer: 3000,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: data.message,
                            showConfirmButton: true,
                            timer: 3000,
                        });
                    }
                } else if (data.responseCode === 2) {
                    setUser(data.data);
                    setAllUsers(data.data); // Set all users data here
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected response status',
                    text: 'The server returned an unexpected status code',
                    showConfirmButton: true,
                    timer: 3000,
                });
            }
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        ReadUser();
        setCurrentPage(1); // Reset to first page on mount
    }, []);

    const toggleUserStatus = async (id, status) => {
        const url = `${Server_URL}admin/staff-${status ? 'inactive' : 'active'}/${id}`;
        let dataLS = localStorage.getItem(adminAuthToken);
        if (dataLS) dataLS = JSON.parse(dataLS);

        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
            });
            const data = await response.json();

            if(data.message === 'Session Expired' || data.message === 'Token Missing') {
                return onLogout()
            }
            Swal.fire({
                icon: data.error ? "error" : "success",
                title: data.message,
                showConfirmButton: true,
                timer: 3000,
            }).then(() => {
                if (!data.error) ReadUser();
            });
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        }
    };

    const columns = [
        { name: 'Sr No.', selector: (row, index) => index + 1 + (currentPage - 1) * itemsPerPage, sortable: true, width: '100px', center: true },
        { name: 'Name', selector: row => `${row.first_name} ${row.last_name}`, sortable: true, center: true },
        { name: 'Role', selector: row => row.role || '', sortable: true, center: true },
        { name: 'Email', selector: row => row.email || '', sortable: true, center: true,width: '300px' },
        { name: 'Phone No.', selector: row => row.mobile || '', sortable: true, center: true },
        { name: 'Status', selector: row => row.status === 1 ? 'Active' : 'Inactive', sortable: true, center: true, cell: row => (
                <span style={{ color: row.status === 1 ? 'green' : 'red' }}>
                    {row.status === 1 ? 'Active' : 'Inactive'}
                </span>
            ) },
        {
            name: 'Actions',
            selector: row => row.id, center: true,
            cell: row => (
                <div className="text-center">
                    <button
                        onClick={() => toggleUserStatus(row.id, row.status === 1)}
                        style={{ background: row.status === 1 ? 'red' : 'green', width: '100px', padding: '5px 5px' }}
                        className={`btn btn-sm ${row.status === 1 ? 'btn-danger' : 'btn-success'}`}
                    >
                        {row.status === 1 ? 'Inactivate' : 'Activate'}
                    </button>
                </div>
            ),
            sortable: false,
            width: '150px'
        }
    ];

    const filteredUsers = user.filter(user =>
        (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.status === 1 ? 'Active' : 'Inactive').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginate filtered data
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const exportToExcel = (fileName) => {
        const currentTime = new Date().getTime();
        const file = `${currentTime}_${fileName}.xlsx`;

        const formattedData = allUsers.map(user => ({
            'Name': `${user.first_name} ${user.last_name}`,
            'Role': user.role,
            'Email': user.email,
            'Phone No.': user.mobile,
            'Status': user.status === 1 ? 'Active' : 'Inactive'
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, file);
    };

    return (
        <div>
            <div>
                <PageTitle motherMenu="Staff" activeMenu="All Staff Members " pageContent="All Staff Members" />

                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">All Staff Members</h4>

                        <button
                            onClick={() => exportToExcel('Staff')}
                            className="btn btn-sm btn-success">
                            Export to Excel <i className="fa fa-file-excel"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="mb-3 offset-sm-9">
                                <input
                                    type="text"
                                    placeholder="Filter Data Table"
                                    className="form-control"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '250px', height: '40px' }}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <DataTable
                                columns={columns}
                                data={paginatedUsers} // Use paginated data here
                                pagination
                                paginationServer
                                paginationTotalRows={filteredUsers.length} // Total rows for pagination
                                onChangePage={page => setCurrentPage(page)} // Update current page
                                onChangeRowsPerPage={numberOfRows => {
                                    setItemsPerPage(numberOfRows);
                                    setCurrentPage(1); // Reset to first page when changing items per page
                                }}
                                highlightOnHover
                                dense
                                striped
                                progressPending={loading}
                                progressComponent={<div className="text-center">
                                    <div className="spinner-border" role="status"><span className="sr-only">Loading...</span>
                                    </div>
                                </div>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewUser;
