import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import DataTable from 'react-data-table-component';
import { Server_URL, adminAuthToken } from "../../../helpers/config.js";
import PageTitle from "../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";

// Validation schema using Yup
const schema = yup.object({
    supplier: yup.string().required("This is a required field."),
}).required();

function Supplier() {
    const [supplierTypes, setSupplierTypes] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [addLoading, setAddLoading] = useState(false);  // Loading state for add form
    const [editLoading, setEditLoading] = useState(false); // Loading state for edit form
    const [deleteLoading, setDeleteLoading] = useState(false); // Loading state for delete operation
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        fetchSupplierTypes();
    }, []);


    function onLogout() {
        dispatch(Logout(navigate));
    }


    async function fetchSupplierTypes() {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/supplier`;
            let response = await fetch(api, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                }
            });
            const responseData = await response.json();

            if(responseData.message === 'Session Expired' || responseData.message === 'Token Missing') {
                return onLogout()
            }
            if (responseData.responseCode === 2) {
                setSupplierTypes(responseData.data);
            } else {
                Swal.fire({ icon: responseData.error ? 'error' : 'warning', title: responseData.message });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
            });
        }
    }

    async function onCreate(data) {
        setAddLoading(true); // Start loading
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/supplier`;
            let response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if(responseData.message === 'Session Expired' || responseData.message === 'Token Missing') {
                return onLogout()
            }
            if (response.status === 200 && responseData.responseCode === 2) {
                Swal.fire({ icon: 'success', title: responseData.message });
                resetCreate();
                fetchSupplierTypes();
            } else {
                Swal.fire({ icon: 'warning', title: responseData.message });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
            });
        } finally {
            setAddLoading(false); // Stop loading
        }
    }

    async function onEdit(data) {
        setEditLoading(true); // Start loading
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/supplier`;
            let response = await fetch(api, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if(responseData.message === 'Session Expired' || responseData.message === 'Token Missing') {
                return onLogout()
            }
            if (response.status === 200 && responseData.responseCode === 2) {
                Swal.fire({ icon: 'success', title: responseData.message });
                resetEdit();
                closeEditModal();
                fetchSupplierTypes();
            } else {
                Swal.fire({ icon: 'warning', title: responseData.message });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
            });
        } finally {
            setEditLoading(false); // Stop loading
        }
    }

    function openEditModal(supplier) {
        setCurrentSupplier(supplier);
        setValueEdit("supplier", supplier.supplier);
        setValueEdit("supplier_id", supplier.id);
        setShowEditModal(true);
    }

    function closeEditModal() {
        setShowEditModal(false);
        setCurrentSupplier(null);
    }

    async function deleteSupplier(id) {
        setDeleteLoading(true); // Start loading
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                let dataLS = localStorage.getItem(adminAuthToken);
                if (dataLS) {
                    dataLS = JSON.parse(dataLS);
                }

                const api = `${Server_URL}admin/supplier/${id}`;
                let response = await fetch(api, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataLS.idToken}`
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
                });

                if (!responseData.error) {
                    fetchSupplierTypes();
                }
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
            });
        } finally {
            setDeleteLoading(false); // Stop loading
        }
    }

    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => index + 1,
            center: true,
        },
        {
            name: 'Supplier Name',
            selector: row => row.supplier,
            center: true,
        },
        {
            name: '',
            cell: (row) => (
                <button
                    onClick={() => openEditModal(row)}
                    style={{ background: 'blue', width: '90px', padding: '5px 5px' }}
                    className="btn btn-primary btn-sm"
                    disabled={editLoading || deleteLoading} // Disable while loading
                >
                    {editLoading && currentSupplier && currentSupplier.id === row.id ? 'Editing...' : 'Edit'}
                </button>
            ),
            center: true,
        },
        {
            name: '',
            cell: (row) => (
                <button
                    onClick={() => deleteSupplier(row.id)}
                    style={{ background: 'red', width: '90px', padding: '5px 5px' }}
                    className="btn btn-danger btn-sm"
                    disabled={deleteLoading || editLoading} // Disable while loading
                >
                    {deleteLoading && currentSupplier && currentSupplier.id === row.id ? 'Deleting...' : 'Delete'}
                </button>
            ),
            center: true,
        },
    ];

    const filteredSupplierTypes = supplierTypes.filter(supplier =>
        supplier.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <PageTitle motherMenu="Control Panel" activeMenu="Suppliers" pageContent="Suppliers" />

            {/* Edit Modal */}
            <div className={`modal fade ${showEditModal ? "show d-block" : "d-none"}`} tabIndex="-1"
                 aria-labelledby="editModalLabel" aria-hidden={!showEditModal}
                 style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Update Supplier</h5>
                            <button type="button" className="btn-close" onClick={closeEditModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmitEdit(onEdit)}>
                                <input type="hidden" id="supplier_id" name="supplier_id" />
                                <div className="mb-3">
                                    <label htmlFor="supplier">Supplier <span className="text-danger">*</span></label>
                                    <input
                                        {...registerEdit("supplier")}
                                        id="supplier"
                                        name="supplier"
                                        className="form-control"
                                    />
                                    {errorsEdit.supplier && <p className="text-danger">{errorsEdit.supplier.message}</p>}
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                                    {editLoading ? 'Updating...' : 'Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row">
                        <form onSubmit={handleSubmitCreate(onCreate)}>
                            <div className="table-responsive px-3">
                                <div className="row bg-light-subtle py-2 mb-3">
                                    <div className="text-center">
                                        <h2><b>Suppliers</b></h2>
                                        <div className="row">
                                            <div className="col-sm-4"></div>
                                            <div className="col-sm-4">
                                                <hr style={{ color: 'blue', border: '2px solid' }} />
                                            </div>
                                            <div className="col-sm-4"></div>
                                        </div>
                                    </div>

                                    {/* Supplier Name */}
                                    <div className="col-12" style={{ marginTop: '12px' }}>
                                        <span><b>Supplier</b></span>
                                        <input
                                            {...registerCreate("supplier")}
                                            className="form-control"
                                            placeholder="Enter Supplier Name"
                                            style={{ width: '400px' }}
                                        />
                                        {errorsCreate.supplier && <p className="text-danger">{errorsCreate.supplier.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-12" style={{ marginTop: '12px' }}>
                                        <button id="add-btn" type="submit" className="btn btn-primary" disabled={addLoading}>
                                            {addLoading ? 'Adding...' : 'Add Supplier'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Search Input */}
                    <div className="row">
                        <div className="mb-3 offset-lg-9">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Supplier"
                                value={searchQuery}
                                style={{ width: '250px', height: '40px' }}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Supplier Table */}
                    <DataTable
                        columns={columns}
                        data={filteredSupplierTypes}
                        noHeader
                        pagination
                    />
                </div>
            </div>
        </div>
    );
}

export default Supplier;
