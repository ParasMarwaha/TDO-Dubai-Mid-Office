import React, {useEffect, useState} from "react";
import {useParams, useLocation, useNavigate, Link} from 'react-router-dom';
import axios from "axios";
import Swal from "sweetalert2";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";
import {CCard, CCardBody, CCardHeader} from "@coreui/react";
import Modal from "react-bootstrap/Modal";
import UpdateHotelDetails from "../../components/Forms/UpdateHotelDetails.jsx";
import AddNewPax from "../../components/Forms/AddNewPax.jsx";
import EditPax from "../../components/Forms/UpdateGuestDetails.jsx";
import PageTitle from "../../layouts/PageTitle.jsx";
import UpdateGuestDetails from "../../components/Forms/UpdateGuestDetails.jsx";


let HotelBookingDetails = () => {
    let [loader, setLoader] = useState(true)
    let [booking, setBooking] = useState([]);
    let [passengerJson, setPassengerJson] = useState([]);
    let [agent, setAgent] = useState([]);
    let [bookingId, setBookingId] = useState("")
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


    useEffect(() => {
        if (!location.state.id) {
            navigate("/hotels-bookings")
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
        axios.get(Server_URL + "admin/getHotelBookingDetailData/" + id, {
            headers: {
                'Authorization': `Bearer ${dataLS.idToken}`,
                'Content_Type': 'application-json'
            }
        })
            .then((response) => {
                console.log(response.data)
                setAgent(response.data.data);
                setBooking(response.data.recordset[0])
                setLoader(false)
                setPassengerJson(response.data.details)

            })
    }

    const checkInDate = new Date(booking.checkIN);
    const checkOutDate = new Date(booking.checkOut);
    // Calculate the difference in days
    const totalNights = Math.max(
        Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)),
        0
    );
    const bookingDate = new Date(booking.booking_DateTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div>
            <PageTitle motherMenu="Hotels" activeMenu="/search-booked-flight-details" pageContent="Search Booking Details" />

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
                                <h2>Hotel Voucher for {bookingId}</h2>
                            </CCardHeader>
                        </CCard>

                        {/*<CCard className={"mb-0"}>*/}
                        {/*    <CCardHeader>*/}
                        {/*        <div className="row">*/}
                        {/*            <div className="col-lg-12">*/}
                        {/*                <div className={"btn-group d-flex flex-wrap gap-2"}>*/}
                        {/*                    {booking.booking_status === "Fail" ? (*/}
                        {/*                        <button*/}
                        {/*                            type={"button"}*/}
                        {/*                            className={"btn btn-sm btn-outline-primary"}*/}
                        {/*                        >*/}
                        {/*                            Print Ticket*/}
                        {/*                        </button>*/}
                        {/*                    ) : (*/}
                        {/*                        <Link to={"/print-ticket"} state={{ id: booking.api_booking_id }}>*/}
                        {/*                            <button type={"button"} className={"btn btn-sm btn-outline-primary"}>*/}
                        {/*                                Print Ticket*/}
                        {/*                            </button>*/}
                        {/*                        </Link>*/}
                        {/*                    )}*/}
                        {/*                    /!*<button type={"button"} className={"btn btn-sm btn-outline-primary"}>Sector Cancellation</button>*!/*/}
                        {/*                    /!*<button type={"button"} className={"btn btn-sm btn-outline-primary"}>Partial Cancellation</button>*!/*/}
                        {/*                    /!*<button type={"button"} className={"btn btn-sm btn-outline-primary"}>Full Cancellation</button>*!/*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </CCardHeader>*/}
                        {/*</CCard>*/}

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
                                    <div className="fs-3 fw-bold">Hotel Booking Details</div>
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
                                        <strong>Booking Ref. No.:</strong> {booking.api_booking_id}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Booking Date & Time:</strong> {bookingDate}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Booking Status:</strong> {booking.booking_status}
                                    </div>
                                </div>


                                <div className="row mb-2">
                                    <div className="col-lg-4">
                                        <strong>Total Guest:</strong> {booking.totalPax}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Adult:</strong> {booking.totalAdult}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Child:</strong> {booking.totalChild}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <strong>Check In Date :</strong> {booking.checkIN}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Check Out Date</strong> {booking.checkOut}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Total Nights</strong> {totalNights}
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-lg-4">
                                        <strong>Hotel Name:</strong> {booking.hotelName}
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Hotel Address:</strong> {JSON.parse(booking.hotel_address).line1 ? JSON.parse(booking.hotel_address).line1 : JSON.parse(booking.hotel_address) }
                                    </div>
                                    <div className="col-lg-4">
                                        <strong>Contact No. :</strong> {booking.hotel_phone}
                                    </div>
                                </div>
                            </CCardBody>
                        </CCard>

                        <CCard className="mb-4">
                            <CCardHeader>
                                <div className="col-lg-9">
                                    <div className="fs-3 fw-bold">Passenger/PAX Details</div>
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
                                                            <th className="bg-danger"> </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {passengerJson.map((bdItem, bdIndex) => (
                                                            <tr key={bdIndex} className="text-center">
                                                                <td className="fs-12">{bdIndex + 1}</td>
                                                                <td className="fs-12">{bdItem.salutation}</td> {/* Title (ti) */}
                                                                <td className="fs-12 text-capitalize">{bdItem.firstName}</td> {/* First Name (fN) */}
                                                                <td className="fs-12 text-capitalize">{bdItem.lastName}</td> {/* Last Name (lN) */}
                                                                <td className="fs-12">{bdItem.paxType}</td> {/* Passenger Type (pt) */}
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


                        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} size="xl">
                            <Modal.Header closeButton>
                                <h4>Update Hotel Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <UpdateHotelDetails booking={booking} fetchDetails={fetchDetails} handleClose={handleClose}/>
                            </Modal.Body>
                        </Modal>

                        <Modal show={editPaxShow} onHide={editPaxHandleClose} backdrop="static" keyboard={false} size="xl">
                            <Modal.Header closeButton>
                                <h4>Edit PAX Details</h4>
                            </Modal.Header>
                            <Modal.Body>
                                <UpdateGuestDetails selectedPax={selectedPax} fetchDetails={fetchDetails} paxHandleClose={editPaxHandleClose}/>
                            </Modal.Body>
                        </Modal>
                    </>

            }
            {/*</div>*/}

        </div>
    )
}

export default HotelBookingDetails
