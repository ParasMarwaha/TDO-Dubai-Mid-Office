import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {ErrorMessage} from "@hookform/error-message";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import {adminAuthToken, Server_URL} from "../../../helpers/config.js";
import PageTitle from "../../layouts/PageTitle.jsx";
import DataTable from "react-data-table-component";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";

// Validation schema using Yup
const schema = yup.object({
    RoleName: yup.string().required("This is a required field."),
    Description: yup.string().required("This is a required field."),
}).required();

function UserRole() {
    // Create form
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        reset: resetCreate,
        formState: {errors: errorsCreate},
    } = useForm({
        resolver: yupResolver(schema),
    });

    function onLogout() {
        dispatch(Logout(navigate));
    }
    // Edit form
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        setValue: setValueEdit,
        reset: resetEdit,
        formState: {errors: errorsEdit},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [userGroups, setUserGroups] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentGroupId, setCurrentGroupId] = useState(null);



    function openCreateModal() {
        resetCreate();
        setShowCreateModal(true);
    }

    function closeCreateModal() {
        setShowCreateModal(false);
    }

    function openEditModal(group) {
        setCurrentGroupId(group.id);
        setValueEdit("RoleName", group.name);
        setValueEdit("Description", group.description);
        setShowEditModal(true);
    }

    function closeEditModal() {
        setShowEditModal(false);
        setCurrentGroupId(null);
    }

    async function onCreate(data) {
        try {
            document.getElementById('btn-add').disabled = true;
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = Server_URL + 'admin/staff-roles';
            let response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify(data),
            });
            response = await response.json();

            if (response) {
                if(response.message === 'Session Expired' || response.message === 'Token Missing') {
                    return onLogout()
                }
                if (response.responseCode === 1) {
                    if (response.error) {
                        Swal.fire({ icon: 'error', title: response.message });
                    } else if (response.warning) {
                        Swal.fire({ icon: 'warning', title: response.message });
                    }
                } else if (response.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: response.message }).then(() => {
                        resetCreate();
                        closeCreateModal();
                        fetchUserGroups();
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occurred',
                    text: 'Unexpected response status'
                });
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message
            });
        }
        document.getElementById('btn-add').disabled = false;

    }

    async function onEdit(data) {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = Server_URL + `admin/staff-roles/${currentGroupId}`;
            let response = await fetch(api, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify(data),
            });
            response = await response.json();

            if(response.message === 'Session Expired' || response.message === 'Token Missing') {
                return onLogout()
            }
            if (response) {
                if (response.responseCode === 1) {
                    if (response.error) {
                        Swal.fire({ icon: 'error', title: response.message });
                    } else if (response.warning) {
                        Swal.fire({ icon: 'warning', title: response.message });
                    }
                } else if (response.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: response.message }).then(() => {
                        resetEdit();
                        closeEditModal();
                        fetchUserGroups();
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occurred',
                    text: 'Unexpected response status'
                });
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message
            });
        }
    }

    async function deleteGroup(id) {
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

                const api = Server_URL + `admin/staff-roles/${id}`;
                let response = await fetch(api, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataLS.idToken}`
                    },
                });
                response = await response.json();

                if(response.message === 'Session Expired' || response.message === 'Token Missing') {
                    return onLogout()
                }
                if (response) {
                    if (response.responseCode === 1) {
                        if (response.error) {
                            Swal.fire({ icon: 'error', title: response.message });
                        } else if (response.warning) {
                            Swal.fire({ icon: 'warning', title: response.message });
                        }
                    } else if (response.responseCode === 2) {
                        Swal.fire({ icon: 'success', title: 'Deleted!', text: response.message })
                            .then(() => {
                                fetchUserGroups(); // Refresh the user groups list after deletion
                            });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'An error occurred',
                        text: 'Unexpected response status'
                    });
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

    async function fetchUserGroups() {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = Server_URL + `admin/staff-roles`;
            let response = await fetch(api, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                }
            });
            response = await response.json();
            //console.log(response)
            if(response.message === 'Session Expired' || response.message === 'Token Missing') {
                return onLogout()
            }
            if (response) {
                if (response.responseCode === 1) {
                    if (response.error) {
                        Swal.fire({ icon: 'error', title: response.message });
                    } else if (response.warning) {
                        Swal.fire({ icon: 'warning', title: response.message });
                    }
                } else if (response.responseCode === 2) {
                    setUserGroups(response.data);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'An error occurred',
                    text: 'Unexpected response status'
                });
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message
            });
        }
    }

    useEffect(() => {
        fetchUserGroups().then();
    }, []);

    return (

        <div>
            <div>
                <PageTitle motherMenu="Roles" activeMenu="Roles " pageContent="Roles"/>

                <>
                    {/* Create Modal */}
                    <div className={`modal fade ${showCreateModal ? "show d-block" : "d-none"}`} tabIndex="-1"
                         aria-labelledby="createModalLabel" aria-hidden={!showCreateModal}
                         style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="createModalLabel">
                                        Add User Role
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeCreateModal}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form id="AddUserForm" onSubmit={handleSubmitCreate(onCreate)}>
                                        <div className="mb-3">
                                            <label htmlFor="RoleName">
                                                Role Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                {...registerCreate("RoleName")}
                                                type="text"
                                                id="RoleName"
                                                name="RoleName"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                errors={errorsCreate}
                                                name="RoleName"
                                                render={({message}) => (
                                                    <p className="text-danger">{message}</p>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Description">
                                                Description <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                {...registerCreate("Description")}
                                                type="text"
                                                id="Description"
                                                name="Description"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                errors={errorsCreate}
                                                name="Description"
                                                render={({message}) => (
                                                    <p className="text-danger">{message}</p>
                                                )}
                                            />
                                        </div>
                                        <button id="btn-add" className="btn btn-primary">Add</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Edit Modal */}
                    <div className={`modal fade ${showEditModal ? "show d-block" : "d-none"}`} tabIndex="-1"
                         aria-labelledby="editModalLabel" aria-hidden={!showEditModal}
                         style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editModalLabel">
                                        Edit Role
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={closeEditModal}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <form id="EditUserForm" onSubmit={handleSubmitEdit(onEdit)}>
                                        <div className="mb-3">
                                            <label htmlFor="RoleName">
                                                Role <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                {...registerEdit("RoleName")}
                                                type="text"
                                                id="RoleNameEdit"
                                                name="RoleName"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="RoleName"
                                                render={({message}) => (
                                                    <p className="text-danger">{message}</p>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="Description">
                                                Description <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                {...registerEdit("Description")}
                                                type="text"
                                                id="DescriptionEdit"
                                                name="Description"
                                                className="form-control"
                                            />
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="Description"
                                                render={({message}) => (
                                                    <p className="text-danger">{message}</p>
                                                )}
                                            />
                                        </div>
                                        <button className="btn btn-primary">Update</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}

                    <div className="card">
                        <div className="card-header card-header-bg">
                            <div className="col-lg-12">
                                <div className="row">
                                    <div className="col-8">
                                        <h4 className="mb-0 primary-color">Staff Role</h4>
                                    </div>
                                    <div className="col-4 text-end">
                                        <button type="button" onClick={openCreateModal} className="btn btn-primary btn-sm">
                                            Add Role <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th className="text-center">Sr No.</th>
                                        <th className="text-center">Name</th>
                                        <th className="text-center">Description</th>
                                        <th className="text-center">CreatedDate</th>
                                        <th className="text-center">CreatedBy</th>
                                        <th className="text-center">UpdatedDate</th>
                                        <th className="text-center">UpdatedBy</th>
                                        <th className="text-center"></th>
                                        <th className="text-center"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userGroups && userGroups.map((group, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{group.name}</td>
                                            <td className="text-center">{group.description}</td>
                                            <td className="text-center">{group.createdAt}</td>
                                            <td className="text-center">{group.createdBy}</td>
                                            <td className="text-center">{group.updatedAt}</td>
                                            <td className="text-center">{group.updatedBy}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary btn-sm mx-1"
                                                    onClick={() => openEditModal(group)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm mx-1"
                                                    onClick={() => deleteGroup(group.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>

            </div>
        </div>
    );
}

export default UserRole;
