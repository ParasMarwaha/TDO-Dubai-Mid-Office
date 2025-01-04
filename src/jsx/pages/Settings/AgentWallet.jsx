import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import PageTitle from "../../layouts/PageTitle.jsx";
import { adminAuthToken, Server_URL } from "../../../helpers/config.js";
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from "@hookform/error-message";
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import logo from "../../../assets/images/TDO_logo1.png";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";
import pdfMake from "pdfmake/build/pdfmake";
import vfs from "pdfmake/build/vfs_fonts";

pdfMake.vfs = vfs;  // Use `vfs` instead of `pdfFonts.pdfMake.vfs`


// Calculate the closing balance (Credit - Debit)
const calculateClosingBalance = (transactions) => {
    let creditTotal = 0;
    let debitTotal = 0;

    transactions.forEach(transaction => {
        if (transaction.action === 'Credit') {
            creditTotal += transaction.amount;
        } else if (transaction.action === 'Debit') {
            debitTotal += transaction.amount;
        }
    });

    return creditTotal - debitTotal;
};

// Validation Schema
const validationSchema = yup.object({
    type: yup.string().required("Type is required"),
    action: yup.string().required("Action is required"),
    amount: yup.number()
        .typeError("Amount must be a number")
        .required("Amount is required")
        .positive("Amount must be positive"),
    remarks: yup.string().required("Remarks are required"),
});

const transactionModes = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Wire', label: 'Wire' },
];

