import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Logout } from '../../../store/actions/AuthActions';
import { isAuthenticated } from '../../../store/selectors/AuthSelectors';
import {adminAuthToken, Server_URL} from "../../../helpers/config.js";

function LogoutPage({ isAuthenticated }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogout = async () => {
        if (isAuthenticated) {
            const authToken = localStorage.getItem(adminAuthToken);

            const tokenData = JSON.parse(authToken);
            fetch(`${Server_URL}admin/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenData.idToken}`,
                },
            }).then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                }).then(data => {

                if(data.message === 'Session Expired' || data.message === 'Token Missing') {
                    return onLogout()
                }
                if (data.responseCode === 2) {
                    // Clear the token and navigate to login page
                    dispatch(Logout(navigate));
                } else {
                    console.error('Logout failed:', data.message);
                    Swal.fire({
                        icon: 'error',
                        title: 'Logout failed',
                        text: data.message,
                    });
                }
            })
        }
    };

    return (
        <button className="dropdown-item ai-icon" onClick={onLogout}>
            <svg
                id="icon-logout" xmlns="http://www.w3.org/2000/svg"
                className="text-danger" width={18} height={18} viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1={21} y1={12} x2={9} y2={12} />
            </svg>
            <span className="ms-2">Logout</span>
        </button>
    );
}

const mapStateToProps = (state) => ({
    isAuthenticated: isAuthenticated(state),
});

export default connect(mapStateToProps)(LogoutPage);
