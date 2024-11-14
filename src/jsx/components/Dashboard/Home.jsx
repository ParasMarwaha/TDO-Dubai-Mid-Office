import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

// Import
import {ThemeContext} from "../../../context/ThemeContext";
import BestSellingTab from '../Ventic/Home/Tab/BestSellingTab';
import RecentEvenList from '../Ventic/Home/RecentEvenList';
import Latestsaleblog from '../Ventic/Home/Latestsaleblog';
import SalesRevenueTab from '../Ventic/Home/Revenue/SalesRevenueTab';
import UpcomingEventSection from '../Ventic/Home/UpcomingEventSection';
import DashboardCard from "../Cards/DashboardCard.jsx";
import {adminAuthToken, Server_URL} from "../../../helpers/config.js";
import Swal from "sweetalert2";
import {Logout} from "../../../store/actions/AuthActions.js";
import {useDispatch} from "react-redux";
import CountUp from "react-countup";


// Loadable Components with Lazy Loading
const TicketsLineApex = loadable(() => pMinDelay(import("../Ventic/Home/TicketsLineApex"), 1000));
const RevenueLineApex = loadable(() => pMinDelay(import("../Ventic/Home/RevenueLineApex"), 1000));
const SalesCanvas = loadable(() => pMinDelay(import("../Ventic/Home/SalesCanvas"), 1000));
const Donut = loadable(() => pMinDelay(import("../Ventic/Home/Donut"), 1000));

