import React, {useState} from "react";
import {connect, useDispatch} from 'react-redux';
import {Link, useNavigate} from "react-router-dom";
import {loadingToggleAction, loginAction} from '../../store/actions/AuthActions';

import * as yup from "yup"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import {ErrorMessage} from "@hookform/error-message"

// image
// import logo2 from "../../assets/images/logo-full-white.png";
import logo2 from "../../assets/images/tdo-logo-white.png";
// import login from "../../assets/images/login-bg-1.jpg";
import login from "../../assets/images/tdo-logo-white.png";

const schema = yup.object({
    email: yup.string().required('This is a required field.'),
    password: yup.string().required('This is a required field.'),
}).required()

function Login(props) {
    // console.log("Login Page - props")
    // console.log(props)

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({resolver: yupResolver(schema)});

    const dispatch = useDispatch();
    const Nav = useNavigate();

    function onSubmit(data) {
        dispatch(loadingToggleAction(true));
        dispatch(loginAction(data, Nav));

        // dispatch(loginAction(email, password, Nav));
    }

    return (
        <div className="login-wrapper">
            <div className="login-aside-left" style={{backgroundImage: "url(" + login + ")"}}>
                <Link to="/" className="login-logo">
                    <img src={logo2} width="250" alt=""/>
                </Link>

                <div className="login-description">
                    {/*<h2 className="text-white mb-4 d-none d-lg-block">Check the Status</h2>*/}
                    {/*<p className="fs-12 d-none d-lg-block">It is a long established fact that a reader will be*/}
                    {/*    distracted by the readable content of a page when looking at its layout. The point of using*/}
                    {/*    Lorem Ipsum is that it has a more-or-less normal distribution of letters,</p>*/}
                </div>
            </div>

            <div className="login-aside-right">
                <div className="row m-0 justify-content-center h-100 align-items-center">
                    <div className="col-xl-8 col-xxl-8">
                        <div className="authincation-content">
                            <div className="row no-gutters">
                                <div className="col-xl-12">
                                    <div className="auth-form">
                                        <div className=" mb-3">
                                            <h2 className="text-primary">Welcome to TDO DXB Midoffice</h2>
                                        </div>
                                        <h4 className=" mb-4 ">Sign in by entering information below</h4>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            {/* Email */}
                                            <div className="form-group mb-3">
                                                <label className="mb-2 ">
                                                    <strong>Email</strong><span className="required"> *</span>
                                                </label>
                                                <input type="email" className="form-control" {...register('email')}/>
                                                <ErrorMessage errors={errors} name='email'
                                                              render={({message}) => <div
                                                                  className="text-danger fs-12">{message}</div>}
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="form-group mb-3">
                                                <label className="mb-2 "><strong>Password</strong> <span
                                                    className="required"> *</span></label>
                                                <input type="password" className="form-control" {...register('password')}/>
                                                <ErrorMessage errors={errors} name='password'
                                                              render={({message}) => <div
                                                                  className="text-danger fs-12">{message}</div>}
                                                />
                                            </div>

                                            <div className="form-row d-flex justify-content-between mt-4 mb-2"></div>

                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary btn-block">
                                                    Sign In
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};
export default connect(mapStateToProps)(Login);
