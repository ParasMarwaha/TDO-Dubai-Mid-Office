import {Link, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import {adminAuthToken, Server_URL} from "../../../helpers/config.js";
import {CButton, CFormInput, CInputGroup, CInputGroupText, CFormTextarea} from "@coreui/react";
import {useForm} from "react-hook-form";

import Form from 'react-bootstrap/Form';
import PageTitle from "../../layouts/PageTitle.jsx";

let FlightCancellationDetails = () => {
    let location = useLocation()
    // console.log(location.state.id)
    let [loader, setLoader] = useState(true)
    let [cancelDetail, setCancelDetail] = useState([])

    const [isCheckingStatus, setIsCheckingStatus] = useState("");
    const [ids, setIds] = useState(''); // State to manage IDs
    const [wyCanInvNo, setWyCanInvNo] = useState(null)
    const [status, setStatus] = useState(false)
    const [grandTotal, setGrandTotal] = useState(0)
    const [isToggled, setIsToggled] = useState(false);
    let [bookingId, setBookingId] = useState(0)
    let [showHidAgent, setShowHideAgent] = useState("");
    let [totalAmendmentCharge, setAmendmentCharge] = useState(0)
    const [clickedButton, setClickedButton] = React.useState(null);
    let {
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        formState: {errors}
    } = useForm()

    function handleButtonClick(buttonId) {
       // console.log(buttonId)
        setClickedButton(buttonId);
    }

    let fetchData = async () => {
        const dataLS = localStorage.getItem(adminAuthToken);
        if (!dataLS) {
            throw new Error('No authentication token found.');
        }
        const parsedData = JSON.parse(dataLS);
        // console.log(location.state.row.cancel_id)
        axios.get(Server_URL + "admin/flight-cancellation-details/" + location.state.row.cancel_id, {
            headers: {
                'Authorization': `Bearer ${parsedData.idToken}`, 'Content_Type': 'application-json'
            }
        }).then(res => {
            //console.log("response====")
            console.log(res.data.data)
            let total_amount = 0;
            for (let x of res.data.data) {
                let discounted_price = ((parseFloat(x.base_fare) +
                    parseFloat(x.markup_per_pax) +
                    parseFloat(x.passenger_additional_tax) +
                    parseFloat(x.passenger_other_charges) +
                    parseFloat(x.total_ssr_amount)
                    + parseFloat(x.passenger_service_fee) +
                    parseFloat(x.yq_tax) +
                    parseFloat(x.yr_tax) +
                    parseFloat(x.k3_tax) - parseFloat(x.commission)
                )).toFixed(2)
                //console.log("Discounted Price---" + parseFloat(discounted_price))
                total_amount += parseFloat(discounted_price);
            }
            //console.log("total amount---" + total_amount)
            total_amount = total_amount.toFixed(2)
            setGrandTotal(total_amount)
            setValue('totalAmount', total_amount)
            setValue('grandTotal', total_amount)

            if (res.data.error !== true) {
                setLoader(false)
                // console.log("response fetch data---")
                //console.log(res.data)
                setCancelDetail(res.data.data)
                //console.log(cancelDetail)
                setIsCheckingStatus(res.data.data[0].cancel_status)
                setBookingId(location.state.row.cancel_id)
                setShowHideAgent(res.data.data[0].show_to_agent)
            }
        })
    }

    const cancellationCharges = watch(cancelDetail.map(item => `finalAmount${item.cancel_detail_id}`));
    // console.log()
    useEffect(() => {
        fetchData().then()
    }, []);


    // Collect Ids
    useEffect(() => {
        collectIds();
    }, [cancelDetail]);


    useEffect(() => {
        // This effect runs whenever any cancellation charge changes
        const hasCharges = cancellationCharges.some(charge => parseFloat(charge) > 0);
        // console.log('Any charges present:', hasCharges);

        // Start from the initial grand total
        let totalAmount = parseFloat(grandTotal) || 0; // Ensure grandTotal is a number

        // Subtract the cancellation charges from the grand total
        cancellationCharges.forEach(charge => {
            //  console.log("Charge---" + charge)
            totalAmount -= (parseFloat(charge)).toFixed(2) || 0; // Treat empty or invalid values as 0
        });

        // console.log('Updated totalAmount:', totalAmount);
    }, [cancellationCharges]); // This will trigger whenever cancellation charges change


    function formatDate(dateString) {
        //console.log(dateString)
        if (!dateString) {
            return ''
        }
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = String(date.getFullYear()).slice(-2);

        return `${day}-${month}-${year}`;
    }

    console.log(errors)

    function onSubmitForm(data) {
        console.log("data===");
        console.log(data);
        console.log(clickedButton)
        console.log("Collected Ids " + ids);

        document.getElementById(clickedButton).disabled = true;

        const collectedIds = ids.split(',').map(id => id.trim()); // Convert to array and trim spaces
        const charges = {};
        const result = [];

        collectedIds.forEach(id => {
            const combined = {};

            // Get all keys related to the current ID from data
            for (const key in data) {
                console.log("Key--" + key);
                if (key.includes(id)) {
                    combined[key] = data[key];
                }
            }

            // Add the ID to the combined object
            combined.id = id; // Add the respective ID
            combined.cancelQueueId = data.cancel_id;
            combined.request_type = data.request_type;

            // Find corresponding details and select specific fields
            const detail = cancelDetail.find(item => item.cancel_detail_id == id);
            console.log(detail);
            if (detail) {
                console.log("ticket no===" + detail.ticket_no);
                combined.WY_TKT_NO = detail.ticket_no;
                combined.serviceCharge = data.serviceCharge;
                combined.gst = data.gst;
                combined.refundAmount = data.grandTotal;
                combined.remarks = data.remarks;
                combined.bookingId = location.state.row.booking_id
            }

            result.push(combined);
        });

        console.log("Result--------");
        console.log(result);

        const dataLS = localStorage.getItem(adminAuthToken);
        if (!dataLS) {
            throw new Error('No authentication token found.');
        }
        const parsedData = JSON.parse(dataLS);
        const endpoint =
            clickedButton === 'issueCR'
                ? 'http://192.168.29.219:4000/' + "admin/flight-cancellation-action"
                : 'http://192.168.29.219:4000/' + "admin/flight-cancellation-cancel";

        axios.post(endpoint, result, {
            headers: {
                Authorization: `Bearer ${parsedData.idToken}`,
                Content_Type: 'application-json',
            },
        })
            .then((res) => {
                console.log(res);
                // reset();
                if (res.data.error === false) {
                    setStatus(true);
                    document.getElementById(clickedButton).disabled = false;
                    Swal.fire({ icon:'success' , title : res.data.message}).then(()=>{
                        window.location.reload();
                    });
                }
            });
    }

    function addServiceCharge(e) {
        let serviceCharge = parseFloat(e.target.value);
        let totalAmount = parseFloat(document.getElementById("totalAmount").value);

        if (totalAmount > serviceCharge) {
            let gst = serviceCharge * 0.05;
            setValue('gst', gst.toFixed(2))

            let finalAmt = (totalAmount - (serviceCharge + gst));
            setGrandTotal(finalAmt)
            document.getElementById("gst").value = gst.toFixed(2);
            setValue('grandTotal', finalAmt)

        } else {
            setValue('serviceCharge', "");
            setValue('finalAmount', totalAmount.toFixed(2))
        }
    }

    function calculate_total_amount() {
        let gst = parseFloat(getValues('gst'))
        let serviceCharge = getValues('serviceCharge')
        serviceCharge = parseFloat(serviceCharge)

        let total = 0;
        for (let x of cancelDetail) {
            //console.log("Id------" + x.cancel_detail_id)
            let amount = parseFloat(getValues(`finalAmount${x.cancel_detail_id}`));
            //console.log("final amount row wise --" + amount)
            total += amount;
        }
        setValue('totalAmount', total);

        //console.log(total);
        let total2 = total + gst + serviceCharge;
        setValue('grandTotal', total2);
    }

    const calcFinalAmt = (e, id) => {
        // Parse the cancellation charge and ticket price
        const cancelCharge = parseFloat(e.target.value); // Get the cancellation charge
        const ticketPrice = parseFloat(getValues(`newPrice${id}`)) || 0; // Get ticket price

        let finalAmt;
        // Calculate the final amount based on the cancellation charge
        if (ticketPrice > cancelCharge) {
            finalAmt = ticketPrice - cancelCharge; // Normal subtraction
        } else {
            finalAmt = ticketPrice; // No discount if charge exceeds ticket price
        }


        //console.log("Final Amt --- ", finalAmt);

        // let total_amount__ = getValues('totalAmount');
        // let new_total_price = total_amount__ - cancelCharge;
        // console.log(cancelCharge, ticketPrice, finalAmt, total_amount__, new_total_price, grandTotal)
        // setValue('totalAmount', new_total_price.toFixed(2));

        // Set the final amount for the specific item
        setValue(`finalAmount${id}`, finalAmt.toFixed(2));

        // Update grand total based on all final amounts
        let totalFinalAmount = 0;
        for (let item of cancelDetail) {
            let amount = parseFloat(getValues(`finalAmount${item.id}`)) || 0; // Safe parsing for each final amount
            totalFinalAmount += amount; // Sum up final amounts
        }

        // Update the total amount based on the totalFinalAmount and initial totalAmount
        let totalAmount = parseFloat(getValues("totalAmount")) || 0; // Safe parsing for total amount
        let discountedAmt = totalAmount - (cancelCharge - (cancelCharge > ticketPrice ? ticketPrice : 0)); // Adjust total amount based on cancel charge
        calculate_total_amount();
    };

    const collectIds = () => {
        const collectedIds = cancelDetail.map(item => item.cancel_detail_id).join(','); // Collect IDs into a comma-separated string
        setIds(collectedIds); // Update state
    };

    let showHideAgent = (bId, status) => {
        // alert("In show hide agent-----"+bId, status)
        let formData = {
            bookingId: bId, status: status
        }
        console.log(formData)
        const dataLS = localStorage.getItem(adminAuthToken);
        if (!dataLS) {
            throw new Error('No authentication token found.');
        }
        const parsedData = JSON.parse(dataLS);
        axios.post('http://192.168.29.219:4000/' + "admin/updateFlightShowAgentStatus", formData, {
            headers: {
                'Authorization': `Bearer ${parsedData.idToken}`,
                'Content_Type': 'application-json'
            }
        }).then((response) => {
            console.log(response)
            if (response.data.error === false) {
                setIsToggled(true)
                window.location.reload()
            }
        })
    }

    let sendEmailAgent = (bId) => {
        //console.log(bId)
        document.getElementById("sendEmail").innerText = "Sending..."
        const dataLS = localStorage.getItem(adminAuthToken);
        if (!dataLS) {
            throw new Error('No authentication token found.');
        }
        const parsedData = JSON.parse(dataLS);
        axios.get(Server_URL + "admin/sendFlightEmail/" + bId, {
            headers: {
                'Authorization': `Bearer ${parsedData.idToken}`
            }
        }).then((res) => {
            console.log(res)
            if (res.data.error === false) {
                Swal.fire({icon: 'error', title: res.data.message});
                document.getElementById("sendEmail").innerText = "Email credit note"

            } else {
                document.getElementById("sendEmail").innerText = "Email credit note"
                Swal.fire({icon: 'success', title: res.data.message});
            }
        })
    }

    // if (isCheckingStatus === "Cancelled" || isCheckingStatus === "Rejected") {
    //     const dataLS = localStorage.getItem(adminAuthToken);
    //     if (!dataLS) {
    //         throw new Error('No authentication token found.');
    //     }
    //     const parsedData = JSON.parse(dataLS);
    //     axios.get(ipAddress + "admin/flight-fetch-final-amount/" + bookingId, {
    //         headers: {
    //             'Authorization': `Bearer ${parsedData.idToken}`,
    //             'Content_Type': 'application-json'
    //         }
    //     }).then((res) => {
    //         console.log("After cancellation--")
    //         console.log(res.data.data[0])
    //         if (res.data.error === false) {
    //             setAmendmentCharge(res.data.data[0].finalAmendmentCharge)
    //             setWyCanInvNo(res.data.data[0].credit_note_number)
    //         }
    //     })
    // }

    return (

        <div>
            <PageTitle motherMenu="Flights" activeMenu="Cancellation Queue Details" pageContent="Cancellation Queue Details" />

            {loader ? <div>
                <span className="spinner-border text-primary"></span>
            </div> :
            <div className="table-responsive">
                <table className="table fs-12">
                    <thead>
                    <tr className='fs-12'>
                        <th colSpan={"10"} className={"text-center fs-4"}>Basic Info.</th>
                    </tr>
                    <tr className="text-center fs-12">
                        <th style={{whiteSpace: "pre-wrap"}}>Passenger Info.</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Sector</th>
                        <th>Journey</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Airline Code</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Ticket No.</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Pnr No.</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Bill No. & Date</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Travel Date</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Fare Type</th>
                        <th style={{whiteSpace: "pre-wrap"}}>Flight Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        cancelDetail.map((item, ind) => (
                            <tr key={ind} className={"text-center"}>
                                <td>
                                    {item.salutation + " " + item.passenger_name} {" "}
                                    ({item.pax_type === "A" ? "Adult" : item.pax_type === "C" ? "Child" : "Infant"})
                                </td>
                                <td>{item.sector}</td>
                                <td>{item.journey === "D" ? "Domestic" : "International"}</td>
                                <td>{item.airline_code}</td>
                                <td>{item.ticket_no}</td>
                                <td>{item.airline_pnr}</td>
                                <td> {formatDate(item.bill_date)} ({item.bill_no})</td>
                                <td>{item.travel_date.split("T")[0]}</td>
                                <td>{item.fare_type}</td>
                                <td>{item.flight_number}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>

                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <table className={"table table-sm"}>
                        <thead>
                        <tr>
                            <th colSpan={"11"} className={"text-center fs-4"}>Fare BreakUp</th>
                        </tr>
                        <tr className={"text-center"}>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Pax Name</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Markup</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Commission</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>TDS</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Base Fare <br/> (AED)</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Commission</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Discounted Price</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Taxes and Other Charges</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Cancellation Charges</th>
                            <th className='fs-12' style={{whiteSpace: "pre-wrap"}}>Final Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cancelDetail.map((item, index) => (
                            <>
                                <tr key={index} className="text-center fs-12">
                                    <td> {item.salutation + " " + item.passenger_name}</td>
                                    <td>AED {item.markup_per_pax == null ? "0" : item.markup_per_pax}</td>
                                    <td>AED {item.commission == null ? "0" : item.commission}</td>
                                    <td>AED {item.total_ssr_amount == null ? "0" : item.total_ssr_amount}</td>
                                    <td>
                                        <CInputGroup className="flex-nowrap">
                                            {/*<CInputGroupText id="addon-wrapping">AED</CInputGroupText>*/}
                                            <input className="form-control"
                                                   type="number"
                                                   id={"base_fare" + item.cancel_detail_id}
                                                   placeholder="0"
                                                   readOnly
                                                   {...register('base_fare' + item.cancel_detail_id)}
                                                   defaultValue={parseFloat(item.base_fare)}
                                            />
                                        </CInputGroup>
                                    </td>
                                    <td>AED {item.commission == null ? "0" : item.commission}</td>
                                    <td>
                                        <CInputGroup className="flex-nowrap">
                                            {/*<CInputGroupText id="addon-wrapping">AED</CInputGroupText>*/}
                                            <input className="form-control"
                                                   type="number"
                                                   id={"discountedPrice" + item.cancel_detail_id}
                                                   placeholder="0"
                                                   readOnly
                                                   {...register('discountedPrice' + item.cancel_detail_id, {required: true})}
                                                   defaultValue={parseFloat(item.base_fare) - parseFloat(item.commission)}
                                            />
                                        </CInputGroup>


                                        <CFormInput
                                            type="hidden"
                                            id={"cancel_id"}
                                            placeholder="0"
                                            readOnly
                                            {...register('cancel_id', {required: true})}
                                            // defaultValue={item.cancel_id[0]}
                                            defaultValue={location.state.row.cancel_id}
                                        />
                                        <CFormInput
                                            type="hidden"
                                            id={"request_type"}
                                            placeholder="0"
                                            {...register('request_type', {required: true})}
                                            // defaultValue={item.cancel_id[0]}
                                            defaultValue={location.state.row.request_type}
                                        />
                                    </td>

                                    <td>
                                        <strong>AED</strong>
                                        {(parseFloat(item.markup_per_pax ?? 0) +
                                            parseFloat(item.passenger_additional_tax ?? 0) +
                                            parseFloat(item.passenger_other_charges ?? 0) + parseFloat(item.total_ssr_amount ?? 0)
                                            + parseFloat(item.passenger_service_fee ?? 0) + parseFloat(item.yq_tax ?? 0) + parseFloat(item.yr_tax ?? 0) + parseFloat(item.k3_tax ?? 0)).toFixed(2)}

                                    </td>
                                    <td>
                                        {(isCheckingStatus === "Cancelled" || isCheckingStatus === "Rejected" || item.cancel_status_code === 2) ? (
                                            <>AED {item.cancellation_charge}</>
                                        ) : (
                                            <CInputGroup className="flex-nowrap">
                                                <CInputGroupText id="addon-wrapping">AED</CInputGroupText>
                                                <CFormInput
                                                    type="text"
                                                    onKeyUp={(e) => calcFinalAmt(e, item.cancel_detail_id)}
                                                    {...register('cancelCharge' + item.cancel_detail_id, {
                                                        required: true,
                                                        pattern: {
                                                            value: /^[0-9]+$/,
                                                            message: 'Only numbers are allowed',
                                                        },
                                                    })}
                                                    defaultValue="0"
                                                    style={{
                                                        MozAppearance: 'textfield',
                                                        WebkitAppearance: 'none',
                                                        appearance: 'none',
                                                    }}
                                                    id={"cancelCharge" + item.cancel_detail_id}
                                                />
                                            </CInputGroup>
                                        )}
                                    </td>
                                    <td>
                                        {(isCheckingStatus !== "Cancelled" || isCheckingStatus !== "Rejected") ? (
                                            <CInputGroup className="flex-nowrap">
                                                <CInputGroupText>AED</CInputGroupText>
                                                <CFormInput
                                                    type="number"
                                                    placeholder="0"
                                                    readOnly
                                                    {...register('finalAmount' + item.cancel_detail_id)}
                                                    defaultValue={
                                                        (parseFloat(item.base_fare ?? 0) + parseFloat(item.markup_per_pax ?? 0) +
                                                            parseFloat(item.passenger_additional_tax ?? 0) +
                                                            parseFloat(item.passenger_other_charges ?? 0)
                                                            + parseFloat(item.passenger_service_fee ?? 0) +
                                                            parseFloat(item.yq_tax ?? 0) +
                                                            parseFloat(item.k3_tax ?? 0) + parseFloat(item.total_ssr_amount ?? 0) +
                                                            parseFloat(item.yr_tax ?? 0)).toFixed(2) -
                                                        (item.commission ? parseFloat(item.commission) : 0)
                                                    }
                                                />
                                            </CInputGroup>
                                        ) : (
                                            <p>
                                                AED{' '}
                                                {(parseFloat(item.refund_amount)).toFixed(2)}
                                            </p>
                                        )}
                                        <CFormInput
                                            type="hidden"
                                            placeholder="0"
                                            readOnly
                                            {...register('newPrice' + item.cancel_detail_id)}
                                            defaultValue={
                                                (parseFloat(item.base_fare ?? 0) + parseFloat(item.markup_per_pax ?? 0) +
                                                    parseFloat(item.passenger_additional_tax ?? 0) +
                                                    parseFloat(item.passenger_other_charges ?? 0)
                                                    + parseFloat(item.passenger_service_fee ?? 0) +
                                                    parseFloat(item.yq_tax ?? 0) +
                                                    parseFloat(item.k3_tax ?? 0) + parseFloat(item.total_ssr_amount ?? 0) +
                                                    parseFloat(item.yr_tax ?? 0)).toFixed(2) -
                                                (item.commission ? parseFloat(item.commission) : 0)
                                            }
                                        />
                                    </td>
                                </tr>

                            </>
                        ))}

                        {/*-------------------------------------------------------------------------------------*/}
                        {/* Total Amount */}
                        <tr>
                            <td colSpan={"8"} className={"text-end pt-3"}>Total Amount:</td>
                            <td colSpan={"2"} className={"text-end"}>
                                {(isCheckingStatus !== "Cancelled" || isCheckingStatus !== "Rejected") ?
                                    <CInputGroup className="flex-nowrap">
                                        <CInputGroupText>AED</CInputGroupText>
                                        <CFormInput type={"number"} placeholder="0" aria-label="Final Amount"
                                                    {...register('totalAmount')} readOnly
                                                    id={"totalAmount"} aria-describedby="addon-wrapping">
                                        </CFormInput>
                                    </CInputGroup> :
                                    <p>AED {grandTotal - totalAmendmentCharge}</p>}
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={"8"} className={"text-end pt-3"}>Service Charge:</td>
                            <td colSpan={"2"} className={"text-end"}>
                                {(isCheckingStatus === "Cancelled" || isCheckingStatus === "Rejected") ?
                                    <p>AED {cancelDetail[0].service_charge}</p>

                                    : <CInputGroup className="flex-nowrap">
                                        <CInputGroupText>AED</CInputGroupText>
                                        <CFormInput type={"number"} aria-label="Final Amount"
                                                    {...register('serviceCharge', {
                                                        required: true, pattern: {
                                                            value: /^[0-9][0-9]*$/,
                                                            message: 'Only numbers are allowed'
                                                        }
                                                    })} defaultValue={"0"}
                                                    onKeyUp={(e) => addServiceCharge(e)}

                                                    id={"serviceCharge"} aria-describedby="addon-wrapping"
                                        ></CFormInput>
                                    </CInputGroup>
                                }

                            </td>
                        </tr>

                        <tr>
                            <td colSpan={"8"} className={"text-end pt-3"}>VAT @ 5%:</td>
                            <td colSpan={"2"} className={"text-end"}>
                                {(isCheckingStatus === "Cancelled" || isCheckingStatus === "Rejected") ?

                                    <p>AED {cancelDetail[0].vat}</p>
                                    :
                                    <CInputGroup className="flex-nowrap">
                                        <CInputGroupText>AED</CInputGroupText>
                                        <CFormInput type={"number"} placeholder="0" aria-label="Final Amount"
                                                    {...register('gst')} readOnly
                                                    id={"gst"} aria-describedby="addon-wrapping"
                                                    defaultValue={0}></CFormInput>
                                    </CInputGroup>
                                }

                            </td>
                        </tr>
                        <tr>
                            <td colSpan={"8"} className={"text-end pt-3"}>Refund Amount:</td>
                            <td colSpan={"2"} className={"text-end"}>
                                {isCheckingStatus !== "Cancelled" ?
                                    <CInputGroup className="flex-nowrap">
                                        <CInputGroupText>AED</CInputGroupText>
                                        <CFormInput type={"number"} placeholder="0" aria-label="Final Amount"
                                                    {...register('grandTotal')} readOnly
                                                    id={"grandTotal"} aria-describedby="addon-wrapping"
                                                    defaultValue={0}></CFormInput>
                                    </CInputGroup> :
                                    <>{parseFloat(cancelDetail[0].finalRefundAmt).toFixed(2)}</>
                                }

                            </td>
                        </tr>
                        <tr>
                            <td colSpan={"8"} className={"text-end pt-3"}>Remarks:</td>
                            <td colSpan={"2"} className={"text-end"}>
                                {(isCheckingStatus === "Cancelled" || isCheckingStatus === "Rejected") ? (
                                    <h6 className={"text-dark"}>{cancelDetail[0].remarks}</h6>
                                ) : (
                                    <div>
                                        <CInputGroup className="flex-nowrap">
                                            <CFormTextarea
                                                placeholder="Enter your remarks"
                                                aria-label="Remarks"
                                                {...register('remarks', {required: 'This field is required'})}
                                                id="remarks"
                                                aria-describedby="addon-wrapping"
                                            ></CFormTextarea>
                                        </CInputGroup>
                                        {/* Display validation error */}
                                        {errors.remarks && (
                                            <p className="text-danger mt-1" style={{fontSize: '0.875rem'}}>
                                                {errors.remarks.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={"6"}></td>
                            <td colSpan={"4"} className={"text-end"}>
                                {
                                    isCheckingStatus === "Cancelled" ? (
                                            <div className="d-flex align-items-center justify-content-end">
                                                <Link target={"_blank"}
                                                      to={`http://tdo.webyatra.in/CtrlReporting/InvoiceReports?PNRNO=${wyCanInvNo}&CN=Y&BillTyp=AIR&Brnid=&ReportType=CNK&Typeofreport=undefined&DatewiseStartdate=&DatewiseEnddate=&Difformat=undefined&Pstartdate=&Pendate=&Partycode=&StartInvno=undefined&EndInvno=undefined&Refund=false&Userid=SUP&EmailOpt=false&EmailId=&Maindb=dFviql6SMgxLGyjtG+maP1f3VyY3Q+yPmHJV/COkf08=&Currdb=dFviql6SMgxLGyjtG+maP1f3VyY3Q+yPmHJV/COkf08=&User=5b17FYTyIWKgWzEFeIG9mg==&PWD=zd4y5Vh4jQttRBFvF3ddx3UORdIfAiNLoPH8OphzTEo=&IP=cT+Cv6OTTj+7n77wBCqGSWhj5GLKM9yVfOrIIc/Rz6vSdjyLNYeLR5idxHg92T8L&InvFormat=InvPDF&OrderBy=Billno&ClubMischg=CLN&Name=&Address=&State=&City=&Walkin=false&PdfAttach=false&MergePDF=false&RmPrint=true&Barcode=true&RptLang=en&PrintDisc=true`}>
                                                    <CButton type={"button"} download target={"_blank"} style={{
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        border: 'black',
                                                    }}><i className={"fa fa-download"}></i> Download</CButton>
                                                </Link>
                                                <Form.Group className=" ms-2 me-2 d-flex justify-content-start">
                                                    {showHidAgent === "show" ?
                                                        <Form.Check
                                                            onClick={() => showHideAgent(bookingId, showHidAgent !== "show" ? "hide" : "show")}
                                                            type="switch"
                                                            id="custom-switch"
                                                            onChange={() => showHideAgent(bookingId, showHidAgent === "show" ? "hide" : "show")}
                                                            checked={true}
                                                            label="Show Credit Note to Agent"
                                                        /> :
                                                        <Form.Check
                                                            onClick={() => showHideAgent(bookingId, showHidAgent !== "show" ? "show" : "hide")}
                                                            type="switch"
                                                            id="custom-switch"
                                                            // onChange={() => showHideAgent(bookingId, showHidAgent === "show" ? "hide" : "show")}

                                                            label="Show/Hide Credit Note to Agent"
                                                        />
                                                    }
                                                </Form.Group>

                                                {showHidAgent === "show" ?
                                                    <button type={"button"}
                                                            id={"sendEmail"}
                                                            onClick={() => sendEmailAgent(bookingId)}
                                                            className={"btn btn-success text-white"}>
                                                        Email Credit Note
                                                    </button>
                                                    : <></>}
                                            </div>)
                                        : isCheckingStatus === "Rejected" ? (
                                                <h4 className={"text-danger"}>This cancellation has been Rejected</h4>) :
                                            <>
                                                <CButton type={"submit"} id={"cancelCR"} style={{
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    border: 'black',
                                                }} onClick={() => handleButtonClick('cancelCR')}>Cancel Request</CButton>
                                                {" "}
                                                <CButton type={"submit"} id={"issueCR"} style={{
                                                    backgroundColor: 'green',
                                                    color: 'white',
                                                    border: 'black',
                                                }} onClick={() => handleButtonClick('issueCR')}>Issue Credit Note</CButton>

                                            </>
                                }

                            </td>
                        </tr>

                        </tbody>
                    </table>
                </form>
            </div>}
        </div>)
}
export default FlightCancellationDetails;
