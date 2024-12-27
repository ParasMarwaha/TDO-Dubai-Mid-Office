import React, {useEffect, useState} from "react";
import {useParams, useLocation, useNavigate, Link} from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";
import {CCard, CCardBody, CCardHeader} from "@coreui/react";
import Modal from "react-bootstrap/Modal";
import UpdateFlightTicketDetails from "../../components/Forms/UpdateFlightTicketDetails.jsx";
import AddNewPax from "../../components/Forms/AddNewPax.jsx";
import EditPax from "../../components/Forms/EditPax.jsx";
import EditSegment from "../../components/Forms/EditSegment.jsx";
import EditSector from "../../components/Forms/EditSector.jsx";
import EditSsr from "../../components/Forms/EditSsr.jsx";
import PageTitle from "../../layouts/PageTitle.jsx";


let SearchBookingDetails = () => {
    let [loader, setLoader] = useState(true)
    let [booking, setBooking] = useState([]);
    let [passengerJson, setPassengerJson] = useState([]);
    let [sectorJson, setSectorJson] = useState([]);
    let [ssrJson, setSsrJson] = useState([]);
    let [segmentJson, setSegmentJson] = useState([]);
    let [agent, setAgent] = useState([]);
    let [supplier, setSupplier] = useState("")
    let [bookingId, setBookingId] = useState("")
    const {bId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // Flight details modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // pax details modal
    const [paxShow, setPaxShow] = useState(false);
    const paxHandleClose = () => setPaxShow(false);
    const paxHandleShow = () => setPaxShow(true);
    //edit pax details modal
    const [editPaxShow, setEditPaxShow] = useState(false);
    const editPaxHandleClose = () => setEditPaxShow(false);
    const [selectedPax, setSelectedPax] = useState(null); // State to hold the selected passenger
    const editPaxHandleShow = (pax) => {
        console.log("Pax---")
        console.log(pax)
        setSelectedPax(pax); // Store the selected passenger's details in state
        setEditPaxShow(true); // Show the modal
    };

    // edit Segments
    const [segmentShow, setSegmentShow] = useState(false);
    const segmentHandleClose = () => setSegmentShow(false);
    const [selectedSegment, setSelectedSegment] = useState(null); // State to hold the selected passenger
    const segmentHandleShow = (segment) => {
        console.log("Segment---")
        console.log(segment)
        setSelectedSegment(segment); // Store the selected passenger's details in state
        setSegmentShow(true); // Show the modal
    };
    // edit sector
    const [sectorShow, setSectorShow] = useState(false);
    const sectorHandleClose = () => setSectorShow(false);
    const [selectedSector, setSelectedSector] = useState(null); // State to hold the selected passenger
    const sectorHandleShow = (sector) => {
        console.log("Sector---")
        console.log(sector)
        setSelectedSector(sector); // Store the selected passenger's details in state
        setSectorShow(true); // Show the modal
    };
    // edit ssr
    const [ssrShow, setSsrShow] = useState(false);
    const ssrHandleClose = () => setSsrShow(false);
    const [selectedSsr, setSelectedSsr] = useState(null); // State to hold the selected passenger
    const ssrHandleShow = (ssr) => {
        console.log("ssr---")
        console.log(ssr)
        setSelectedSsr(ssr); // Store the selected passenger's details in state
        setSsrShow(true); // Show the modal
    };


    useEffect(() => {
        if (!location.state.id) {
            navigate("/flight-stats2.0")
            return false;
        }
        fetchDetails(location.state.id).then();
        setBookingId(location.state.id)
        // console.log("In Use Effect ---"+bId)
    }, []);

    async function fetchDetails(id) {

        let dataLS = localStorage.getItem(adminAuthToken);
        if (dataLS) {
            dataLS = JSON.parse(dataLS);
        }
        axios.get(Server_URL + "admin/getFlightBookingDetailData/" + id, {
            headers: {
                'Authorization': `Bearer ${dataLS.idToken}`,
                'Content_Type': 'application-json'
            }
        })
            .then((response) => {
                 console.log(response.data)
                // console.log(JSON.parse(response.data.recordset.booking[0].PassengerJson))
                setAgent(response.data.data);
                setBooking(response.data.recordset[0])
                setLoader(false)
                setPassengerJson(response.data.recordset[0].PassengerJson)
                setSectorJson(response.data.recordset[0].SectorJson)
                setSegmentJson(response.data.recordset[0].SegmentJson)
                // console.log(JSON.parse(response.data.recordset.booking[0].PassengerJson))
            })
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date);
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} ${month},${year} ${hours}:${minutes}`;
    }

    function formatDate1(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(date);
        const year = date.getFullYear();
        return `${day} ${month},${year}`;
    }

    return (
        <div>
            <PageTitle motherMenu="" activeMenu="Flights/Search Booking Details" pageContent="Flights/Search Booking Details" />

            {/*<div className={"container-fluid"}>*/}
            {
                loader ?
                    <>
                        <span className="spinner-border text-primary"></span>
                    </>
                    :
                    <>
                        <CCard className={"mb-4 w-100"}>
                            <CCardHeader className={"d-flex justify-content-center"}>
                                <h2>Flight Voucher for {bookingId}</h2>
                            </CCardHeader>
                        </CCard>

                        <CCard className={"mb-0"}>
                            <CCardHeader>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className={"btn-group d-flex flex-wrap gap-2"}>
                                            <Link to={"/print-ticket"} state={{ id: booking.booking_id }}>
                                                <button type={"button"} className={"btn btn-sm btn-outline-primary"}>Print Ticket</button>
                                            </Link>
                                            <button type={"button"} className={"btn btn-sm btn-outline-primary"}>Email
                                                Ticket
                                            </button>
                                            <button type={"button"} className={"btn btn-sm btn-outline-primary"}>Sector Cancellation</button>
                                            <button type={"button"} className={"btn btn-sm btn-outline-primary"}>Partial Cancellation</button>
                                            <button type={"button"} className={"btn btn-sm btn-outline-primary"}>Full Cancellation</button>
                                        </div>
                                    </div>
                                </div>
                            </CCardHeader>
                        </CCard>

                        {
                            agent.map((item, index) => (
                                <CCard key={index} className="mb-3">
                                    <CCardHeader className=" border-0">
                                        <h3 className="text-center">Agency Details</h3>
                                    </CCardHeader>
                                    <hr/>
                                    <CCardBody className="p-4">
                                        <div className="d-flex flex-wrap mb-3">
                                            <div className=" mb-2 col-lg-3">
                                                <strong>Id:</strong> <br /> {item.id}
                                            </div>
                                            <div className=" mb-2 col-lg-3">
                                                <strong>Company Name:</strong> <br /> {item.establishment_name}
                                            </div>
                                            <div className=" mb-2 col-lg-3">
                                                <strong>Business Type:</strong> <br /> {item.nature_of_business}
                                            </div>
                                            <div className="mb-2 col-lg-3">
                                                <strong>Contact No.:</strong> <br /> {item.mobile}
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            <div className="me-4 mb-2">
                                                <strong>Email:</strong> <br /> {item.email}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Address:</strong> <br /> {item.address}
                                            </div>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            ))
                        }


                        <CCard className="mb-4">
                            <CCardHeader>
                                    <div className="col-lg-8">
                                        <div className="fs-3 fw-bold">Flight Ticket Details</div>
                                    </div>
                                    <div className="col-lg-4 text-end">
                                        <button
                                            type="button"
                                            onClick={handleShow}
                                            className="btn btn-sm btn-primary">
                                            <i className="fa fa-pencil me-1"></i> Edit Details
                                        </button>
                                    </div>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <strong>Transaction Id:</strong> {booking.transaction_id}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Booking Ref. No.:</strong> {booking.booking_id}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Booking Date & Time:</strong> {formatDate(booking.booking_date_time)}
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-lg-4">
                                        <strong>Trip:</strong> Flight
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Trip Type:</strong> {booking.trip_type}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Booking Status:</strong> {booking.ticket_status}
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-lg-4">
                                        <strong>Total No. of Pax:</strong> {booking.total_no_of_pax}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Adult:</strong> {booking.total_adult}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Child:</strong> {booking.total_child}
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-lg-4">
                                        <strong>Infant:</strong> {booking.total_infant}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Supplier:</strong> {booking.supplier}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Mobile No.:</strong> {agent[0]?.PhoneNumber}
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-lg-4">
                                        <strong>Email Id:</strong> {booking.agent_email}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Fare Type:</strong> {sectorJson[0]?.fare_type}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Airline:</strong> {sectorJson[0]?.airline_name} ({sectorJson[0]?.airline_code})
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-lg-4 mt-2">
                                        <strong>Flight No.:</strong> {sectorJson[0]?.flight_number}
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>

                        <CCard className="mb-4">
                            <CCardHeader>
                                    <div className="col-lg-9">
                                        <div className="fs-3 fw-bold">Passenger/PAX Details</div>
                                    </div>
                                    <div className="col-lg-3 text-end">
                                        <button
                                            onClick={paxHandleShow}
                                            className="btn btn-sm btn-success text-white">
                                            <i className="fa fa-plus me-1"></i> Add New Pax
                                        </button>
                                    </div>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row">
                                    <div className="col-lg-12">
                                        {loader ? (
                                            <div></div>
                                        ) : (
                                            <>
                                                <div className="table-responsive">
                                                    <table className="table table-sm">
                                                        <thead>
                                                        <tr className="text-center">
                                                            <th className="bg-danger text-white fs-12">Sr. No.</th>
                                                            <th className="bg-danger text-white fs-12">Salutation</th>
                                                            <th className="bg-danger text-white fs-12">First Name</th>
                                                            <th className="bg-danger text-white fs-12">Last Name</th>
                                                            <th className="bg-danger text-white fs-12">Pax Type</th>
                                                            <th className="bg-danger text-white fs-12">Date Of Birth</th>
                                                            <th className="bg-danger text-white fs-12">Passport No.</th>
                                                            <th className="bg-danger text-white fs-12">Passport Expiry</th>
                                                            <th className="bg-danger text-white fs-12">Booking Status</th>
                                                            <th className="bg-danger text-white fs-12">Ticketing Status</th>
                                                            <th className="bg-danger"> </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {passengerJson.map((bdItem, bdIndex) => (
                                                            <tr key={bdIndex} className="text-center">
                                                                <td className="fs-12">{bdIndex + 1}</td>
                                                                <td className="fs-12">{bdItem.salutation}</td>
                                                                <td className="fs-12 text-capitalize">{bdItem.first_name}</td>
                                                                <td className="fs-12 text-capitalize">{bdItem.last_name}</td>
                                                                <td className="fs-12">{bdItem.pax_type}</td>
                                                                <td className="fs-12">{formatDate1(bdItem.date_of_birth)}</td>
                                                                <td className="fs-12">{bdItem.passport_no || "N/A"}</td>
                                                                <td className="fs-12">{bdItem.passport_expiry || "N/A"}</td>
                                                                <td className="fs-12">{bdItem.booking_status}</td>
                                                                <td className="fs-12">{bdItem.ticketing_status}</td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => editPaxHandleShow(bdItem)}
                                                                        className="btn btn-sm btn-warning text-black">
                                                                        <i className="fa fa-pencil"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>

                        <CCard className="mb-4">
                            <CCardHeader>
                                    <div className="col-lg-9">
                                        <div className="fs-3 fw-bold">SSR Details</div>
                                    </div>
                                    <div className="col-lg-3 text-end">
                                        {/* You can enable the add SSR button here if needed */}
                                        {/* <button type="button" className="btn btn-success"><i className="fa fa-plus"></i> Add new SSR</button> */}
                                    </div>

                            </CCardHeader>
                            <CCardBody>
                                <div className="row">
                                    {passengerJson.length > 0 ? (
                                        passengerJson.map((passenger, index) => (
                                            <div key={index}>
                                                <div className="row bg-danger text-white p-2">
                                                    <div className="col-lg-9">
                                                        <h5 className="text-white">Passenger {index + 1} ({passenger.first_name} {passenger.last_name})</h5>
                                                    </div>
                                                    <div className="col-lg-3 text-end">
                                                        {passenger.ssr_data && passenger.ssr_data.length > 0 ? (
                                                            <button type="button"
                                                                    style={{background:"yellowgreen"}}
                                                                    className="btn btn-sm text-black" onClick={() => ssrHandleShow(passenger)}>
                                                                <i className="fa fa-pencil"></i> Edit SSR
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <table className="table">
                                                    <thead>
                                                    <tr className="text-center">
                                                        <th className="fs-10">SSR Type</th>
                                                        <th className="fs-10">Description</th>
                                                        <th className="fs-10">Price</th>
                                                        <th className="fs-10">Remarks</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="text-center">
                                                    {passenger.ssr_data && passenger.ssr_data.length > 0 ? (
                                                        passenger.ssr_data.map((ssr, ssrIndex) => (
                                                            <tr key={ssrIndex}>
                                                                <td className="text-capitalize">{ssr.ssr_type}</td>
                                                                <td>{ssr.description}</td>
                                                                <td><strong>Aed</strong> {ssr.price}</td>
                                                                <td>{ssr.remarks}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4">No SSR Data</td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-danger">No SSR data available</p>
                                    )}
                                </div>
                            </CCardBody>
                        </CCard>

                        <CCard className={"mb-4"}>
                            <CCardHeader>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className={"fs-3 fw-bold"}>Sector Details</div>
                                    </div>

                                </div>
                            </CCardHeader>


                            <CCardBody>
                                <div className="row">
                                    <div className="col-lg-12">

                                        {loader ?
                                            <div></div> :
                                            <>

                                                {sectorJson.map((bdItem, bdIndex) => (
                                                    <div className={"row"} key={bdIndex}>
                                                        <CCardHeader className={"bg-danger text-white p-1"}>
                                                                <div className="col-lg-9">
                                                                    <h5 className="text-white"><strong></strong> {bdItem.origin} - {bdItem.destination}</h5>
                                                                </div>
                                                                <div className="col-lg-3 text-end">
                                                                    <button onClick={() => sectorHandleShow(bdItem)}
                                                                            style={{background:"yellowgreen"}}
                                                                            className={"btn btn-sm text-black"}>
                                                                        <i className={"fa fa-pencil"}></i> Edit
                                                                    </button>
                                                                </div>
                                                        </CCardHeader>
                                                        <CCardBody>
                                                            <div className="row">
                                                                <div className="col-lg-3">
                                                                    <strong>Duration</strong> <br/>
                                                                    {bdItem.duration}
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <strong>Departure Date & Time:</strong> <br/>
                                                                    {formatDate(bdItem.departure)}
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <strong>Departure Airport Name & Terminal</strong> <br/>
                                                                    {bdItem.departure_airport_name + " (Terminal " + bdItem.departure_terminal + ")"}
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Arrival Date & Time:</strong> <br/>
                                                                    {formatDate(bdItem.arrival)}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Fare Type</strong> <br/>
                                                                    {bdItem.fare_type}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Arrival Airport Name & Terminal:</strong> <br/>
                                                                    {bdItem.arrival_airport_name} ({bdItem.arrival_terminal})
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Flight Number: </strong> <br/>
                                                                    {bdItem.flight_number}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>GDS PNR</strong> <br/>
                                                                    {bdItem.gdspnr}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Base Fare</strong> <br/>
                                                                    <b>Aed</b> {bdItem.base_fare}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Offered Fare</strong> <br/>
                                                                    <b>Aed</b> {bdItem.offered_fare}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Published Fare</strong> <br/>
                                                                    <b>Aed</b> {bdItem.published_fare}
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Agent Markup</strong> <br/>
                                                                    <b>Aed</b> {bdItem.agent_markup}
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Service Fee</strong> <br/>
                                                                    <b>Aed</b> {bdItem.service_fee}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Total SSR Amount</strong> <br/>
                                                                    <b>Aed</b> {bdItem.total_ssr_amount}
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Additional Taxes:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.additional_taxes}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Tdo Markup:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.tdo_markup}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Commission</strong> <br/>
                                                                    <b>Aed</b> {bdItem.commission}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>TDS on Commission</strong> <br/>
                                                                    <b>Aed</b> {bdItem.tds_on_commission}
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Total Taxes:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.total_tax}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>YQ Tax:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.yq_tax}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>YR Tax:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.yr_tax}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>K3 Tax:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.k3_tax}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Transaction Fee:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.transaction_fee}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Other Charges:</strong> <br/>
                                                                    <b>Aed</b> {bdItem.other_charges}
                                                                </div>

                                                            </div>
                                                        </CCardBody>
                                                    </div>
                                                ))}


                                            </>
                                        }


                                    </div>

                                </div>
                            </CCardBody>


                        </CCard>

                        <CCard className={"mb-4"}>
                            <CCardHeader>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className={"fs-3 fw-bold"}>Segment Details</div>
                                    </div>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <div className="row">
                                    <div className="col-lg-12">

                                        {loader ?
                                            <div></div> :
                                            <>

                                                {segmentJson.map((bdItem, bdIndex) => (
                                                    <div className={"row"} key={bdIndex}>
                                                        <CCardHeader className={"bg-danger text-white p-1"}>
                                                                <div className="col-lg-9">
                                                                    <h5 className="text-white"><strong></strong> {bdItem.origin} - {bdItem.destination}</h5>
                                                                </div>
                                                                <div className="col-lg-3 text-end">
                                                                    <button onClick={() => segmentHandleShow(bdItem)}
                                                                            style={{background:"yellowgreen"}}
                                                                            className={"btn btn-sm text-black"}>
                                                                        <i className={"fa fa-pencil"}></i> Edit
                                                                    </button>
                                                                </div>
                                                        </CCardHeader>
                                                        <CCardBody>
                                                            <div className="row">
                                                                <div className="col-lg-3">
                                                                    <strong>Duration</strong> <br/>
                                                                    {bdItem.duration}
                                                                </div>
                                                                <div className="col-lg-3">
                                                                    <strong>Airline Name</strong> <br/>
                                                                    {bdItem.airline_name}
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Arrival Airport Name & Terminal:</strong> <br/>
                                                                    {bdItem.arrival_airport_name} {bdItem.arrival_terminal !== "" ? "(" + bdItem.arrival_terminal + ")" : ""}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Arrival Date & Time:</strong> <br/>
                                                                    {formatDate(bdItem.arrival)}
                                                                </div>

                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Flight Number: </strong> <br/>
                                                                    {bdItem.flight_number}
                                                                </div>
                                                                <div className="col-lg-3 mb-2">
                                                                    <strong>Departure Airport Name & Terminal: </strong> <br/>
                                                                    {bdItem.departure_airport_name}
                                                                    {bdItem.departure_terminal !== "" ? "(" + bdItem.departure_terminal + ")" : ""}
                                                                </div>


                                                            </div>
                                                        </CCardBody>
                                                    </div>
                                                ))}


                                            </>
                                        }


                                    </div>

                                </div>
                            </CCardBody>
                        </CCard>

                        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl">
                            <Modal.Header closeButton>
                                <h4>Update Flight Ticket Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <UpdateFlightTicketDetails booking={booking} fetchDetails={fetchDetails} handleClose={handleClose}/>
                            </Modal.Body>
                        </Modal>

                        <Modal show={paxShow} onHide={paxHandleClose} backdrop="static" keyboard={false} fullscreen size="xl">
                            <Modal.Header closeButton>
                                <h4>Add New PAX Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <AddNewPax booking_id={bookingId} fetchDetails={fetchDetails} paxHandleClose={paxHandleClose}/>
                            </Modal.Body>
                        </Modal>
                        <Modal show={editPaxShow} onHide={editPaxHandleClose} backdrop="static" keyboard={false} fullscreen
                               size="xl">
                            <Modal.Header closeButton>
                                <h4>Edit PAX Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <EditPax
                                    selectedPax={selectedPax} // Pass selected passenger details
                                    fetchDetails={fetchDetails}
                                    paxHandleClose={editPaxHandleClose}
                                />

                            </Modal.Body>
                        </Modal>
                        <Modal show={segmentShow} onHide={segmentHandleClose} backdrop="static" keyboard={false}
                               size="xl">
                            <Modal.Header closeButton>
                                <h4>Edit Segment Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <EditSegment selectedSegment={selectedSegment} fetchDetails={fetchDetails}
                                             handleClose={segmentHandleClose}/>
                            </Modal.Body>
                        </Modal>
                        <Modal show={sectorShow} onHide={sectorHandleClose} backdrop="static" keyboard={false}
                               size="xl">
                            <Modal.Header closeButton>
                                <h4>Edit Sector Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <EditSector selectedSector={selectedSector} fetchDetails={fetchDetails}
                                            handleClose={sectorHandleClose}/>
                            </Modal.Body>
                        </Modal>

                        <Modal show={ssrShow} onHide={ssrHandleClose} backdrop="static" keyboard={false}
                               size="xl">
                            <Modal.Header closeButton>
                                <h4>Edit SSR Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <EditSsr selectedSsr={selectedSsr} fetchDetails={fetchDetails}
                                         handleClose={ssrHandleClose}/>
                            </Modal.Body>
                        </Modal>
                    </>

            }
            {/*</div>*/}

        </div>
    )
}

export default SearchBookingDetails
