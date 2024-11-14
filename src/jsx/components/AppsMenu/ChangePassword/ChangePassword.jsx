import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import Swal from "sweetalert2";
import { adminAuthToken, Server_URL } from "../../../../helpers/config.js";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../../../store/actions/AuthActions.js";
import { connect, useDispatch } from 'react-redux';
import PageTitle from "../../../layouts/PageTitle.jsx";
import React from "react";

const schema = yup.object({
    oldPassword: yup.string().required("Current password is required."),
    newPassword: yup
        .string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
        .matches(/[a-z]/, 'Password must include at least one lowercase letter')
        .matches(/[0-9]/, 'Password must include at least one number')
        .matches(/[@$!%*?&]/, 'Password must include at least one special character')
        .matches(/^[A-Za-z0-9@$!%*?&]+$/, 'Password can only contain alphanumeric and special characters').required('This is a required field.'),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match.")
        .required("Please confirm your new password."),
}).required();

function ChangePassword() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function onLogout() {
        dispatch(Logout(navigate));
    }

    async function onSubmit(data) {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const api = `${Server_URL}admin/change-password`;
            let response = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();

            if (response.status === 200) {
                if(data.message === 'Session Expired' || data.message === 'Token Missing') {
                    return onLogout()
                }
                if (responseData.responseCode === 1 && responseData.error) {
                    Swal.fire({ icon: 'error', title: responseData.message });
                } else if (responseData.responseCode === 1 && responseData.warning) {
                    Swal.fire({ icon: 'warning', title: responseData.message }).then(()=>{
                        document.getElementById('Change-Pass').reset();
                    });
                } else if (responseData.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: responseData.message });
                    document.getElementById('Change-Pass').reset();
                    onLogout();
                }
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Unexpected Error",
                    text: "Something went wrong. Please try again.",
                    showConfirmButton: true,
                    timer: 3000,
                });
            }
        } catch (e) {
            //console.error(e);
            await Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        }
    }

    return (
        <div>
            <PageTitle motherMenu="Dashboard" activeMenu="Change Password" pageContent="Change Password"/>


            <div style={{backgroundRepeat: "no-repeat", backgroundSize: "100% 100%"}}>
                <div className="container" style={{margin: 0, padding: 0}}>
                    <div className="row justify-content-center">
                        <div className="col-xl-6 col-lg-7 col-md-9">
                            <div className="card mx-4">
                                <div className="card-body p-4">
                                    <br/>
                                    <h3 style={{textAlign: "center", color: "red"}}><b>Change Password</b></h3>
                                    <br/>
                                    <form id="Change-Pass" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                     className="icon" role="img" aria-hidden="true">
                                                    <path fill="var(--ci-primary-color, currentColor)"
                                                          d="M384,200V144a128,128,0,0,0-256,0v56H88V328c0,92.635,75.364,168,168,168s168-75.365,168-168V200ZM160,144a96,96,0,0,1,192,0v56H160ZM392,328c0,74.99-61.01,136-136,136s-136-61.01-136-136V232H392Z"
                                                          className="ci-primary"/>
                                                </svg>
                                            </span>
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="oldPassword"
                                                placeholder="Current Password"
                                                autoComplete="new-password"
                                                {...register("oldPassword")}
                                            />
                                        </div>
                                        <ErrorMessage errors={errors} name="oldPassword"
                                                      render={({message}) => <p className="text-danger">{message}</p>}/>

                                        <div className="input-group mb-3">
                                            <span className="input-group-text">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                     className="icon" role="img" aria-hidden="true">
                                                    <path fill="var(--ci-primary-color, currentColor)"
                                                          d="M384,200V144a128,128,0,0,0-256,0v56H88V328c0,92.635,75.364,168,168,168s168-75.365,168-168V200ZM160,144a96,96,0,0,1,192,0v56H160ZM392,328c0,74.99-61.01,136-136,136s-136-61.01-136-136V232H392Z"
                                                          className="ci-primary"/>
                                                </svg>
                                            </span>
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="newPassword"
                                                placeholder="New Password"
                                                autoComplete="new-password"
                                                {...register("newPassword")}
                                            />
                                        </div>
                                        <ErrorMessage errors={errors} name="newPassword"
                                                      render={({message}) => <p className="text-danger">{message}</p>}/>

                                        <div className="input-group mb-3">
                                            <span className="input-group-text">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                                     className="icon" role="img" aria-hidden="true">
                                                    <path fill="var(--ci-primary-color, currentColor)"
                                                          d="M384,200V144a128,128,0,0,0-256,0v56H88V328c0,92.635,75.364,168,168,168s168-75.365,168-168V200ZM160,144a96,96,0,0,1,192,0v56H160ZM392,328c0,74.99-61.01,136-136,136s-136-61.01-136-136V232H392Z"
                                                          className="ci-primary"/>
                                                </svg>
                                            </span>
                                            <input
                                                className="form-control"
                                                type="password"
                                                name="confirmNewPassword"
                                                placeholder="Confirm New Password"
                                                autoComplete="new-password"
                                                {...register("confirmNewPassword")}
                                            />
                                        </div>
                                        <ErrorMessage errors={errors} name="confirmNewPassword"
                                                      render={({message}) => <p className="text-danger">{message}</p>}/>

                                        <div className="d-grid">
                                            <button
                                                className="btn btn-success"
                                                type="submit"
                                                style={{backgroundColor: "red", color: "white", border: "black"}}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Toastify"></div>
            </div>

        </div>
    );
}

export default ChangePassword;
