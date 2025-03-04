import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import Swal from "sweetalert2";
import { adminAuthToken, Server_URL } from "../../../../helpers/config.js";
import PageTitle from "../../../layouts/PageTitle.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../../store/actions/AuthActions.js";

const schema = yup.object({
    role: yup.string().required('This is a required field.'),
    firstName: yup.string().required('This is a required field.'),
    lastName: yup.string().required('This is a required field.'),
    email: yup.string().email('Enter a valid email').required('This is a required field.'),
    mobile: yup.string()
        .required('This is a required field.')
        .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits'), // Regex for 10 digit numbers
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
        .matches(/[a-z]/, 'Password must include at least one lowercase letter')
        .matches(/[0-9]/, 'Password must include at least one number')
        .matches(/[@$!%*?&]/, 'Password must include at least one special character')
        .matches(/^[A-Za-z0-9@$!%*?&]+$/, 'Password can only contain alphanumeric and special characters'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('This is a required field.'),
}).required();

function CreateUser() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: yupResolver(schema) });
    const [role, setRole] = useState([]);
    const [loading, setLoading] = useState(false); // State to manage loading status
    const dispatch = useDispatch();
    const navigate = useNavigate();


    function onLogout() {
        dispatch(Logout(navigate));
    }

    async function onSubmit(data) {
        if (loading) return; // Prevent multiple submissions if already loading
        setLoading(true); // Set loading to true when form submission starts

        let dataLS = localStorage.getItem(adminAuthToken);
        if (!dataLS) {
            Swal.fire({
                icon: 'error',
                title: 'Authorization Error',
                text: 'No token found. Please log in again.',
                showConfirmButton: true,
                timer: 3000,
            });
            setLoading(false); // Reset loading status on error
            return;
        }

        try {
            dataLS = JSON.parse(dataLS);
            let response = await fetch(Server_URL + "admin/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            response = await response.json();

            if(response.message === 'Session Expired' || response.message === 'Token Missing') {
                return onLogout()
            }
            if (response.responseCode === 2) {
                Swal.fire({
                    icon: 'success',
                    title: response.message,
                    showConfirmButton: true,
                    timer: 3000,
                }).then(() => {
                    reset();
                });
            } else {
                Swal.fire({
                    icon: response.error ? 'error' : 'warning',
                    title: response.message,
                    showConfirmButton: true,
                    timer: 3000,
                });
            }
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message || 'Unexpected error occurred',
                showConfirmButton: true,
                timer: 3000,
            });
        } finally {
            setLoading(false); // Reset loading status after submission completes
        }
    }

    async function ReadRole() {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            let url = Server_URL + "admin/staff-roles";
            let response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                }
            });
            response = await response.json();

            if(response.message === 'Session Expired' || response.message === 'Token Missing') {
                return onLogout()
            }
            if (response) {
                if (response.responseCode === 1) {
                    console.log(response.message); // Handle error or warning messages
                } else if (response.responseCode === 2) {
                    setRole(response.data);
                }
            } else {
                console.log('Unexpected response status');
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    useEffect(() => {
        ReadRole();
    }, []);

    return (

        <div>
            <div>
                <PageTitle motherMenu="Staff" activeMenu="/create-user" pageContent="Create Staff"/>

                <>
                        <div className="card">
                            <div className="card-header card-header-bg">
                                <h4 className="mb-0 primary-color">Create a new account</h4>
                            </div>
                            <div className="card-body">
                                <form id="CreateForm" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">
                                        <div className="col-4">
                                            <label className="fw-bold">
                                                Select User Role <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                {...register("role")}
                                                id="role"
                                                className="form-control"
                                            >
                                                <option value="">Select Role</option>
                                                {role.map((value) => (
                                                    <option key={value.id} value={value.id}>{value.name}</option>
                                                ))}
                                            </select>
                                            <ErrorMessage errors={errors} name='role'
                                                          render={({message}) => <p className="text-danger">{message}</p>}
                                            />
                                        </div>

                                        <div className="col-12 mt-4 mb-2">
                                            <h5 className="text-muted">Member Information</h5>
                                        </div>

                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="firstName">
                                                First Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstName"
                                                {...register("firstName")}
                                            />
                                            <ErrorMessage errors={errors} name='firstName'
                                                          render={({message}) => <p className="text-danger">{message}</p>}
                                            />
                                        </div>

                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="lastName">
                                                Last Name <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastName"
                                                {...register("lastName")}
                                            />
                                            <ErrorMessage errors={errors} name='lastName'
                                                          render={({message}) => <p className="text-danger">{message}</p>}
                                            />
                                        </div>

                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="email">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                {...register("email")}
                                            />
                                            <ErrorMessage errors={errors} name='email'
                                                          render={({message}) => <p className="text-danger">{message}</p>}
                                            />
                                        </div>

                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="mobile">
                                                Phone Number <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="mobile"
                                                {...register("mobile")}
                                                maxLength="12"
                                            />
                                            <ErrorMessage errors={errors} name='mobile'
                                                          render={({message}) => <p className="text-danger">{message}</p>}
                                            />
                                        </div>

                                        <div className="col-12 mt-3 mb-2">
                                            <h5 className="text-muted">Login Information</h5>
                                        </div>

                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="password">
                                                Password <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                {...register("password")}
                                            />
                                            <ErrorMessage errors={errors} name='password'
                                                          render={({message}) => <p className="text-danger">{message}</p>}
                                            />
                                        </div>

                                        <div className="col-md-3 mb-3">
                                            <label htmlFor="confirmPassword">
                                                Confirm Password <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirmPassword"
                                                {...register("confirmPassword")}
                                            />
                                            <ErrorMessage errors={errors} name='confirmPassword'
                                                          render={({message}) => <p className="text-danger">{message}</p>}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <button
                                                type="submit"
                                                className="btn btn-primary px-5"
                                                disabled={loading} // Disable button when loading
                                            >
                                                {loading ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                </>

            </div>
        </div>
    )
        ;
}

export default CreateUser;
