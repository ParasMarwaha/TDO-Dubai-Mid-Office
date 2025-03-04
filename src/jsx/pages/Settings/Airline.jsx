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
import log from "eslint-plugin-react/lib/util/log.js";

const schema = yup.object({
    AirlineName: yup.string().required("Airline Name is required"),
    AirlineCode: yup.string().required("Airline Code is required"),
}).required();


function Airline() {
    const [AirlineNames, setAirlineNames] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
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
        fetchAirlines().then();
    }, []);

    async function fetchAirlines() {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/airlines`;
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
                console.log(responseData.data)
                setAirlineNames(responseData.data);
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
        setAddLoading(true);
        console.log(data)// Start loading for add
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/airlines`;
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
                await fetchAirlines();
                closeCreateModal()
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
        console.log(data)
        setEditLoading(true); // Start loading for edit
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/airlines`;
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
                await fetchAirlines();
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

    async function deleteAirline(id) {
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

                const api =` ${Server_URL}admin/airlines/${id}`;
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
                    fetchAirlines(); // Reload the list after deletion
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

    function openEditModal(Airline) {
        setCurrentFareType(Airline);
        setValueEdit("AirlineName", Airline.Name);
        setValueEdit("AirlineCode", Airline.Code);
        setValueEdit("Airline_id", Airline.AirlineIndex);
        setShowEditModal(true);
    }

    function onCreateModal() {
        setShowCreateModal(true);
    }

    function closeEditModal() {
        setShowEditModal(false);
        setCurrentFareType(null);
    }

    function closeCreateModal() {
        setShowCreateModal(false);
        setCurrentFareType(null);
    }


    const filteredAirline = AirlineNames.filter((Airline) =>
        Airline.Name && Airline.Name.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        Airline.Code && Airline.Code.toLowerCase().includes((searchQuery || "").toLowerCase())
    );


    const currentData = filteredAirline.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const columns = [
        { name: "Sr No.", selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, sortable: true, wrap: true },
        { name: <div>Airline <br/>Code</div>, selector: (row) => row.Code, sortable: true, wrap: true },
        { name: <div>Airline <br/>Name</div>, selector: (row) => row.Name, sortable: true, wrap: true },
        {
            name: "",
            cell: (row) => (
                <button
                    onClick={() => openEditModal(row)}
                    className="btn btn-primary btn-sm"
                    disabled={editLoading} // Disable edit button while loading
                ><i className="fa fa-edit"></i>
                </button>
            ),
            center: true,
        },
        {
            name: "",
            cell: (row) => (
                <button
                    style={{ background: 'red'}}
                    onClick={() => deleteAirline(row.AirlineIndex)}
                    className="btn btn-danger btn-sm"
                ><i className="fa fa-remove"></i>

                </button>
            ),
            center: true,
        },
    ];

    return (
        <div>
            <PageTitle motherMenu="Control Panel" activeMenu="/Airline" pageContent="Airline" />

            {/* Create Modal */}
            <div className={`modal fade ${showCreateModal ? "show d-block" : "d-none"}`} tabIndex="-1"
                 aria-labelledby="createModalLabel" aria-hidden={!showCreateModal}
                 style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="createModalLabel">Update Airline</h5>
                            <button type="button" className="btn-close" onClick={closeCreateModal}
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmitCreate(onCreate)}>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="AirlineName">Airline Name<span className="text-danger">*</span></label>
                                        <input {...registerCreate("AirlineName")} id="AirlineName"
                                               className="form-control"/>
                                        {errorsCreate.AirlineName &&
                                            <p className="text-danger">{errorsCreate.AirlineName.message}</p>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="AirlineCode">Airline Code<span className="text-danger">*</span></label>
                                        <input {...registerCreate("AirlineCode")} id="AirlineCode"
                                               className="form-control"/>
                                        {errorsCreate.AirlineCode &&
                                            <p className="text-danger">{errorsCreate.AirlineCode.message}</p>}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary" disabled={editLoading}>
                                        {editLoading ? "Adding..." : "Add Airline"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            <div className={`modal fade ${showEditModal ? "show d-block" : "d-none"}`} tabIndex="-1"
                 aria-labelledby="editModalLabel" aria-hidden={!showEditModal}
                 style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Update Airline</h5>
                            <button type="button" className="btn-close" onClick={closeEditModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmitEdit(onEdit)}>
                                <input type="hidden" id="Airline_id" name="Airline_id"/>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="AirlineName">Airline Name<span className="text-danger">*</span></label>
                                        <input {...registerEdit("AirlineName")} id="AirlineName" name="AirlineName" className="form-control"/>
                                        {errorsEdit.AirlineName && <p className="text-danger">{errorsEdit.AirlineName.message}</p>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="AirlineCode">Airline Code<span className="text-danger">*</span></label>
                                        <input {...registerEdit("AirlineCode")} id="AirlineCode" name="AirlineCode" className="form-control"/>
                                        {errorsEdit.AirlineCode && <p className="text-danger">{errorsEdit.AirlineCode.message}</p>}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-2" disabled={editLoading}>
                                    {editLoading ? "Updating..." : "Update Airline"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Content */}
            <div className="card mb-4">
                <div className="card-body">
                    {/* Submit Button */}
                    <div className="col-12" style={{marginTop: '12px'}}>
                        <button id="add-btn" onClick={(() => onCreateModal())} type="submit" className="btn btn-primary"
                                disabled={addLoading}>
                            {addLoading ? 'Adding...' : 'Add Airline'}
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="row">
                        <div className="mb-3 offset-lg-9">
                            <input
                                type="text"
                                placeholder="Search ..."
                                className="form-control"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{width: '250px', height: '40px'}}
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
                            paginationTotalRows={filteredAirline.length} // Set total rows here
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

export default Airline;
