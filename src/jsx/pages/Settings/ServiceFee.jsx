import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { Server_URL, adminAuthToken } from "../../../helpers/config.js";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";

// Validation schema using Yup
const schema = yup.object({
    product: yup.string().required("This is a required field."),
    platformFee: yup.number().required("This is a required field.").min(0, "Must be a positive number."),
    tax: yup.number().required("This is a required field.").min(0).max(100, "Must be between 0 and 100."),
}).required();

function ServiceFee() {
    const [serviceFees, setServiceFees] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentFee, setCurrentFee] = useState(null);
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
        fetchServiceFees();
    }, []);

    function onLogout() {
        dispatch(Logout(navigate));
    }

    async function fetchServiceFees() {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/service-fees/`;
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
            if (response) {
                if (responseData.responseCode === 1 && responseData.error) {
                    Swal.fire({ icon: 'error', title: responseData.message });
                } else if (responseData.responseCode === 1 && responseData.warning) {
                    Swal.fire({ icon: 'warning', title: responseData.message });
                } else if (responseData.responseCode === 2) {
                    setServiceFees(responseData.data);
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

    async function onCreate(data) {
        setLoading(true)
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/service-fees`;
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
            if (response.status === 200) {
                if (responseData.responseCode === 1 && responseData.error) {
                    Swal.fire({ icon: 'error', title: responseData.message }).then(()=>{
                        setLoading(false)
                    })
                } else if (responseData.responseCode === 1 && responseData.warning) {
                    Swal.fire({ icon: 'warning', title: responseData.message }).then(()=>{
                        resetCreate();
                        setLoading(false)
                    });
                } else if (responseData.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: responseData.message });
                    resetCreate();
                    setLoading(false)
                    fetchServiceFees();
                }
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            }).then(()=>{setLoading(false)})
        }
    }

    async function onEdit(data) {
        setLoading(true)
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = Server_URL + 'admin/service-fees' ;
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
            if (response.status === 200) {
                if (responseData.responseCode === 1 && responseData.error) {
                    Swal.fire({ icon: 'error', title: responseData.message });
                } else if (responseData.responseCode === 1 && responseData.warning) {
                    Swal.fire({ icon: 'warning', title: responseData.message });
                } else if (responseData.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: responseData.message });
                    resetEdit();
                    closeEditModal();
                    fetchServiceFees();
                }
                setLoading(false)
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
            setLoading(false)
        }
    }

    function openEditModal(fee) {
        setCurrentFee(fee);
        setValueEdit("product", fee.product);
        setValueEdit("platformFee", fee.fees);
        setValueEdit("tax", fee.tax);
        setValueEdit("product_id", fee.id);
        setShowEditModal(true);
    }

    function closeEditModal() {
        setShowEditModal(false);
        setCurrentFee(null);
    }

    return (
        <div>
            <div>
                <PageTitle motherMenu="Control Panel" activeMenu="/service-fee" pageContent="Platform Fees"/>

                <>
                    {/* Edit Modal */}
                    <div className={`modal fade ${showEditModal ? "show d-block" : "d-none"}`} tabIndex="-1"
                         aria-labelledby="editModalLabel" aria-hidden={!showEditModal}
                         style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editModalLabel">Update Platform Fee</h5>
                                    <button type="button" className="btn-close" onClick={closeEditModal} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmitEdit(onEdit)}>
                                        <div className="mb-3">
                                            <label htmlFor="product">Product <span className="text-danger">*</span></label>
                                            <input type="hidden" id="product_id" name="product_id" />
                                            <input
                                                {...registerEdit("product")}
                                                id="product"
                                                name="product"
                                                className="form-control"
                                                disabled
                                            >

                                            </input>
                                            {errorsEdit.product && <p className="text-danger">{errorsEdit.product.message}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="platformFee">Platform Fees (In Aed) <span className="text-danger">*</span></label>
                                            <input
                                                {...registerEdit("platformFee")}
                                                type="number"
                                                id="platformFee"
                                                name="platformFee"
                                                className="form-control"
                                            />
                                            {errorsEdit.platformFee && <p className="text-danger">{errorsEdit.platformFee.message}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="tax">TAX (In %) <span className="text-danger">*</span></label>
                                            <input
                                                {...registerEdit("tax")}
                                                type="number"
                                                id="tax"
                                                name="tax"
                                                className="form-control"
                                            />
                                            {errorsEdit.tax && <p className="text-danger">{errorsEdit.tax.message}</p>}
                                        </div>
                                        <button disabled={loading} type="submit" className="btn btn-primary">{loading?'Updating...':'Update'}</button>
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
                                                <h2><b>Platform Fees</b></h2>
                                                <div className="row">
                                                    <div className="col-sm-4"></div>
                                                    <div className="col-sm-4">
                                                        <hr style={{ color: 'blue', border: '2px solid' }} />
                                                    </div>
                                                    <div className="col-sm-4"></div>
                                                </div>
                                            </div>

                                            {/* Products */}
                                            <div className="col-6 col-md-4" style={{ marginTop: '12px' }}>
                                                <span><b>Products</b></span>
                                                <select
                                                    {...registerCreate("product")}
                                                    className="form-control"
                                                >
                                                    <option value="">Choose Product</option>
                                                    <option value="Flights">Flights</option>
                                                    <option value="Insurance">Insurance</option>
                                                    <option value="Hotels">Hotels</option>
                                                </select>
                                                {errorsCreate.product && <p className="text-danger">{errorsCreate.product.message}</p>}
                                            </div>

                                            {/* Platform Fees */}
                                            <div className="col-6 col-md-4" style={{ marginTop: '12px' }}>
                                                <span><b>Platform Fees (In Aed)</b></span>
                                                <input
                                                    {...registerCreate("platformFee")}
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Platform Fee"
                                                    defaultValue="0"
                                                />
                                                {errorsCreate.platformFee && <p className="text-danger">{errorsCreate.platformFee.message}</p>}
                                            </div>

                                            {/* TAX */}
                                            <div className="col-6 col-md-4" style={{ marginTop: '12px' }}>
                                                <span><b>TAX (In %)</b></span>
                                                <input
                                                    {...registerCreate("tax")}
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Tax"
                                                    defaultValue="0"
                                                />
                                                {errorsCreate.tax && <p className="text-danger">{errorsCreate.tax.message}</p>}
                                            </div>

                                            {/* Submit Button */}
                                            <div className="col-12" style={{ marginTop: '12px' }}>
                                                <button disabled={loading} id="add-btn" type="submit" className="btn btn-primary">{loading?'Adding...' : 'Add Information'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                {/* Service Fee Table */}
                                <div className="table-responsive mt-4">
                                    <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th className="text-center">Sr No.</th>
                                            <th className="text-center">Product</th>
                                            <th className="text-center">Platform Fees (Aed)</th>
                                            <th className="text-center">Tax (%)</th>
                                            <th className="text-center"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {serviceFees.map((fee,index) => (
                                            <tr key={fee.id}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{fee.product}</td>
                                                <td className="text-center">{fee.fees}</td>
                                                <td className="text-center">{fee.tax}</td>
                                                <td className="text-center"><button onClick={() => openEditModal(fee)} className="btn btn-primary btn-sm">Edit</button></td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>

            </div>
        </div>
    );
}

export default ServiceFee;
