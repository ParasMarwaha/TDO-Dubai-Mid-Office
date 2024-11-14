import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Server_URL, adminAuthToken } from '../../../../helpers/config.js';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PageTitle from "../../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {Logout} from "../../../../store/actions/AuthActions.js";

// Define validation schema with yup
const schema = yup.object().shape({
    plan_name: yup.string().required('Plan Name is required'),
    type: yup.string().required('Type is required'),
    MarkupValue: yup.number().typeError('Markup Value must be a number').required('Markup Value is required'),
    suppliers: yup.array().min(1, 'At least one Supplier must be selected').required('At least one Supplier must be selected'),
    fareTypes: yup.array().min(1, 'At least one Fare Type must be selected').required('At least one Fare Type must be selected'),
    carriers: yup.array().min(1, 'At least one Carrier must be selected').required('At least one Carrier must be selected'),
    cancellation: yup.number().typeError('Cancellation Charges must be a number').required('Cancellation Charges are required'),
    rescheduling: yup.number().typeError('Rescheduling Charges must be a number').required('Rescheduling Charges are required')
});

function AddFlightMarkups() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [fareTypes, setFareTypes] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [carriers, setCarriers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Custom styles for react-select to make the dropdown scrollable
    const customStyles = {
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999, // Ensures the dropdown is above other elements
        })
    };

    // Setup react-hook-form with yup resolver
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            plan_name: '',
            type: '',
            MarkupValue: 0,
            suppliers: [],
            fareTypes: [],
            carriers: [],
            cancellation: 0,
            rescheduling: 0
        }
    });


    function onLogout() {
        dispatch(Logout(navigate));
    }

    // Fetch data for fare types and suppliers
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                let dataLS = localStorage.getItem(adminAuthToken);
                if (dataLS) {
                    dataLS = JSON.parse(dataLS);
                }

                // Fetch fare types
                const fareTypesApi = `${Server_URL}admin/fare-types`;
                let response = await fetch(fareTypesApi, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataLS.idToken}`
                    }
                });
                const fareTypesData = await response.json();
                if(fareTypesData.message === 'Session Expired' || fareTypesData.message === 'Token Missing') {
                    return onLogout()
                }
                if (fareTypesData.responseCode === 2) {
                    setFareTypes(fareTypesData.data);
                } else {
                    Swal.fire({ icon: 'error', title: fareTypesData.message });
                }

                // Fetch suppliers
                const suppliersApi = `${Server_URL}admin/supplier`;
                response = await fetch(suppliersApi, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataLS.idToken}`
                    }
                });
                const suppliersData = await response.json();

                if(suppliersData.message === 'Session Expired' || suppliersData.message === 'Token Missing') {
                    return onLogout()
                }
                if (suppliersData.responseCode === 2) {
                    setSuppliers(suppliersData.data);
                } else {
                    Swal.fire({ icon: 'error', title: suppliersData.message });
                }
                // Fetch carriers
                const carriersApi = `${Server_URL}admin/carriers`;
                response = await fetch(carriersApi, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dataLS.idToken}`
                    }
                });
                const carriersData = await response.json();
                if(carriersData.message === 'Session Expired' || carriersData.message === 'Token Missing') {
                    return onLogout()
                }
                if (carriersData.responseCode === 2) {
                    setCarriers(carriersData.data);
                } else {
                    Swal.fire({ icon: 'error', title: carriersData.message });
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
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const fareTypeOptions = [
        { value: 'all', label: 'All' },
        ...fareTypes.map(type => ({ value: type.id, label: type.fare }))
    ];
    const supplierOptions = [
        { value: 'all', label: 'All' },
        ...suppliers.map(supplier => ({ value: supplier.id, label: supplier.supplier }))
    ];
    const carrierOptions = [
        { value: 'all', label: 'All' },
        ...carriers.map(carrier => ({ value: carrier.AirlineIndex, label: carrier.Name }))
    ];

    const onSubmit = async (data) => {
        setSubmitting(true);
        const markupData = {
            plan_name: data.plan_name,
            type: data.type,
            MarkupValue: data.MarkupValue,
            suppliers: data.suppliers.some(option => option.value === 'all') ? ['all'] : data.suppliers.map(option => option.value),
            fareTypes: data.fareTypes.some(option => option.value === 'all') ? ['all'] : data.fareTypes.map(option => option.value),
            carriers: data.carriers.some(option => option.value === 'all') ? ['all'] : data.carriers.map(option => option.value),
            cancellation: data.cancellation,
            rescheduling: data.rescheduling
        };

        try {
            const response = await fetch(`${Server_URL}admin/add-flight-markup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem(adminAuthToken)).idToken}`
                },
                body: JSON.stringify(markupData)
            });
            const result = await response.json();

            if(result.message === 'Session Expired' || result.message === 'Token Missing') {
                return onLogout()
            }
            if (result.responseCode === 2) {
                Swal.fire({ icon: 'success', title: 'Markup added successfully!' }).then(() => {
                    reset();
                });
            } else {
                Swal.fire({ icon: 'error', title: result.message });
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'An error occurred', text: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div>
                <PageTitle motherMenu="Control Panel" activeMenu="Fights/ Add Markups"
                           pageContent="Fights/ Add Markups"/>

                <div className="mb-4 shadow">
                    <div className="card-body"> {/* Removed the "card" class */}
                        {loading ? <p>Loading...</p> : (
                            <div className="row">
                                <form id="Markup-form" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="table-responsive px-3">
                                        <div className="row bg-light-subtle py-2 mb-3">
                                            <div className="text-center">
                                                <h2><b>Add New Markup</b></h2>
                                                <div className="row">
                                                    <div className="col-sm-4"></div>
                                                    <div className="col-sm-4">
                                                        <hr style={{color: 'blue', border: '2px solid'}}/>
                                                    </div>
                                                    <div className="col-sm-4"></div>
                                                </div>
                                            </div>
                                            <br/><br/><br/><br/>
                                            <div className="col-6 col-md-4">
                                                <span><b>Plan Name</b></span>
                                                <Controller
                                                    name="plan_name"
                                                    control={control}
                                                    render={({field}) => (
                                                        <input {...field} type="text" className="form-control"/>
                                                    )}
                                                />
                                                {errors.plan_name &&
                                                    <p className="text-danger">{errors.plan_name.message}</p>}
                                            </div>
                                            <div className="col-6 col-md-4">
                                                <span><b>Type</b></span>
                                                <Controller
                                                    name="type"
                                                    control={control}
                                                    render={({field}) => (
                                                        <select {...field} className="form-control">
                                                            <option value="">Choose Markup Type</option>
                                                            <option value="Fixed">Fixed</option>
                                                            <option value="Percentage">Percentage</option>
                                                        </select>
                                                    )}
                                                />
                                                {errors.type && <p className="text-danger">{errors.type.message}</p>}
                                            </div>
                                            <div className="col-6 col-md-4">
                                                <span><b>Markup Value</b></span>
                                                <Controller
                                                    name="MarkupValue"
                                                    control={control}
                                                    render={({field}) => (
                                                        <input {...field} type="number" pattern="[0-9]{1,9}"
                                                               className="form-control"/>
                                                    )}
                                                />
                                                {errors.MarkupValue &&
                                                    <p className="text-danger">{errors.MarkupValue.message}</p>}
                                            </div>
                                            <div className="col-6 col-md-4" style={{marginTop: '12px'}}>
                                                <span><b>Supplier List</b></span>
                                                <Controller
                                                    name="suppliers"
                                                    control={control}
                                                    render={({field}) => (
                                                        <Select
                                                            {...field}
                                                            isMulti
                                                            options={supplierOptions}
                                                            placeholder="Select Supplier..."
                                                            isSearchable
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            menuPortalTarget={document.body}
                                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                        />
                                                    )}
                                                />
                                                {errors.suppliers &&
                                                    <p className="text-danger">{errors.suppliers.message}</p>}
                                            </div>
                                            <div className="col-6 col-md-4" style={{marginTop: '12px'}}>
                                                <span><b>Fare Types</b></span>
                                                <Controller
                                                    name="fareTypes"
                                                    control={control}
                                                    render={({field}) => (
                                                        <Select
                                                            {...field}
                                                            isMulti
                                                            options={fareTypeOptions}
                                                            placeholder="Select Fare Types..."
                                                            isSearchable
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            menuPortalTarget={document.body}
                                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                        />
                                                    )}
                                                />
                                                {errors.fareTypes &&
                                                    <p className="text-danger">{errors.fareTypes.message}</p>}
                                            </div>
                                            <div className="col-6 col-md-4" style={{marginTop: '12px'}}>
                                                <span><b>Carrier List</b></span>
                                                <Controller
                                                    name="carriers"
                                                    control={control}
                                                    render={({field}) => (
                                                        <Select
                                                            {...field}
                                                            isMulti
                                                            options={carrierOptions}
                                                            placeholder="Select Carriers..."
                                                            isSearchable
                                                            className="react-select-container"
                                                            classNamePrefix="react-select"
                                                            menuPortalTarget={document.body}
                                                            styles={customStyles}
                                                        />
                                                    )}
                                                />
                                                {errors.carriers &&
                                                    <p className="text-danger">{errors.carriers.message}</p>}
                                            </div>
                                            <div className="col-6 col-md-4" style={{marginTop: '12px'}}>
                                                <span><b>Cancellation Charges</b></span>
                                                <Controller
                                                    name="cancellation"
                                                    control={control}
                                                    render={({field}) => (
                                                        <input {...field} type="number" className="form-control"/>
                                                    )}
                                                />
                                                {errors.cancellation &&
                                                    <p className="text-danger">{errors.cancellation.message}</p>}
                                            </div>
                                            <div className="col-6 col-md-4" style={{marginTop: '12px'}}>
                                                <span><b>Rescheduling Charges</b></span>
                                                <Controller
                                                    name="rescheduling"
                                                    control={control}
                                                    render={({field}) => (
                                                        <input {...field} type="number" className="form-control"/>
                                                    )}
                                                />
                                                {errors.rescheduling &&
                                                    <p className="text-danger">{errors.rescheduling.message}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{marginTop: '12px'}}>
                                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                                            {submitting ? 'Submitting...' : 'Add New Markup'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>

    );
}

export default AddFlightMarkups;