function SearchAgency() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [salesPersons, setSalesPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [agentDetails, setAgentDetails] = useState(null);
    const [agentLoading, setAgentLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dateError, setDateError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    function onLogout() {
        dispatch(Logout(navigate));
    }

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            type: "",
            action: "",
            amount: "",
            remarks: "",
        }
    });

    // Fetch salespersons
    const GetPartners = async () => {
        try {
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + "admin/getPartners";
            const res = await axios.get(api, {
                headers: {authorization: `Bearer ${data.idToken}`}
            });

            if (res.status === 200 && res.data.responseCode === 2) {
                const salesStaffOptions = res.data.data.map((staff) => ({
                    value: staff.id,
                    label: staff.establishment_name,
                }));
                setSalesPersons(salesStaffOptions);
                setLoading(false);
            } else {
                Swal.fire({icon: "error", title: res.data.message});
            }
        } catch (e) {
            Swal.fire({icon: "error", title: e.message});
            setLoading(false);
        }
    };

    // Fetch agent details when an option is selected
    const GetAgentDetails = async (agentId) => {
        try {
            setAgentLoading(true);
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + `admin/getAgentDetails/${agentId}`;
            const res = await axios.get(api, {
                headers: {authorization: `Bearer ${data.idToken}`}
            });

            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 2) {
                await GetAgentTransactions(res.data.data[0].walletId)
                setAgentDetails(res.data.data[0]);
                console.log(res.data.data[0])
            } else {
                Swal.fire({icon: "error", title: res.data.message});
            }
            setAgentLoading(false);
        } catch (e) {
            Swal.fire({icon: "error", title: e.message});
            setAgentLoading(false);
        }
    };

    // Activity API Call
    const Activity = async (description,id) =>{
        //console.log(description)
        //console.log(id)

        let data = localStorage.getItem(adminAuthToken);
        if (data) {
            data = JSON.parse(data);
        }

        const api = Server_URL + 'admin/mid-office-agent-activity-log' ;
        const res = await axios.post(api, {description:description,id:id}, {
            headers: { authorization: `Bearer ${data.idToken}` }
        });
        // console.log(res)
    }


    // Function to convert 'DD-MM-YYYY HH:MM:SS' into 'YYYY-MM-DDTHH:MM:SS'
    const parseCustomDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('-');
        return new Date(`${year}-${month}-${day}T${timePart}`);
    };

    const GetAgentTransactions = async (walletId) => {
        try {
            setAgentLoading(true);
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + `admin/getAgentTransactions/${walletId}`;
            const res = await axios.get(api, {
                headers: { authorization: `Bearer ${data.idToken}` }
            });
            console.log(res.data.data)
            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 2) {
                const transactions = res.data.data;
                setTransactions(transactions);

                // Prefill fromDate and toDate with valid dates
                if (transactions.length > 0) {
                    const firstTransaction = transactions[transactions.length - 1];
                    const lastTransaction = transactions[0];

                    // Manually parse the custom date format
                    const firstTransactionDate = parseCustomDate(firstTransaction.transaction_date_time);
                    const lastTransactionDate = parseCustomDate(lastTransaction.transaction_date_time);

                    // Set the dates in the correct format for the input fields (YYYY-MM-DD)
                    if (firstTransactionDate && lastTransactionDate) {
                        setFromDate(firstTransactionDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                        setToDate(lastTransactionDate.toISOString().split('T')[0]);
                    } else {
                        console.error("Invalid date format in transactions.");
                    }
                }

                console.log("Transactions fetched:", transactions); // Debug log
            } else {
                Swal.fire({ icon: "error", title: res.data.message });
            }
        } catch (e) {
            Swal.fire({ icon: "error", title: e.message });
        } finally {
            setAgentLoading(false);
        }
    };

    // Handle form submission
    const onsubmit = async (formData) => {
        setSubmitLoading(true);
        try {
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + "admin/updateWallet";
            const res = await axios.post(api, formData, {
                headers: {authorization: `Bearer ${data.idToken}`}
            });

            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 2) {
                Swal.fire({icon: 'success', title: res.data.message});
                await GetAgentDetails(formData.id);
                await Activity('Wallet Transaction',formData.id);
                reset();
                setModalShow(false); // Close modal after success
            }else{
                Swal.fire({icon: 'warning', title: res.data.message});
            }
        } catch (e) {
           await Swal.fire({icon: 'error', title: e.message});
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleModalOpen = (actionType) => {
        setModalShow(true);
        setValue('action', actionType);
        setValue('type', 0);
    };

    useEffect(() => {
        GetPartners();
    }, [currentPage]);

    // Helper function to convert 'DD-MM-YYYY HH:MM:SS' to 'YYYY-MM-DD' format
    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split(" ")[0].split("-");
        return `${year}-${month}-${day}`;
    };


    const filteredTransactions = transactions.filter((ap) => {
        const transactionDate = new Date(formatDate(ap.transaction_date_time));
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;
        const matchesSearch =
            (ap.transaction_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ap.transaction_date_time || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ap.remarks || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (String(ap.amount) || '').toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch && (
            (!from || transactionDate >= from) &&
            (!to || transactionDate <= to)
        );
    });

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fromDate') {
            setFromDate(value);
        } else if (name === 'toDate') {
            setToDate(value);
        }
        // Check if 'From' date is greater than 'To' date
        if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
            setDateError("'From' date cannot be greater than 'To' date.");
        } else {
            setDateError(''); // Clear error if dates are valid
        }
    };

    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            sortable: true,
            center: true,
            minWidth: '60px'  // Ensure a minimum width
        },
        {
            name: 'Type',
            selector: row => row.transaction_type,

            sortable: true
        },
        {
            name: 'Approved By',
            selector: row => row.done_by,
            sortable: true,
            wrap: true , // Enable text wrap to prevent overflow
            minWidth: '130px'
        },
        {
            name: 'Deposit',
            selector: row => row.transaction_type === 'Credit' ? row.amount : '-',
            sortable: true
        },
        {
            name: 'Withdraw',
            selector: row => row.transaction_type === 'Debit' || row.transaction_type === 'Flight Booked' ? row.amount : '-',
            sortable: true
        },
        {
            name: 'Transaction ID',
            selector: row => row.transaction_id,
            sortable: true,
            wrap: true , // Enable text wrap to prevent overflow
            minWidth: '140px'
        },
        {
            name: 'Mode Of Payment',
            selector: row => row.mode_of_payment,
            sortable: true,
            wrap: true,minWidth: '160px'
        },
        {
            name: 'Date-Time',
            selector: row => row.transaction_date_time,
            sortable: true,
            wrap: true,
            minWidth: '120px'
        },
        {
            name: 'Remarks',
            selector: row => row.remarks,
            sortable: true,
            wrap: true,
            minWidth: '100px'
        },
    ];

    const currentData = filteredTransactions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Convert image to Base64 using FileReader
    const getBase64ImageFromUrl = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';  // This helps to avoid cross-origin issues
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = function(error) {
                reject(error);
            };
            img.src = url;
        });
    };

    const exportToExcel = (fileName) => {
        if (!filteredTransactions.length) {
            Swal.fire({ icon: 'error', title: 'No transactions available to export' });
            return;
        }
        const agentName = agentDetails ? agentDetails.establishment_name : 'Transaction';

        // Calculate total credit and total debit from filtered transactions
        const totalCredit = filteredTransactions
            .filter(transaction => transaction.transaction_type === 'Credit')
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const totalDebit = filteredTransactions
            .filter(transaction => transaction.transaction_type === 'Debit')
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const closingBalance = totalCredit - totalDebit;

        const currentTime = new Date().getTime();
        const file = `${agentName}_${currentTime}_${fileName}.xlsx`;

        // Prepare a header row with agent and filter information
        const metaInfo = [
            { A: `Agent Name: ${agentDetails?.establishment_name}` },
            { A: `Date Range: ${fromDate || 'N/A'} to ${toDate || 'N/A'}` },
            {}, // Empty row for spacing
        ];

        // Prepare the formatted data for transactions
        const formattedData = filteredTransactions.map((transaction, index) => ({
            'Sr No.': index + 1,
            'Transaction Type': transaction.transaction_type,
            'Approved By': transaction.done_by,
            'Deposit': transaction.transaction_type === 'Credit' ? transaction.amount : '-',  // Deposit amount if 'Credit'
            'Withdrawal': (transaction.transaction_type === 'Debit' || transaction.transaction_type === 'Flight Booked') ? transaction.amount : '-',  // Withdrawal amount if 'Debit' or 'Flight Booked'
            'Transaction ID': transaction.transaction_id,
            'Mode Of Payment': transaction.mode_of_payment,
            'Date-Time': transaction.transaction_date_time,
            'Remarks': transaction.remarks || '-'  // Default to '-' if no remarks
        }));

        // Closing balance row (to be added at the end)
        const closingBalanceRow = [
            { A: 'Total Credit', B: totalCredit },   // Total Credit
            { A: 'Total Debit', B: totalDebit },     // Total Debit
            { A: 'Closing Balance', B: closingBalance }, // Closing Balance
        ];

        const ws = XLSX.utils.json_to_sheet([]); // Initialize worksheet
        XLSX.utils.sheet_add_json(ws, metaInfo, { skipHeader: true, origin: 'A1' }); // Add meta info
        XLSX.utils.sheet_add_json(ws, formattedData, { origin: 'A4' }); // Add transactions starting from row 4
        XLSX.utils.sheet_add_json(ws, closingBalanceRow, { skipHeader: true, origin: `A${formattedData.length + 5}` }); // Add closing balance after data

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        XLSX.writeFile(wb, file);
    };

    const exportToPDF = async () => {
        if (!filteredTransactions.length) {
            Swal.fire({ icon: 'error', title: 'No transactions available to export' });
            return;
        }

        // Convert the logo to base64
        let base64Logo;
        try {
            base64Logo = await getBase64ImageFromUrl(logo); // Convert logo to base64
        } catch (error) {
            console.error("Error converting logo to base64", error);
            Swal.fire({ icon: 'error', title: 'Error loading logo for PDF export' });
            return;
        }

        const agentName = agentDetails ? agentDetails.establishment_name : 'Transaction';
        const dateRange = `Date Range: ${fromDate || 'N/A'} to ${toDate || 'N/A'}`;

        // Calculate total credit and total debit from filtered transactions
        const totalCredit = filteredTransactions
            .filter(transaction => transaction.transaction_type === 'Credit')
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const totalDebit = filteredTransactions
            .filter(transaction => transaction.transaction_type === 'Debit')
            .reduce((acc, transaction) => acc + transaction.amount, 0);

        const closingBalance = totalCredit - totalDebit;

        // Define the PDF document content
        const documentDefinition = {
            pageSize: 'A4',
            pageOrientation: 'portrait', // Keep vertical orientation
            pageMargins: [10, 10, 10, 10], // Reduced margins
            content: [
                {
                    columns: [
                        {
                            width: 'auto',
                            image: base64Logo,
                            fit: [80, 80], // Smaller logo size
                            alignment: 'left',
                        },
                        { width: '*', text: '' },
                    ]
                },
                {
                    text: 'Wallet Statement',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 20, 0, 8],
                },
                {
                    columns: [
                        { text: `Agent Name: ${agentName}`, style: 'subheader', margin: [0, 10, 0, 0] },
                        { text: `Agency ID: ${agentDetails?.id || 'N/A'}`, style: 'subheader', alignment: 'right', margin: [0, 10, 0, 0] },
                    ]
                },
                {
                    columns: [
                        { text: `${dateRange}`, style: 'subheader', margin: [0, 10, 0, 10] },
                        { text: `Closing Balance: ${closingBalance}`, style: 'subheader', alignment: 'right', margin: [0, 10, 0, 10] },
                    ]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', '20%'], // Wider Remarks column
                        body: [
                            ['Sr No.', 'Type', 'Approved By', 'Deposit', 'Withdraw', 'Transaction ID', 'Mode Of Payment', 'Date-Time', 'Remarks'],
                            ...filteredTransactions.map((transaction, index) => [
                                index + 1,
                                transaction.transaction_type,
                                transaction.done_by,
                                transaction.transaction_type === 'Credit' ? transaction.amount : '-',
                                transaction.transaction_type === 'Debit' || transaction.transaction_type === 'Flight Booked' ? transaction.amount : '-',
                                transaction.transaction_id,
                                transaction.mode_of_payment,
                                transaction.transaction_date_time,
                                { text: transaction.remarks || '-', style: 'remarks'}, // Allow wrapping for Remarks
                            ]),
                        ],
                    },
                    layout: {
                        noWrap: false, // Allow text wrapping
                        fillColor: (rowIndex) => (rowIndex === 0 ? '#CCCCCC' : null),
                        hLineColor: '#E0E0E0',
                        vLineColor: '#E0E0E0',
                        defaultBorder: true,
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 20, 0, 8],
                },
                subheader: {
                    fontSize: 10,
                    bold: true,
                },
                tableHeader: {
                    bold: true,
                    fontSize: 8,
                    color: 'black',
                },
                remarks: {
                    fontSize: 7,
                    alignment: 'left',
                    noWrap: false,
                },
            },
        };

        // Create and download the PDF
        pdfMake.createPdf(documentDefinition).download('wallet_statement.pdf');
    };


    return (
        <div>
            <PageTitle motherMenu="Control Panel" activeMenu="/agent-wallet" pageContent="Wallet"/>

            {/* Search Dropdown */}
            <div className="card mb-4">
                <div className="card-header card-header-bg">
                    <h4 className="mb-0 primary-color">Search</h4>
                </div>
                <div className="card-body">
                    <div className="row justify-content-center py-3">
                        <div className="col-md-6 border border-light rounded p-2 shadow">
                            <label htmlFor="salesPerson">
                                <b>Travel Agent <span className="text-danger">*</span></b>
                            </label>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <Select
                                    value={selectedOption}
                                    onChange={(option) => {
                                        setSelectedOption(option);
                                        GetAgentDetails(option.value);
                                    }}
                                    options={salesPersons}
                                    placeholder="Select a sales person"
                                    id="salesPerson"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Show agent details and form */}
            {selectedOption && agentDetails && !agentLoading && (
                <>
                    <div className="card mb-4">
                        <div className="card-header card-header-bg">
                            <h4 className="mb-0 primary-color">Agency Details</h4>
                            <div className="d-flex justify-content-end">
                                <button
                                    onClick={() => handleModalOpen('Credit')} // Pass 'Credit' to modal
                                    className="btn btn-sm btn-success me-2"
                                    style={{padding: '8px 16px', fontWeight: 'bold', borderRadius: '5px'}}
                                >
                                    Credit
                                </button>
                                <button
                                    onClick={() => handleModalOpen('Debit')} // Pass 'Debit' to modal
                                    className="btn btn-sm btn-danger"
                                    style={{padding: '8px 16px', fontWeight: 'bold', borderRadius: '5px'}}
                                >
                                    Debit
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {/* Agent details */}
                                <div className="col-md-4">
                                    <p>Agent Name: <b>{agentDetails.establishment_name}</b></p>
                                </div>
                                <div className="col-md-4">
                                    <p>E-mail: <b>{agentDetails.email}</b></p>
                                </div>
                                <div className="col-md-4">
                                <p>Mobile No.: <b>{agentDetails.mobile}</b></p>
                                </div>
                                <div className="col-md-4">
                                    <p>Current Wallet Balance: <b>{agentDetails.balance}</b></p></div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction filtering inputs */}
                    {selectedOption && agentDetails && !agentLoading && (
                        <>
                            <div className="card mb-4">
                                <div className="card-header card-header-bg">
                                    <h4 className="mb-0 primary-color">Transactions</h4>
                                    <div className="d-flex justify-content-end">
                                        <button
                                            onClick={() => exportToExcel('Transaction')}
                                            style={{padding: '8px 16px'}}
                                            className="btn btn-sm btn-success m-1">
                                            Export to Excel <i className="fa fa-file-excel"></i>
                                        </button>
                                        <button
                                            onClick={exportToPDF}
                                            style={{padding: '8px 16px'}}
                                            className="btn btn-sm btn-warning m-1">
                                            Export to PDF <i className="fa fa-file-pdf"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3 mb-3">
                                            <label>From:</label>
                                            <input
                                                type="date"
                                                name="fromDate"
                                                className="form-control"
                                                value={fromDate}
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label>To:</label>
                                            <input
                                                type="date"
                                                name="toDate"
                                                className="form-control"
                                                value={toDate}
                                                min={fromDate}
                                                onChange={handleDateChange}
                                            />
                                        </div>

                                        {dateError && <div className="text-danger mb-3">{dateError}</div>}
                                    </div>

                                    {/* Existing search input */}
                                    <div className="row">
                                        <div className="mb-3 offset-lg-9">
                                            <input
                                                type="text"
                                                placeholder="Search Transactions..."
                                                className="form-control"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{ width: '250px', height: '40px' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Transactions table */}
                                    <div className="table-responsive">
                                        <DataTable
                                            columns={columns}
                                            data={currentData}
                                            pagination
                                            paginationServer
                                            paginationPerPage={rowsPerPage}
                                            onChangePage={(page) => {
                                                setCurrentPage(page);
                                            }}
                                            paginationTotalRows={filteredTransactions.length}
                                            onChangeRowsPerPage={(numberOfRows) => {
                                                setRowsPerPage(numberOfRows);
                                                setCurrentPage(1);
                                            }}
                                            highlightOnHover
                                            pointerOnHover
                                            responsive
                                            noHeader
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {selectedOption && agentLoading && (
                <div className="text-center">
                    <p>Loading agent details...</p>
                </div>
            )}

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Credit/Debit Wallet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <input {...register('TotalBalance')} type="hidden" value={agentDetails?.balance}/>
                        <input {...register('id')} type="hidden" value={agentDetails?.id}/>
                        <input {...register('walletId')} type="hidden" value={agentDetails?.walletId}/>

                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="type">Type: <span className="text-danger">*</span></label>
                                <select {...register('type')} name="type" id="type" className="form-select">
                                    <option value="">--Please Select--</option>
                                    <option value="0">Wallet</option>
                                </select>
                                <ErrorMessage errors={errors} name="type"
                                              render={({message}) => <div className="text-danger">{message}</div>}/>
                            </div>
                            <div className="col-sm-6 mb-3">
                                <label htmlFor="action">Action: <span className="text-danger">*</span></label>
                                <select {...register('action')} name="action" id="action" className="form-select">
                                    <option value="">--Please Select--</option>
                                    <option value="Debit">Debit</option>
                                    <option value="Credit">Credit</option>
                                </select>
                                <ErrorMessage errors={errors} name="action"
                                              render={({message}) => <div className="text-danger">{message}</div>}/>
                            </div>
                        </div>


                        <div className="mb-3">
                            <label htmlFor="amount">Amount: <span className="text-danger">*</span></label>
                            <input {...register('amount')} type="text" name="amount" id="amount"
                                   className="form-control" autoComplete="off"/>
                            <ErrorMessage errors={errors} name="amount"
                                          render={({message}) => <div className="text-danger">{message}</div>}/>
                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <label htmlFor="Tid">Transaction ID: <span className="text-danger"></span></label>
                                <input {...register('Tid')} type="text" name="Tid" id="Tid"
                                       className="form-control" autoComplete="off"/>
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor="MOT">Mode Of Transaction: <span className="text-danger"></span></label>
                                <select {...register('MOT')} name="MOT" id="MOT"
                                        className="form-control" autoComplete="off">
                                    <option value="">Select a mode</option>
                                    {transactionModes.map((mode) => (
                                        <option key={mode.value} value={mode.value}>
                                            {mode.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="remarks">Remarks: <span className="text-danger">*</span></label>
                            <textarea {...register('remarks')} name="remarks" id="remarks"
                                      className="form-control"></textarea>
                            <ErrorMessage errors={errors} name="remarks"
                                          render={({message}) => <div className="text-danger">{message}</div>}/>
                        </div>

                        <Button variant="primary" type="submit" disabled={submitLoading}>
                            {submitLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default SearchAgency;