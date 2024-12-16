// import {useForm} from "react-hook-form";
// import * as yup from "yup";
// import {yupResolver} from "@hookform/resolvers/yup";
// import {ErrorMessage} from "@hookform/error-message";
// import React, {useEffect, useState} from "react";
// import Swal from "sweetalert2";
// import {adminAuthToken, Server_URL} from "../../../helpers/config.js";
// import PageTitle from "../../layouts/PageTitle.jsx";

// // Validation schema using Yup
// const schema = yup.object({
//     GroupName: yup.string().required("This is a required field."),
//     Description: yup.string().required("This is a required field."),
// }).required();

// function UserGroup() {
//     // Create form
//     const {
//         register: registerCreate,
//         handleSubmit: handleSubmitCreate,
//         reset: resetCreate,
//         formState: {errors: errorsCreate},
//     } = useForm({
//         resolver: yupResolver(schema),
//     });

//     // Edit form
//     const {
//         register: registerEdit,
//         handleSubmit: handleSubmitEdit,
//         setValue: setValueEdit,
//         reset: resetEdit,
//         formState: {errors: errorsEdit},
//     } = useForm({
//         resolver: yupResolver(schema),
//     });
//
//     const [userGroups, setUserGroups] = useState([]);
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [currentGroupId, setCurrentGroupId] = useState(null);
//
//     function openCreateModal() {
//         resetCreate();
//         setShowCreateModal(true);
//     }
//
//     function closeCreateModal() {
//         setShowCreateModal(false);
//     }
//
//     function openEditModal(group) {
//         setCurrentGroupId(group.id);
//         setValueEdit("GroupName", group.name);
//         setValueEdit("Description", group.description);
//         setShowEditModal(true);
//     }
//
//     function closeEditModal() {
//         setShowEditModal(false);
//         setCurrentGroupId(null);
//     }
//
//     function handleResponse(response, onSuccess = () => {}) {
//         Swal.fire({
//             icon: response.error ? "error" : response.warning ? "warning" : "success",
//             title: response.message,
//             showConfirmButton: true,
//             timer: 3000,
//         }).then(() => {
//             if (!response.error && !response.warning) {
//                 onSuccess();
//             }
//         });
//     }

//     async function onCreate(data) {
//         try {
//             let dataLS = localStorage.getItem(adminAuthToken);
//             if (dataLS) dataLS = JSON.parse(dataLS);
//
//             const api = Server_URL + `admin/user-group`;
//
//             let response = await fetch(api, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${dataLS.idToken}`
//                 },
//                 body: JSON.stringify(data),
//             });
//             response = await response.json();
//
//             handleResponse(response, () => {
//                 resetCreate();
//                 closeCreateModal();
//                 fetchUserGroups();
//             });
//         } catch (e) {
//             Swal.fire({
//                 icon: "error",
//                 title: "An error occurred",
//                 text: e.message,
//                 showConfirmButton: true,
//                 timer: 3000,
//             });
//         }
//     }

//     async function onEdit(data) {
//         try {
//             let dataLS = localStorage.getItem(adminAuthToken);
//             if (dataLS) dataLS = JSON.parse(dataLS);
//
//             const api = Server_URL + `admin/user-group/${currentGroupId}`;
//             let response = await fetch(api, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${dataLS.idToken}`
//                 },
//                 body: JSON.stringify(data),
//             });
//             response = await response.json();
//
//             handleResponse(response, () => {
//                 resetEdit();
//                 closeEditModal();
//                 fetchUserGroups();
//             });
//         } catch (e) {
//             Swal.fire({
//                 icon: "error",
//                 title: "An error occurred",
//                 text: e.message,
//                 showConfirmButton: true,
//                 timer: 3000,
//             });
//         }
//     }

//     async function deleteGroup(id) {
//         try {
//             const result = await Swal.fire({
//                 title: 'Are you sure?',
//                 text: "You won't be able to revert this!",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'Yes, delete it!',
//                 cancelButtonText: 'Cancel'
//             });
//
//             if (result.isConfirmed) {
//                 let dataLS = localStorage.getItem(adminAuthToken);
//                 if (dataLS) dataLS = JSON.parse(dataLS);
//
//                 const api = Server_URL + `admin/user-group/${id}`;
//                 let response = await fetch(api, {
//                     method: "DELETE",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${dataLS.idToken}`
//                     },
//                 });
//                 response = await response.json();
//
//                 handleResponse(response, () => {
//                     fetchUserGroups();
//                 });
//             }
//         } catch (e) {
//             Swal.fire({
//                 icon: "error",
//                 title: "An error occurred",
//                 text: e.message,
//                 showConfirmButton: true,
//                 timer: 3000,
//             });
//         }
//     }
//


