import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { adminAuthToken, Server_URL, Server_URL_FILE } from "../../../helpers/config.js";
import { Logout } from "../../../store/actions/AuthActions.js";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import PageTitle from "../../layouts/PageTitle.jsx";
import Modal from 'react-bootstrap/Modal';
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form"; // Hook form to handle remarks input

function PendingRequests() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user details
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false); // Loading state for buttons
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false); // State to handle modal visibility
    const { register, handleSubmit, formState: { errors }, reset } = useForm(); // Form handling

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

            const url = Server_URL + "admin/pending-requests";
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
            if (data.responseCode === 1) {
                if (data.message === 'Token Missing') {
                    onLogout();
                    await Swal.fire({
                        icon: 'error',
                        title: 'Session Expired ',
                        showConfirmButton: true,
                        timer: 3000,
                    });
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: data.message,
                        showConfirmButton: true,
                        timer: 3000,
                    });
                }
            } else if (data.responseCode === 2) {
                setUser(data.data);
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Unexpected response status',
                    text: 'The server returned an unexpected status code',
                    showConfirmButton: true,
                    timer: 3000,
                });
            }
        } catch (e) {
            await Swal.fire({
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
        setCurrentPage(1);
    }, []);

    const openModal = (userData) => {
        setSelectedUser(userData);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
        reset(); // Reset form when modal closes
    };

    const toggleUserStatus = async (data, action) => {
        setButtonLoading(true); // Start loading
        const url = `${Server_URL}admin/${action}-requests/${selectedUser.id}`;
        let dataLS = localStorage.getItem(adminAuthToken);
        if (dataLS) dataLS = JSON.parse(dataLS);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify({ remarks_admin: data.remarks }) // Send remarks with the request
            });
            const result = await response.json();

            if(result.message === 'Session Expired' || result.message === 'Token Missing') {
                return onLogout()
            }
            Swal.fire({
                icon: result.error ? "error" : "success",
                title: result.message,
                showConfirmButton: true,
                timer: 3000,
            }).then(() => {
                if (!result.error) {
                    ReadUser();
                    handleModalClose();
                }
            });
        } catch (e) {
            await Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        } finally {
            setButtonLoading(false); // Stop loading
        }
    };

    // Table Columns including Sr No.
    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => index + 1 + (currentPage - 1) * itemsPerPage,
            sortable: false,
            width: '70px',
            center: true
        },
        { name: 'Agent Name', selector: row => row.establishment_name || '', sortable: true, center: true },
        { name: 'Agent Email', selector: row => row.email || '', sortable: true, center: true },
        { name: 'Date of Deposit', selector: row => row.date_of_deposit || '', sortable: true, center: true },
        {
            name: '',
            cell: row => (
                <button
                    onClick={() => openModal(row)}
                    className="btn btn-sm btn-info"
                    style={{ width: '80px', padding: '5px 5px' }}
                >
                    Details
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    // Filter users based on the search term
    const filteredUsers = user.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.establishment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.date_of_deposit?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <PageTitle motherMenu="Dashboard" activeMenu="Pending Requests" pageContent="Pending Requests" />

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">All Pending Requests</h4>
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
                            data={paginatedUsers}
                            pagination
                            paginationServer
                            paginationPerPage={itemsPerPage}
                            paginationTotalRows={filteredUsers.length}
                            onChangePage={page => setCurrentPage(page)}
                            onChangeRowsPerPage={numberOfRows => {
                                setItemsPerPage(numberOfRows);
                                setCurrentPage(1);
                            }}
                            highlightOnHover
                            dense
                            striped
                            progressPending={loading}
                            progressComponent={<div className="text-center">
                                <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>
                            </div>}
                        />
                    </div>
                </div>
            </div>

            {/* Modal for Request Details */}
            {selectedUser && (
                <Modal className="modal-lg" show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Request Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Agent Name:</strong> {selectedUser.establishment_name}</p>
                                <p><strong>Agent Email:</strong> {selectedUser.email}</p>
                                <p><strong>Date of Deposit:</strong> {selectedUser.date_of_deposit}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Amount:</strong> {selectedUser.amount}</p>
                                <p><strong>Transaction ID:</strong> {selectedUser.transaction_id}</p>
                                <p><strong>Mode of Payment:</strong> {selectedUser.mode_of_payment}</p>
                                <p><strong>Verification Proof:</strong><a
                                    href={`${Server_URL_FILE}${selectedUser.screenshot}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'blue', textDecoration: 'underline' }}
                                >
                                    View Document
                                </a></p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(data => toggleUserStatus(data, 'approve'))}>
                            <div className="row">
                                <div className="col-lg-12"><label htmlFor="remarks"><strong>Remarks: </strong><span
                                    className="text-danger">*</span></label>
                                    <textarea
                                        {...register('remarks', {required: 'Remarks are required'})}
                                        name="remarks"
                                        id="remarks"
                                        placeholder="Enter Remarks...."
                                        className="form-control"
                                    ></textarea>
                                    <ErrorMessage
                                        errors={errors}
                                        name="remarks"
                                        render={({message}) => <div className="text-danger">{message}</div>}
                                    /></div>
                            </div>

                            <Modal.Footer>
                                <button className="btn btn-sm btn-success" disabled={buttonLoading} type="submit">
                                    {buttonLoading ? <span className="spinner-border spinner-border-sm" role="status"
                                                           aria-hidden="true"></span> : 'Approve'}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    disabled={buttonLoading}
                                    onClick={handleSubmit(data => toggleUserStatus(data, 'reject'))}
                                >
                                {buttonLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Reject'}
                                </button>
                            </Modal.Footer>
                        </form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

export default PendingRequests;
