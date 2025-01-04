import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { adminAuthToken, Server_URL } from "../../../helpers/config.js";
import PageTitle from "../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";

const schema = yup.object({
    fareType: yup.string().required("Fare type is required"),
}).required();

function FareType() {
    const [fareTypes, setFareTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentFareType, setCurrentFareType] = useState(null);
    const [addLoading, setAddLoading] = useState(false);  // For add form loading
    const [editLoading, setEditLoading] = useState(false); // For edit form loading
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onLogout() {
        dispatch(Logout(navigate));
    }


    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        reset: resetCreate,
        formState: { errors: errorsCreate },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        setValue: setValueEdit,
        formState: { errors: errorsEdit },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        fetchFareTypes();
    }, []);

    async function fetchFareTypes() {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/fare-types`;
            let response = await fetch(api, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${dataLS.idToken}`,
                },
            });
            const responseData = await response.json();

            if(responseData.message === 'Session Expired' || responseData.message === 'Token Missing') {
                return onLogout()
            }
            if (responseData.responseCode === 2) {
                setFareTypes(responseData.data);
            } else {
                Swal.fire({
                    icon: responseData.error ? "error" : "warning",
                    title: responseData.message,
                });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        }
    }

    async function onCreate(data) {
        setAddLoading(true); // Start loading for add
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/fare-types`;
            let response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${dataLS.idToken}`,
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if(responseData.message === 'Session Expired' || responseData.message === 'Token Missing') {
                return onLogout()
            }
            if (response.status === 200 && responseData.responseCode === 2) {
                Swal.fire({ icon: "success", title: responseData.message });
                resetCreate();
                fetchFareTypes();
            } else {
                Swal.fire({
                    icon: responseData.error ? "error" : "warning",
                    title: responseData.message,
                });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        } finally {
            setAddLoading(false); // Stop loading for add
        }
    }

    async function onEdit(data) {
        setEditLoading(true); // Start loading for edit
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/fare-types`;
            let response = await fetch(api, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${dataLS.idToken}`,
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if(responseData.message === 'Session Expired' || responseData.message === 'Token Missing') {
                return onLogout()
            }
            if (response.status === 200 && responseData.responseCode === 2) {
                Swal.fire({ icon: "success", title: responseData.message });
                resetEdit();
                closeEditModal();
                fetchFareTypes();
            } else {
                Swal.fire({
                    icon: responseData.error ? "error" : "warning",
                    title: responseData.message,
                });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        } finally {
            setEditLoading(false); // Stop loading for edit
        }
    }

    async function deleteFareType(id) {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                let dataLS = localStorage.getItem(adminAuthToken);
                if (dataLS) {
                    dataLS = JSON.parse(dataLS);
                }

                const api =` ${Server_URL}admin/fare-types/${id}`;
                let response = await fetch(api, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${dataLS.idToken}`,
                    },
                });
                const responseData = await response.json();

                if(responseData.message === 'Session Expired' || responseData.message === 'Token Missing') {
                    return onLogout()
                }
                Swal.fire({
                    icon: responseData.error ? "error" : "success",
                    title: responseData.message,
                    showConfirmButton: true,
                    timer: 3000,
                });

                if (!responseData.error) {
                    fetchFareTypes(); // Reload the list after deletion
                }
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        }
    }

    function openEditModal(fareType) {
        setCurrentFareType(fareType);
        setValueEdit("fareType", fareType.fare);
        setValueEdit("fare_id", fareType.id);
        setShowEditModal(true);
    }

    function closeEditModal() {
        setShowEditModal(false);
        setCurrentFareType(null);
    }

    const filteredFareTypes = fareTypes.filter((fareType) =>
        fareType.fare.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentData = filteredFareTypes.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const columns = [
        { name: "Sr No.", selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, sortable: true, center: true },
        { name: "Fare Type", selector: (row) => row.fare, sortable: true, center: true },
        {
            name: "",
            cell: (row) => (
                <button
                    onClick={() => openEditModal(row)}
                    className="btn btn-primary btn-sm"
                    style={{ background: 'blue', width: '90px', padding: '5px 5px' }}
                    disabled={editLoading} // Disable edit button while loading
                >
                    Edit
                </button>
            ),
            center: true,
        },
        {
            name: "",
            cell: (row) => (
                <button
                    style={{ background: 'red', width: '90px', padding: '5px 5px' }}
                    onClick={() => deleteFareType(row.id)}
                    className="btn btn-danger btn-sm"
                >
                    Delete
                </button>
            ),
            center: true,
        },
    ];

    return (
        <div>
            <PageTitle motherMenu="Control Panel" activeMenu="/fare-type" pageContent="Fare" />

            {/* Edit Modal */}
            <div className={`modal fade ${showEditModal ? "show d-block" : "d-none"}`} tabIndex="-1"
                 aria-labelledby="editModalLabel" aria-hidden={!showEditModal}
                 style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Update Fare Type</h5>
                            <button type="button" className="btn-close" onClick={closeEditModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmitEdit(onEdit)}>
                                <input type="hidden" id="fare_id" name="fare_id" />
                                <div className="mb-3">
                                    <label htmlFor="fareTypeEdit">Fare Type <span className="text-danger">*</span></label>
                                    <input
                                        {...registerEdit("fareType")}
                                        id="fareTypeEdit"
                                        name="fareType"
                                        className="form-control"
                                    />
                                    {errorsEdit.fareType && <p className="text-danger">{errorsEdit.fareType.message}</p>}
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                                    {editLoading ? "Updating..." : "Update Fare Type"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmitCreate(onCreate)}>
                        <div className="row bg-light-subtle py-2 mb-3">
                            <div className="text-center">
                                <h2><b>Fare Types</b></h2>
                                <div className="row">
                                    <div className="col-sm-4"></div>
                                    <div className="col-sm-4">
                                        <hr style={{ color: 'blue', border: '2px solid' }} />
                                    </div>
                                    <div className="col-sm-4"></div>
                                </div>
                            </div>

                            {/* Fare Type Name */}
                            <div className="col-12" style={{ marginTop: '12px' }}>
                                <span><b>Fare Type</b></span>
                                <input
                                    {...registerCreate("fareType")}
                                    className="form-control"
                                    placeholder="Enter Fare Name"
                                    style={{ width: '400px' }}
                                />
                                {errorsCreate.fareType && <p className="text-danger">{errorsCreate.fareType.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="col-12" style={{ marginTop: '12px' }}>
                                <button id="add-btn" type="submit" className="btn btn-primary" disabled={addLoading}>
                                    {addLoading ? 'Adding...' : 'Add Fare Type'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Search Input */}
                    <div className="row">
                        <div className="mb-3 offset-lg-9">
                            <input
                                type="text"
                                placeholder="Search Fare Types..."
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '250px', height: '40px' }}
                            />
                        </div>
                    </div>

                    {/* Fare Type Table */}
                    <div className="table-responsive">
                        <DataTable
                            columns={columns}
                            data={currentData}
                            pagination
                            paginationServer
                            paginationPerPage={rowsPerPage}
                            onChangePage={(page) => {
                                setCurrentPage(page); // Update the current page
                            }}
                            paginationTotalRows={filteredFareTypes.length} // Set total rows here
                            onChangeRowsPerPage={numberOfRows => {
                                setRowsPerPage(numberOfRows);
                                setCurrentPage(1); // Reset to first page when changing rows per page
                            }}
                            striped
                            highlightOnHover
                            pointerOnHover
                            responsive
                            noHeader
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FareType;