//     async function fetchUserGroups() {
//         try {
//             let dataLS = localStorage.getItem(adminAuthToken);
//             if (dataLS) dataLS = JSON.parse(dataLS);
//
//             const api = Server_URL + `admin/user-group`;
//             let response = await fetch(api, {
//                 method: 'GET',
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${dataLS.idToken}`
//                 },
//             });
//             let result = await response.json();
//
//             handleResponse(result, () => {
//                 setUserGroups(result.data);
//             });
//         } catch (e) {
//             Swal.fire({
//                 icon: "error",
//                 title: "An error occurred",
//                 text: e.message,
//                 showConfirmButton: true,
//                 timer: 3000,
//             });
//         }
//     }
//
//
//     useEffect(() => {
//         fetchUserGroups().then();
//     }, []);
//
//     return (
//         <div>
//             <div>
//                 <PageTitle motherMenu="User Group" activeMenu="User Group" pageContent="User Group"/>

//                 {/* Create Modal */}
//                 <div
//                     className={`modal fade ${showCreateModal ? "show d-block" : "d-none"}`}
//                     tabIndex="-1"
//                     aria-labelledby="createModalLabel"
//                     aria-hidden={!showCreateModal}
//                     style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
//                 >
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title" id="createModalLabel">
//                                     Create User Group
//                                 </h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={closeCreateModal}
//                                     aria-label="Close"
//                                 ></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form id="AddUserForm" onSubmit={handleSubmitCreate(onCreate)}>
//                                     <div className="mb-3">
//                                         <label htmlFor="GroupName">
//                                             Group Name <span className="text-danger">*</span>
//                                         </label>
//                                         <input
//                                             {...registerCreate("GroupName")}
//                                             type="text"
//                                             id="GroupName"
//                                             name="GroupName"
//                                             className="form-control"
//                                         />
//                                         <ErrorMessage
//                                             errors={errorsCreate}
//                                             name="GroupName"
//                                             render={({message}) => (
//                                                 <p className="text-danger">{message}</p>
//                                             )}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="Description">
//                                             Description <span className="text-danger">*</span>
//                                         </label>
//                                         <input
//                                             {...registerCreate("Description")}
//                                             type="text"
//                                             id="Description"
//                                             name="Description"
//                                             className="form-control"
//                                         />
//                                         <ErrorMessage
//                                             errors={errorsCreate}
//                                             name="Description"
//                                             render={({message}) => (
//                                                 <p className="text-danger">{message}</p>
//                                             )}
//                                         />
//                                     </div>
//                                     <button className="btn btn-primary">Create</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Edit Modal */}
//                 <div
//                     className={`modal fade ${showEditModal ? "show d-block" : "d-none"}`}
//                     tabIndex="-1"
//                     aria-labelledby="editModalLabel"
//                     aria-hidden={!showEditModal}
//                     style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}
//                 >
//                     <div className="modal-dialog modal-dialog-centered">
//                         <div className="modal-content">
//                             <div className="modal-header">
//                                 <h5 className="modal-title" id="editModalLabel">
//                                     Edit User Group
//                                 </h5>
//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     onClick={closeEditModal}
//                                     aria-label="Close"
//                                 ></button>
//                             </div>
//                             <div className="modal-body">
//                                 <form id="EditUserForm" onSubmit={handleSubmitEdit(onEdit)}>
//                                     <div className="mb-3">
//                                         <label htmlFor="GroupName">
//                                             Group Name <span className="text-danger">*</span>
//                                         </label>
//                                         <input
//                                             {...registerEdit("GroupName")}
//                                             type="text"
//                                             id="GroupNameEdit"
//                                             name="GroupName"
//                                             className="form-control"
//                                         />
//                                         <ErrorMessage
//                                             errors={errorsEdit}
//                                             name="GroupName"
//                                             render={({message}) => (
//                                                 <p className="text-danger">{message}</p>
//                                             )}
//                                         />
//                                     </div>
//                                     <div className="mb-3">
//                                         <label htmlFor="Description">
//                                             Description <span className="text-danger">*</span>
//                                         </label>
//                                         <input
//                                             {...registerEdit("Description")}
//                                             type="text"
//                                             id="DescriptionEdit"
//                                             name="Description"
//                                             className="form-control"
//                                         />
//                                         <ErrorMessage
//                                             errors={errorsEdit}
//                                             name="Description"
//                                             render={({message}) => (
//                                                 <p className="text-danger">{message}</p>
//                                             )}
//                                         />
//                                     </div>
//                                     <button className="btn btn-primary">Update</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Main Content */}
//                 <div className="container-lg">
//                     <div className="card">
//                         <div className="card-header card-header-bg">
//                             <div className="col-lg-12">
//                                 <div className="row">
//                                     <div className="col-8">
//                                         <h4 className="mb-0 primary-color">User Group</h4>
//                                     </div>
//                                     <div className="col-4 text-end">
//                                         <button
//                                             type="button"
//                                             onClick={openCreateModal}
//                                             className="btn btn-primary btn-sm"
//                                         >
//                                             Add User Group <i className="fa fa-plus"></i>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         <div className="card-body">
//                             <div className="table-responsive">
//                                 <table className="table table-bordered">
//                                     <thead>
//                                     <tr>
//                                         <th className="text-center">Sr No.</th>
//                                         <th className="text-center">Group Name</th>
//                                         <th className="text-center">Description</th>
//                                         <th className="text-center">CreatedDate</th>
//                                         <th className="text-center">CreatedBy</th>
//                                         <th className="text-center">UpdatedDate</th>
//                                         <th className="text-center">UpdatedBy</th>
//                                         <th className="text-center"></th>
//                                         <th className="text-center"></th>
//                                     </tr>
//                                     </thead>
//                                     <tbody>
//                                     {userGroups.map((group, index) => (
//                                         <tr key={index}>
//                                             <td className="text-center">{index + 1}</td>
//                                             <td className="text-center">{group.name}</td>
//                                             <td className="text-center">{group.description}</td>
//                                             <td className="text-center">{group.createdDate}</td>
//                                             <td className="text-center">{group.createdBy}</td>
//                                             <td className="text-center">{group.updatedDate}</td>
//                                             <td className="text-center">{group.updatedBy}</td>
//                                             <td>
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-primary btn-sm mx-1"
//                                                     onClick={() => openEditModal(group)}
//                                                 >
//                                                     Edit
//                                                 </button>
//                                             </td>
//                                             <td>
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-danger btn-sm mx-1"
//                                                     onClick={() => deleteGroup(group.id)}
//                                                 >
//                                                     Delete
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default UserGroup;



import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { Server_URL, adminAuthToken, customStyles } from '../../../helpers/config.js';
import PageTitle from "../../layouts/PageTitle.jsx";
import DataTable from 'react-data-table-component';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
// Validation schema using Yup
const schema = yup.object({
    GroupName: yup.string().required("This is a required field."),
    Description: yup.string().required("This is a required field."),
}).required();

function UserGroup() {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState({ type: '', visible: false });
    const [currentGroupId, setCurrentGroupId] = useState(null);

    // Fetch User Groups
    async function fetchUserGroups() {
        setLoading(true);
        try {
            const dataLS = localStorage.getItem(adminAuthToken);
            if (!dataLS) {
                throw new Error('No authentication token found.');
            }
            const parsedData = JSON.parse(dataLS);
            const response = await fetch(`${Server_URL}admin/user-group`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${parsedData.idToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            if (result.responseCode === 2) {
                setUserGroups(result.data);
            } else {
                Swal.fire({ icon: 'error', title: result.message });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'An error occurred', text: error.message });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserGroups();
    }, []);

    // Columns for DataTable
    const columns = useMemo(() => [
        {
            name: "",
            button: true,
            cell: row => (
                <i
                    style={{ cursor: 'pointer' }}
                    onClick={() => deleteGroup(row?.id)}
                    className="fa fa-trash icon-size text-primary"
                ></i>
            ),
            width: '50px',
        },
        {
            name: "",
            button: true,
            cell: row => (
                <i
                    onClick={() => openModal('edit', row)}
                    className="fa fa-edit icon-size text-primary">
                </i>
            ),
            width: '50px',
        },
        {
            name: "Group Name",
            selector: row => row?.name,
            sortable: true,
            minWidth: '150px',
            wrap: true
        },
        {
            name: "Description",
            selector: row => row?.description,
            sortable: true,
            minWidth: '150px',
            wrap: true
        },
        {
            name: "Created Date",
            selector: row => row?.createdDate,
            sortable: true,
            minWidth: '150px',
            wrap: true
        },
        {
            name: "Created By",
            selector: row => row?.createdBy,
            sortable: true,
            minWidth: '150px',
            wrap: true
        },
        {
            name: "Updated Date",
            selector: row => row?.updatedDate,
            sortable: true,
            minWidth: '150px',
            wrap: true
        },
        {
            name: "Updated By",
            selector: row => row?.updatedBy,
            sortable: true,
            minWidth: '150px',
            wrap: true
        },
    ], []);

// Filtered groups based on search term across all columns
    const filteredGroups = useMemo(() => {
        return userGroups.filter(group => {
            const search = searchTerm.toLowerCase();

            // Check all column data for a match
            return (
                (group?.name || '').toLowerCase().includes(search) ||
                (group?.description || '').toLowerCase().includes(search) ||
                (group?.createdDate || '').toLowerCase().includes(search) ||
                (group?.createdBy || '').toLowerCase().includes(search) ||
                (group?.updatedDate || '').toLowerCase().includes(search) ||
                (group?.updatedBy || '').toLowerCase().includes(search)
            );
        });
    }, [searchTerm, userGroups]);


    // Modal control for create and edit
    function openModal(type, group = null) {
        if (group) {
            setCurrentGroupId(group.id);
            setValue("GroupName", group.name);
            setValue("Description", group.description);
        }
        setShowModal({ type, visible: true });
    }

    function closeModal() {
        setShowModal({ type: '', visible: false });
        setCurrentGroupId(null);
    }

    // Delete Group
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

                const api = Server_URL + `admin/user-group/${id}`;
                const response = await fetch(api, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataLS.idToken}`
                    },
                });
                const res = await response.json();

                if (res.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: 'Deleted!', text: res.message })
                        .then(() => {
                            fetchUserGroups(); // Refresh user groups list
                        });
                } else {
                    Swal.fire({ icon: 'error', title: res.message });
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

    // Edit Group
    async function onSubmitEdit(data) {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) dataLS = JSON.parse(dataLS);

            const api = Server_URL + `admin/user-group/${currentGroupId}`;
            const response = await fetch(api, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify(data),
            });
            const res = await response.json();

            if (res.responseCode === 2) {

                Swal.fire({ icon: 'success', title: res.message }).then(()=>{
                        reset();
                        closeModal();
                        fetchUserGroups();
                }
                );
            } else {
                Swal.fire({ icon: 'error', title: res.message });
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

    const handleSearch = (value => {
        setSearchTerm(value);
    });

    return (
        <div>
            <PageTitle motherMenu="Control Panel" activeMenu="User Groups" pageContent="User Groups" />
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="text-center"><b>User Groups</b></h2>
                    <hr />
                    <div className="bg-light-subtle py-2 mb-3">
                        <button onClick={() => openModal('create')} type="button" className="btn btn-primary">+ Create New</button>
                    </div>

                    <div className="mb-3 offset-lg-9">
                        <input
                            type="text"
                            placeholder="Filter Data Table"
                            className="form-control"
                            value={searchTerm}
                            onChange={e => handleSearch(e.target.value)}
                            style={{width: '250px', height: '40px'}}
                            disabled={loading}
                        />

                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredGroups}
                        progressPending={loading}
                        highlightOnHover
                        pagination
                        style={customStyles}
                    />
                </div>
            </div>

            {/* Modal for Create/Edit User Group */}
            <div className={`modal fade ${showModal.visible ? "show d-block" : "d-none"}`} tabIndex="-1" aria-hidden={!showModal.visible}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{showModal.type === 'edit' ? 'Edit' : 'Create'} User Group</h5>
                            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(showModal.type === 'edit' ? onSubmitEdit : () => {})}>
                                <div className="mb-3">
                                    <label htmlFor="GroupName">Group Name <span className="text-danger">*</span></label>
                                    <input
                                        {...register("GroupName")}
                                        type="text"
                                        id="GroupName"
                                        className="form-control"
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="GroupName"
                                        render={({ message }) => <p className="text-danger">{message}</p>}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Description">Description <span className="text-danger">*</span></label>
                                    <input
                                        {...register("Description")}
                                        type="text"
                                        id="Description"
                                        className="form-control"
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="Description"
                                        render={({ message }) => <p className="text-danger">{message}</p>}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">{showModal.type === 'edit' ? 'Save Changes' : 'Create'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserGroup;
