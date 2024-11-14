import axios from 'axios';
// import swal from "sweetalert";
import Swal from "sweetalert2";
import {Server_URL, adminAuthToken} from "../helpers/config.js";
import {loginConfirmedAction, Logout,} from '../store/actions/AuthActions';

export function signUp(email, password) {
    // axios call
    const postData = {
        email,
        password,
        returnSecureToken: true,
    };

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`
    return axios.post(url, postData);
}

export function login(payload) {
    // const postData = {email, password, returnSecureToken: true};

    // const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`;
    const url = `${Server_URL}admin/login`;
    return axios.post(url, payload);
}

export function formatError(errorResponse) {
    switch (errorResponse.error.message) {
        case 'EMAIL_EXISTS':
            // return 'Email already exists';
            // swal("Oops", "Email already exists", "error");
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Email already exists',
            })
            break;
        case 'EMAIL_NOT_FOUND':
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Email not found',
            })
            //return 'Email not found';
            //swal("Oops", "Email not found", "error",{ button: "Try Again!",});
            break;
        case 'INVALID_PASSWORD':
            //return 'Invalid Password';
            // swal("Oops", "Invalid Password", "error",{ button: "Try Again!",});
            Swal.fire({
                icon: 'error',
                title: 'Oops',
                text: 'Invalid Password',
            })
            break;
        case 'USER_DISABLED':
            return 'User Disabled';
        default:
            return '';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    // tokenDetails.expireDate = new Date(new Date().getTime() + tokenDetails.expiresIn * 1000);
    localStorage.setItem(adminAuthToken, JSON.stringify(tokenDetails));
    // localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        //dispatch(Logout(history));
        dispatch(Logout(navigate));
    }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem(adminAuthToken);

    if (!tokenDetailsString) {
        // No token found, user needs to log in
        dispatch(Logout(navigate));
        return;
    }

    let tokenDetails = JSON.parse(tokenDetailsString);

    // Set a fixed expiration date for 24 hours from the current time
    const hours = 24
    let expireDate = new Date(Date.now() + hours * 60 * 60 * 1000); // 24 hours from now
    let todaysDate = new Date();

    // Update tokenDetails with the new expireDate
    tokenDetails.expiresIn = expireDate.toISOString(); // Save as ISO string
    localStorage.setItem(adminAuthToken, JSON.stringify(tokenDetails));

    if (todaysDate > expireDate) {
        // Token has expired, log the user out
        dispatch(Logout(navigate));
        return;
    }

    // If the token is valid, confirm login
    dispatch(loginConfirmedAction(tokenDetails));

    // Calculate remaining time before the token expires
    const timer = expireDate.getTime() - todaysDate.getTime();

    // Start a timer to log out the user when the token expires
    runLogoutTimer(dispatch, timer, navigate);
}

export function checkAutoLoginBackup(dispatch, navigate) {
    // const tokenDetailsString = localStorage.getItem('userDetails');
    const tokenDetailsString = localStorage.getItem(adminAuthToken);
    // console.log(tokenDetailsString)

    let tokenDetails = '';

    if (!tokenDetailsString) {
        // console.log("logout")
        dispatch(Logout(navigate));
        return;
    }

    tokenDetails = JSON.parse(tokenDetailsString);

    // let expireDate = new Date(tokenDetails.expireDate); // expireDate key is set during login process...
    let expireDate = new Date(tokenDetails.expiresIn);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        dispatch(Logout(navigate));
        return;
    }

    dispatch(loginConfirmedAction(tokenDetails));

    const timer = expireDate.getTime() - todaysDate.getTime();
    runLogoutTimer(dispatch, timer, navigate);
}