const Home = () => {
    const {changeBackground} = useContext(ThemeContext);
    const [count, setCount] = useState({users: 0, partners: 0});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);  // State to track hover

    const onLogout = () => {
        dispatch(Logout(navigate));
    };
    // Fetch counts from the API
    const getInfo = async () => {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const api = `${Server_URL}admin/count`;
            let response = await fetch(api, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                }
            });
            let data = await response.json();
            //console.log(data)
            if (data.message === 'Session Expired' || data.message === 'Token Missing') {
                return onLogout()
            }

            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: data.message,
                    showConfirmButton: true,
                    timer: 3000,
                });
            } else {
                setCount({
                    users: data.users[0].users,    // Adjust these keys based on your actual API response
                    partners: data.partners[0].partners,
                    pending: data.pending[0].pendingRequest,
                    revenue: data.totalFlightRevenue[0].totalFlightRevenue,
                    FlightSearch: data.flightSearchCount[0].flightSearchCount,
                    Booked: data.flightBookCount[0].flightBookCount,
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
    }

    const cardStyle = {
        cursor: 'pointer',
        backgroundColor: hover ? '#f0f0f0' : 'white',  // Change color on hover
        transition: 'background-color 0.3s ease',
    };

    useEffect(() => {
        changeBackground({value: "light", label: "Light"});
        getInfo().then();
    }, []);

    const [timesession, setTimesession] = useState('October 29th - November 29th, 2023');

    return (
        <>
            <div className="form-head mb-4 d-flex flex-wrap align-items-center">
                <div className="me-auto">
                    <h2 className="font-w600 mb-0">Dashboard</h2>
                </div>
                {/* Other UI elements like search bar or period dropdown can be added here */}
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="row">

                        <div className="col-lg-4 col-sm-6 ">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div className="d-flex align-items-center">
                                        <h3 className="chart-num font-w600 mb-0">
                                           AED <CountUp end={count.revenue} duration={3}/>
                                        </h3>
                                    </div>
                                    <div>
                                        <h5 className="text-black font-w500 mb-0">Flights </h5>
                                        <h5 className="text-black font-w500 mb-0">Revenue</h5>
                                    </div>
                                </div>
                                <div className="card-body pt-0"></div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-sm-6 ">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div className="d-flex align-items-center">
                                        <h2 className="chart-num font-w600 mb-0">
                                            <CountUp end={count.FlightSearch} duration={3}/>
                                        </h2>
                                    </div>
                                    <div>
                                        <h5 className="text-black font-w500 mb-0">Total Flights</h5>
                                        <h5 className="text-black font-w500 mb-0">Searched</h5>
                                    </div>
                                </div>
                                <div className="card-body pt-0"></div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-sm-6 ">
                            <div className="card">
                                <div className="card-header border-0 pb-0">
                                    <div className="d-flex align-items-center">
                                        <h2 className="chart-num font-w600 mb-0">
                                            <CountUp end={count.Booked} duration={3}/>
                                        </h2>
                                    </div>
                                    <div>
                                        <h5 className="text-black font-w500 mb-0">Total Flights</h5>
                                        <h5 className="text-black font-w500 mb-0">Booked</h5>
                                    </div>
                                </div>
                                <div className="card-body pt-0"></div>
                            </div>
                        </div>

                    </div>


                    <div className="row">
                        <DashboardCard Count={count.users} Title='Staff'/>
                        <DashboardCard Count={count.partners} Title='Partners'/>

                        <div className="col-lg-4 col-sm-6 ">
                            <Link to="/pending-requests" style={{textDecoration: 'none'}}>
                                <div className="card" style={cardStyle}
                                     onMouseEnter={() => setHover(true)}   // Set hover state to true on mouse enter
                                     onMouseLeave={() => setHover(false)}  // Set hover state to false on mouse leave//
                                >
                                    <div className="card-header border-0 pb-0">
                                        <div className="d-flex align-items-center">
                                            <h2 className="chart-num font-w600 mb-0">
                                                <CountUp end={count.pending} duration={3}/>
                                            </h2>
                                        </div>
                                        <div>
                                            <h5 className="text-black font-w500 mb-0">Wallet Pending</h5>
                                            <h5 className="text-black font-w500 mb-0"> Requests</h5>
                                        </div>
                                    </div>
                                    <div className="card-body pt-0"></div>
                                </div>
                            </Link>
                        </div>

                    </div>
                </div>


                <div className="col-xl-12">
                    <div className="row">
                        <div className="col-xl-6">
                            <BestSellingTab/>
                        </div>
                        <div className="col-xl-6">
                            <div className="card bg-primary">
                                <div className="card-body">
                                    <div className="d-sm-flex d-block pb-sm-3 align-items-end mb-2">
                                        <div className="me-auto pe-3 mb-3 mb-sm-0">
                                            <span className="chart-num-3 font-w200 d-block mb-sm-3 mb-2 text-white">Ticket Sold Today</span>
                                            <h2 className="chart-num-2 text-white mb-0">143,069<span
                                                className="fs-18 me-2 ms-3">pcs</span></h2>
                                        </div>
                                        <div className="d-flex flex-wrap mb-3 mb-sm-0">
                                            <svg width="87" height="58" viewBox="0 0 87 58" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M18.4571 37.6458C11.9375 44.6715 4.81049 52.3964 2 55.7162H68.8125C77.6491 55.7162 84.8125 48.5528 84.8125 39.7162V2L61.531 31.9333C56.8486 37.9536 48.5677 39.832 41.746 36.4211L37.3481 34.2222C30.9901 31.0432 23.2924 32.4352 18.4571 37.6458Z"
                                                    fill="url(#paint0_linear)"/>
                                                <path
                                                    d="M2 55.7162C4.81049 52.3964 11.9375 44.6715 18.4571 37.6458C23.2924 32.4352 30.9901 31.0432 37.3481 34.2222L41.746 36.4211C48.5677 39.832 56.8486 37.9536 61.531 31.9333L84.8125 2"
                                                    stroke="white" strokeWidth="4" strokeLinecap="round"/>
                                                <defs>
                                                    <linearGradient id="paint0_linear" x1="43.4062" y1="8.71453"
                                                                    x2="46.7635" y2="55.7162"
                                                                    gradientUnits="userSpaceOnUse">
                                                        <stop stopColor="white" offset="0"/>
                                                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="ms-3">
                                                <p className="fs-20 mb-0 font-w500 text-white">+4%</p>
                                                <span className="fs-12 text-white">than last day</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="progress style-1" style={{height: "15px"}}>
                                        <div className="progress-bar bg-white progress-animated"
                                             style={{width: "55%", height: "15px"}} role="progressbar">
                                            <span className="sr-only">55% Complete</span>
                                            <span className="bg-white arrow"></span>
                                            <span className="font-w600 counter-bx text-black"><strong
                                                className="counter font-w400">985pcs Left</strong></span>
                                        </div>
                                    </div>
                                    <p className="fs-12 text-white pt-4">Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad mini</p>
                                    <Link to={"#"} className="text-white">View Detail<i
                                        className="las la-long-arrow-alt-right scale5 ms-3"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9 col-xxl-8">
                    <div className="row">
                        <div className="col-xl-12">
                            <RecentEvenList/>
                        </div>
                        <div className="col-xl-6 col-xxl-12">
                            <Latestsaleblog/>
                        </div>
                        <div className="col-xl-6 col-xxl-12">
                            <SalesRevenueTab/>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-xxl-4">
                    <div className="row">
                        <div className="col-xl-12">
                            <UpcomingEventSection/>
                        </div>
                        <div className="col-xl-12">
                            <TicketsLineApex/>
                        </div>
                        <div className="col-xl-12">
                            <RevenueLineApex/>
                        </div>
                        <div className="col-xl-12">
                            <SalesCanvas/>
                        </div>
                        <div className="col-xl-12">
                            <Donut/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
