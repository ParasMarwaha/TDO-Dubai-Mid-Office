import {HiUsers} from "react-icons/hi2";
//import {FaUserCog} from "react-icons/fa";
//import {FaFileAlt} from "react-icons/fa";
//import {FaGlobeAsia} from "react-icons/fa";
//import {PiAirplaneTakeoffFill} from "react-icons/pi";
//import {RiBankFill} from "react-icons/ri";
import {FaFileSignature, FaPlaneDeparture, FaUserCircle, FaUserCog} from "react-icons/fa";
import {FaPlaneCircleCheck, FaUserTie} from "react-icons/fa6";
import {IoAccessibilitySharp, IoSettingsSharp} from "react-icons/io5";
//import {RiHotelFill} from "react-icons/ri";
import {MdSpaceDashboard} from "react-icons/md";
import {PiUserSwitchBold} from "react-icons/pi";

export const MenuList = [
    // Dashboard
    {
        title: 'Dashboard',
        // classsChange: 'mm-collapse',
        // iconStyle: <i className="flaticon-025-dashboard"/>,
        iconStyle: <MdSpaceDashboard/>,
        to: 'dashboard',
    },

    // Roles
    {
        title: 'Roles',
        iconStyle: <PiUserSwitchBold/>,
        to: 'user-role',
    },

    // Users
    {
        title: 'Staff',
        classsChange: 'mm-collapse',
        iconStyle: <FaUserCircle/>,
        content: [
            {
                title: 'Create New Staff',
                to: 'create-user',
            },
            {
                title: 'All Staff',
                to: 'users',
            },
        ],
    },

    // Manage Partners
    {
        title: 'Partners',
        classsChange: 'mm-collapse',
        iconStyle: <FaUserTie/>,
        content: [
            {
                title: 'Active Partners',
                to: 'active-agents',
            },
            {
                title: 'Inactive Partners',
                to: 'inactive-agents',
            },
            {
                title: 'Suspended Partners',
                to: 'suspended-agents',
            },
            {
                title: 'Partners Mapping',
                to: 'partners-agents',
            },

        ],
    },

    // Manage Distributors
    // {
    //     title: 'Distributors',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <HiUsers/>,
    //     content: [
    //         {
    //             title: 'Create Distributor',
    //             to: 'create-distributor',
    //         },
    //         {
    //             title: 'Active Distributors',
    //             to: 'active-distributors',
    //         },
    //         {
    //             title: 'Inactive Distributors',
    //             to: 'inactive-distributors',
    //         },
    //         {
    //             title: 'Search Agents',
    //             to: 'distributor-agents',
    //         },
    //     ],
    // },

    /// User Group
    {
        title: 'User Group',
        iconStyle: <FaUserCog/>,
        to: 'user-group',
    },

    /// Logs
    {
        title: 'Logs',
        classsChange: 'mm-collapse',
        iconStyle: <IoAccessibilitySharp/>,
        content: [
            {
                title: 'Mid Office',
                classsChange: 'mm-collapse',
                hasMenu: true,
                content: [
                    {
                        title: 'Login Logout Logs',
                        to: 'mid-office-log',
                    },
                    {
                        title: 'General Activity Log',
                        to: 'mid-office-activity-log',
                    },
                    {
                        title: 'Agent Activity Log',
                        to: 'mid-office-activity-onAgent-log',
                    },
                ]
            },
            {
                title: 'Travel Agents',
                classsChange: 'mm-collapse',
                hasMenu: true,
                content: [
                    {
                        title: 'Login Logout Logs',
                        to: 'travel-agent-log',
                    },
                    {
                        title: 'Activity Logs',
                        to: 'travel-agent-activity-log',
                    },
                    {
                        title: 'Details Changes',
                        to: 'details-changes',
                    },
                    {
                        title: 'Document Changes',
                        to: 'document-changes',
                    },
                ],
            },
            {
                title: 'Flight Search Logs',
                to: '/search-log'
            },
        ],
    },


    // Insurance
    // {
    //     title: 'Insurance',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <MdHealthAndSafety/>,
    //     content: [
    //         {
    //             title: 'Insurance Graphs',
    //             to: 'insurance-graph',
    //         },
    //         {
    //             title: 'Symbo Account',
    //             to: 'symbo-account',
    //         },
    //     ],
    // },

    // Flights
    {
        title: 'Flights',
        classsChange: 'mm-collapse',
        iconStyle: <FaPlaneDeparture/>,
        content: [
            // {
            //     title: 'Flight Stats',
            //     to: 'flights-collection',
            // },
            {
                title: 'Confirmed Tickets',
                to: 'booked-flights',
            },
            {
                title: 'Hold Tickets',
                to: 'hold-flights',
            },
            {
                title: 'Cancellation Queue',
                to: '/cancel-flights',
            },
        ],
    },

    // Hotels
    // {
    //     title: 'Hotels',
    //     classsChange: 'mm-collapse',
    //     // iconStyle: <FaHotel/>,
    //     iconStyle: <RiHotelFill/>,
    //     content: [
    //         {
    //             title: 'Hotel Stats',
    //             to: 'hotels-collection',
    //         },
    //         {
    //             title: 'Search Booking',
    //             to: 'hotels-bookings',
    //         },
    //         {
    //             title: 'Hotel Markups',
    //             hasMenu: true,
    //             content: [
    //                 {
    //                     title: 'Manage Markups',
    //                     to: 'manage-hotel-markups',
    //                 },
    //                 {
    //                     title: 'Allot Markups',
    //                     to: 'allot-hotel-markups',
    //                 },
    //             ],
    //         },
    //     ],
    // },

    // Fix Dept. Flights
    // {
    //     title: 'Fix Dept. Flights',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <FaPlaneCircleCheck/>,
    //     content: [
    //         {
    //             title: 'Search Booking',
    //             to: 'fixed-departure',
    //         },
    //         {
    //             title: 'Cancellation Queue',
    //             to: 'fixed-departure-cancellation',
    //         },
    //     ],
    // },

    // Failure Logs
    // {
    //     title: 'Failure Logs',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <FaFileSignature/>,
    //     content: [
    //         {
    //             title: 'Flights',
    //             to: 'failure-logs-flights',
    //         },
    //         {
    //             title: 'Fix Dept. Flights',
    //             to: 'failure-logs-flights-fix-departure',
    //         },
    //     ],
    // },

    // Manage Country
    // {
    //     title: 'Manage Country',
    //     //classsChange: 'mm-collapse',
    //     iconStyle: <FaGlobeAsia/>,
    //     to: 'manage-countries',
    // },

    // Platform Fees
    // {
    //     title: 'Platform Fees',
    //     //classsChange: 'mm-collapse',
    //     iconStyle: <RiBankFill/>,
    //     to: 'service-fee',
    // },

    // Airlines
    // {
    //     title: 'Airlines',
    //     //classsChange: 'mm-collapse',
    //     iconStyle: <PiAirplaneTakeoffFill/>,
    //     to: 'manage-airlines',
    // },

    // Accounts
    // {
    //     title: 'Accounts',
    //     classsChange: 'mm-collapse',
    //     iconStyle: <IoFileTrayFullSharp/>,
    //     content: [
    //         {
    //             title: 'Wallet',
    //             to: 'wallet',
    //         },
    //     ],
    // },

    ///Settings

    {
        title: 'Control Panel',
        classsChange: 'mm-collapse',
        iconStyle: <IoSettingsSharp/>,
        content: [
            {
                title: 'Flights',
                classsChange: 'mm-collapse',
                hasMenu: true,
                content: [
                    {
                        title: 'Flight Commission',
                        to: 'manage-flight-commission',
                    },
                ],
            },

            {
                // Platform Fees
                title: 'Wallet',
                to: 'agent-wallet',
            },

            {
                // Platform Fees
                title: 'Platform Fees',
                to: 'service-fee',
            },
            {
                // Supplier
                title: 'Supplier',
                to: 'supplier',
            },
            {
                // Fare Type
                title: 'Fare',
                to: 'fare-type',
            },
        ],
    },
]