import Swal from 'sweetalert2';
import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
} from '../../services/AuthService';
import {adminAuthToken} from "../../helpers/config.js";

export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';
export const NAVTOGGLE = 'NAVTOGGLE';

export function signupAction(email, password, navigate) {
    return (dispatch) => {
        signUp(email, password).then((response) => {
                saveTokenInLocalStorage(response.data);
                runLogoutTimer(
                    dispatch,
                    response.data.expiresIn * 1000,
                    //history,
                );
                dispatch(confirmedSignupAction(response.data));
                navigate('/dashboard');
                //history.push('/dashboard');
            }).catch((error) => {
                const errorMessage = formatError(error.response.data);
                dispatch(signupFailedAction(errorMessage));
            });
    };
}

export function Logout(navigate) {
    // localStorage.removeItem('userDetails');
    localStorage.removeItem(adminAuthToken);
    navigate('/login');

    return {type: LOGOUT_ACTION};
}

export function loginAction(data, navigate) {
    return (dispatch) => {
        login(data).then((response) => {
            if (response.status === 200) {
                if (response.data.responseCode === 1 && response.data.error) {
                    Swal.fire({icon: 'error', title: response.data.message});
                } else if (response.data.responseCode === 1 && response.data.warning) {
                    Swal.fire({icon: 'warning', title: response.data.message});
                } else if (response.data.responseCode === 2) {
                    Swal.fire({icon: 'success', title: response.data.message});

                    setTimeout(() => {
                        // Store token and user data in local storage
                        localStorage.setItem('adminAuthToken', JSON.stringify(response.data.data));

                        // Update Redux state
                        dispatch(loginConfirmedAction(response.data.data));

                        // Navigate to the dashboard
                        navigate('/dashboard');
                    }, 1200);
                }
            }
        }).catch((error) => {
            Swal.fire({icon: 'error', title: error.message});
        }).finally(() => {
            dispatch(loadingToggleAction(false)); // Stop loading
        });
    };
}


export function loginActionBackup(data, navigate) {
    return (dispatch) => {
        login(data).then((response) => {
            if (response.status === 200) {
                if (response.data.responseCode === 1 && response.data.error) {
                    Swal.fire({icon: 'error', title: response.data.message});
                } else if (response.data.responseCode === 1 && response.data.warning) {
                    Swal.fire({icon: 'warning', title: response.data.message});
                } else if (response.data.responseCode === 2) {
                    // console.log(response.data.data);
                    // console.log(response.data.data.expiresIn);
                    Swal.fire({icon: 'success', title: response.data.message});

                    setTimeout(() => {
                        localStorage.setItem(adminAuthToken, JSON.stringify(response.data.data));
                        // runLogoutTimer(dispatch, response.data.data.expiresIn * 1000, navigate);
                        dispatch(loginConfirmedAction(response.data.data));
                        navigate('/dashboard');
                    }, 1200);

                    // saveTokenInLocalStorage(response.data);
                    // runLogoutTimer(dispatch, response.data.expiresIn * 1000, navigate);
                    // dispatch(loginConfirmedAction(response.data));
                    // navigate('/dashboard');
                }
            }
        }).catch((error) => {
            // console.log(error)
            // console.log(error.message)
            Swal.fire({icon: 'error', title: error.message});

            // const errorMessage = formatError(error.response.data);
            // dispatch(loginFailedAction(errorMessage));
        });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    return {type: LOGIN_CONFIRMED_ACTION, payload: data};
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    // console.log(status)
    return {type: LOADING_TOGGLE_ACTION, payload: status};
}

export const navtoggle = () => {
    return {type: 'NAVTOGGLE'};
};