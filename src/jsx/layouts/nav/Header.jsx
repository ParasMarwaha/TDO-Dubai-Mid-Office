import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Dropdown} from "react-bootstrap";
import profile from "../../../assets/images/profile/user (1).png";
//import avatar from "../../../assets/images/avatar/1.jpg";
import LogoutPage from './Logout';
import {ThemeContext} from "../../../context/ThemeContext";
import {adminAuthToken, Server_URL} from "../../../helpers/config.js";
import Swal from "sweetalert2";
import {Logout} from "../../../store/actions/AuthActions.js";
import {useDispatch} from "react-redux";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {background, changeBackground} = useContext(ThemeContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleToggle = (isOpen) => {
        setDropdownOpen(isOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    const onLogout = () => {
        dispatch(Logout(navigate));
    };

    const getInfo = async () => {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const api = Server_URL + `admin/staff-detail`;

            let response = await fetch(api, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS?.idToken}`
                }
            });

            // Check if the response status is not ok (e.g., 401 for unauthorized, 403 for forbidden)
            if (!response.ok) {
                let errorMessage = 'An error occurred';
                if (response.status === 401) {
                    errorMessage = 'Session expired. Please log in again.';
                    // Handle session expiration, e.g., redirect to login page
                    // window.location.href = '/login';
                } else if (response.status === 403) {
                    errorMessage = 'You do not have permission to access this resource.';
                } else {
                    // Handle other response statuses
                    const errorData = await response.json();
                    errorMessage = errorData.message || 'An error occurred';
                }

                await Swal.fire({
                    icon: "error",
                    title: errorMessage,
                    showConfirmButton: true,
                    timer: 3000,
                });

                return; // Exit the function if there's an error
            }

            let data = await response.json();

            if (response.status === 200) {

                if(data.message === 'Session Expired' || data.message === 'Token Missing') {
                    return onLogout()
                }

                switch (data.responseCode) {
                    case 1:
                        if (data.error) {
                            await Swal.fire({
                                icon: 'error',
                                title: data.message
                            });
                        } else if (data.warning) {
                            await Swal.fire({
                                icon: 'warning',
                                title: data.message
                            });
                        }
                        break;

                    case 2:
                        setUserData(data.data[0]); // Adjust the field based on your API response
                        break;

                    default:
                        await Swal.fire({
                            icon: 'info',
                            title: 'Unexpected response code',
                            text: `Code: ${data.responseCode}`,
                            timer: 3000,
                        });
                        break;
                }
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'An unexpected error occurred',
                    text: `Status: ${response.status}`,
                    timer: 3000,
                });
            }

        } catch (e) {
            await Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        }
    };

    function ThemeChange() {
        if (background.value === "light") {
            changeBackground({value: "dark"});
        } else {
            changeBackground({value: "light"})
        }
    }

    useEffect(() => {
        getInfo().then();
    }, []);

    return (
        <div className="header">
            <div className="header-content">
                <nav className="navbar navbar-expand">
                    <div className="collapse navbar-collapse justify-content-between">
                        <div className="header-left">
                            {/*<div className="input-group search-area d-xl-inline-flex d-none">*/}
                            {/*    <button className="input-group-text"><i className="flaticon-381-search-2 text-primary"/>*/}
                            {/*    </button>*/}
                            {/*    <input type="text" className="form-control" placeholder="Search here..."/>*/}
                            {/*</div>*/}
                        </div>
                        <ul className="navbar-nav header-right main-notification text-end">
                            <li className="nav-item dropdown notification_dropdown">
                                <Link to={"#"}
                                      className={`nav-link bell dz-theme-mode ${background.value === "dark" ? "active" : ""}`}
                                      onClick={() => ThemeChange()}
                                >
                                    <i id="icon-light" className="fas fa-sun"/>
                                    <i id="icon-dark" className="fas fa-moon"/>
                                </Link>
                            </li>

                            {/*<Dropdown as="li" className="nav-item  notification_dropdown">*/}
                            {/*    <Dropdown.Toggle*/}
                            {/*        variant=""*/}
                            {/*        as="a"*/}
                            {/*        className="nav-link  ai-icon i-false c-pointer"*/}
                            {/*        role="button"*/}
                            {/*        data-toggle="dropdown"*/}
                            {/*    >*/}
                            {/*        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"*/}
                            {/*             xmlns="http://www.w3.org/2000/svg">*/}
                            {/*            <path fillRule="evenodd" clipRule="evenodd"*/}
                            {/*                  d="M12.638 4.9936V2.3C12.638 1.5824 13.2484 1 14.0006 1C14.7513 1 15.3631 1.5824 15.3631 2.3V4.9936C17.3879 5.2718 19.2805 6.1688 20.7438 7.565C22.5329 9.2719 23.5384 11.5872 23.5384 14V18.8932L24.6408 20.9966C25.1681 22.0041 25.1122 23.2001 24.4909 24.1582C23.8709 25.1163 22.774 25.7 21.5941 25.7H15.3631C15.3631 26.4176 14.7513 27 14.0006 27C13.2484 27 12.638 26.4176 12.638 25.7H6.40705C5.22571 25.7 4.12888 25.1163 3.50892 24.1582C2.88759 23.2001 2.83172 22.0041 3.36039 20.9966L4.46268 18.8932V14C4.46268 11.5872 5.46691 9.2719 7.25594 7.565C8.72068 6.1688 10.6119 5.2718 12.638 4.9936ZM14.0006 7.5C12.1924 7.5 10.4607 8.1851 9.18259 9.4045C7.90452 10.6226 7.18779 12.2762 7.18779 14V19.2C7.18779 19.4015 7.13739 19.6004 7.04337 19.7811C7.04337 19.7811 6.43703 20.9381 5.79662 22.1588C5.69171 22.3603 5.70261 22.6008 5.82661 22.7919C5.9506 22.983 6.16996 23.1 6.40705 23.1H21.5941C21.8298 23.1 22.0492 22.983 22.1732 22.7919C22.2972 22.6008 22.3081 22.3603 22.2031 22.1588C21.5627 20.9381 20.9564 19.7811 20.9564 19.7811C20.8624 19.6004 20.8133 19.4015 20.8133 19.2V14C20.8133 12.2762 20.0953 10.6226 18.8172 9.4045C17.5391 8.1851 15.8073 7.5 14.0006 7.5Z"*/}
                            {/*                  fill="#759791"/>*/}
                            {/*        </svg>*/}
                            {/*        <span className="badge light text-white bg-secondary rounded-circle">12</span>*/}
                            {/*    </Dropdown.Toggle>*/}

                            {/*    <Dropdown.Menu align="end" className="mt-2 dropdown-menu dropdown-menu-end">*/}
                            {/*        <div className="widget-media dz-scroll p-3 height380">*/}
                            {/*            <ul className="timeline">*/}
                            {/*                <li>*/}
                            {/*                    <div className="timeline-panel">*/}
                            {/*                        <div className="media me-2">*/}
                            {/*                            <img alt="images" width={50} src={avatar}/>*/}
                            {/*                        </div>*/}
                            {/*                        <div className="media-body">*/}
                            {/*                            <h6 className="mb-1">Dr sultads Send you Photo</h6>*/}
                            {/*                            <small className="d-block">*/}
                            {/*                                29 July 2020 - 02:26 PM*/}
                            {/*                            </small>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                </li>*/}
                            {/*                <li>*/}
                            {/*                    <div className="timeline-panel">*/}
                            {/*                        <div className="media me-2 media-info">KG</div>*/}
                            {/*                        <div className="media-body">*/}
                            {/*                            <h6 className="mb-1">*/}
                            {/*                                Resport created successfully*/}
                            {/*                            </h6>*/}
                            {/*                            <small className="d-block">*/}
                            {/*                                29 July 2020 - 02:26 PM*/}
                            {/*                            </small>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                </li>*/}
                            {/*                <li>*/}
                            {/*                    <div className="timeline-panel">*/}
                            {/*                        <div className="media me-2 media-success">*/}
                            {/*                            <i className="fa fa-home"/>*/}
                            {/*                        </div>*/}
                            {/*                        <div className="media-body">*/}
                            {/*                            <h6 className="mb-1">Reminder : Treatment Time!</h6>*/}
                            {/*                            <small className="d-block">*/}
                            {/*                                29 July 2020 - 02:26 PM*/}
                            {/*                            </small>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                </li>*/}
                            {/*            </ul>*/}
                            {/*        </div>*/}
                            {/*        <Link className="all-notification" to="#">*/}
                            {/*            See all notifications <i className="ti-arrow-right"/>*/}
                            {/*        </Link>*/}
                            {/*    </Dropdown.Menu>*/}
                            {/*</Dropdown>*/}

                            <Dropdown
                                as="li"
                                className="nav-item dropdown header-profile"
                                show={dropdownOpen}
                                onToggle={handleToggle}
                            >
                                <Dropdown.Toggle
                                    variant=""
                                    as="a"
                                    className="nav-link i-false c-pointer"
                                    role="button"
                                    data-toggle="dropdown"
                                >
                                    <div className="header-info me-3">
                                        <span className="fs-16 font-w600">
                                            {userData ? userData.first_name  + " " + userData.last_name : "Loading..."}
                                        </span>
                                        <small className="text-end fs-14 font-w400">
                                            {userData ? userData.role : ""}
                                        </small>
                                    </div>
                                    <img src={profile} width={20} alt="profile-image"/>
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end" className="mt-0 dropdown-menu-end">
                                    <Link to="/app-profile" className="dropdown-item ai-icon" onClick={closeDropdown}>
                                        <svg
                                            id="icon-user1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-primary"
                                            width={18}
                                            height={18}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx={12} cy={7} r={4}/>
                                        </svg>
                                        <span className="ms-2">Profile</span>
                                    </Link>

                                    <Link to="/email-inbox" className="dropdown-item ai-icon" onClick={closeDropdown}>
                                        <svg
                                            id="icon-inbox"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-success"
                                            width={18}
                                            height={18}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path
                                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                        <span className="ms-2">Inbox</span>
                                    </Link>

                                    <Link to="/change-password" className="dropdown-item ai-icon" onClick={closeDropdown}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-primary"
                                            width={18}
                                            height={18}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x={5} y={11} width={14} height={10} rx={2} ry={2} />
                                            <path d="M12 16v-4m0 0v-2m0 2h2m-2 0H10" />
                                            <path d="M12 11V7a5 5 0 1 1 10 0" />
                                        </svg>
                                        <span className="ms-2">Change Password</span>
                                    </Link>

                                    <LogoutPage onLogout={closeDropdown}/>
                                </Dropdown.Menu>
                            </Dropdown>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;


