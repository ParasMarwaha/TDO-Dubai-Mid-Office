import { useLocation} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Server_URL, adminAuthToken, Server_URL_FILE} from "../../../helpers/config.js";
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';
import Swal from "sweetalert2";
import PageTitle from "../../layouts/PageTitle.jsx";


let PrintTicket = () => {
    const location = useLocation();
    // console.log(location.state.id);
    let [loader, setLoader] = useState(true)
    let [ticket, setTicket] = useState([]);
    let [sector, setSector] = useState([]);
    let [passenger, setPassenger] = useState([]);
    let [segment, setSegment] = useState([]);
    let [agent, setAgent] = useState([]);
    let [id,setId] = useState("");


    useEffect(() => {
        let dataLS = localStorage.getItem(adminAuthToken);
        if (dataLS) {
            dataLS = JSON.parse(dataLS);
        }
        setId(location.state.id)
        axios.get(Server_URL + "admin/getFlightBookingDetailData/" + location.state.id, {
            headers: {
                'Authorization': `Bearer ${dataLS.idToken}`,
                'Content_Type': 'application-json'
            }
        }).then((response) => {
            // console.log(res)
            if (response.status === 200) {
                if (response.data.error) {
                    Swal.fire({ icon: 'error', title: response.data.message });
                } else {
                    setLoader(false)
                   // Swal.fire({ icon: 'success', title: response.data.message });
                    console.log("Full response----")
                    console.log(response.data)
                    setTicket(response.data.recordset)
                    setSector(response.data.recordset[0].SectorJson)
                    setSegment(response.data.recordset[0].SegmentJson)
                    setPassenger(response.data.recordset[0].PassengerJson)
                    setAgent(response.data.data)
                }
            }

        })
    }, []);

    const exportToPdf = async () => {
        const content = document.getElementById('pdf-content');
        if (!content) {
            alert("Content not found for PDF export!");
            return;
        }

        try {
            // Preload images in the content
            const preloadImages = () => {
                const images = Array.from(content.querySelectorAll('img'));
                const loadPromises = images.map((img) => {
                    if (img.complete) return Promise.resolve(); // Already loaded
                    return new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                    });
                });
                return Promise.all(loadPromises);
            };

            await preloadImages(); // Ensure all images are loaded

            const options = {
                margin: [0.25, 0.5, 0.75, 0.5],
                filename: `Ticket-${location.state?.id || 'default'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
                pagebreak: { mode: ['css', 'legacy'] },
            };

            // Show loading indicator (optional)
            console.log("Generating PDF...");

            await html2pdf().from(content).set(options).save();

            // Hide loading indicator (optional)
            console.log("PDF generated successfully!");
        } catch (error) {
            console.error("Error loading images or exporting PDF:", error);
            alert("An error occurred while exporting the PDF. Please try again.");
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return ''; // Handle cases where duration is undefined or null
        const [hours, minutes] = duration.split(':').map(Number);
        return `${hours} hours and ${minutes} minutes`;
    };

    const formatDurationHR = (duration) => {
        if (!duration) return ''; // Handle cases where duration is undefined or null
        const [hours, minutes] = duration.split(':').map(Number);
        return `${hours} h ${minutes} min`;
    };


    return (
        <div>
            <PageTitle motherMenu="" activeMenu="Flights/Print Ticket" pageContent="Flights/Print Ticket" />

                {loader ?
                    <div>
                        <span className="spinner-border text-primary"></span>
                    </div> :
                    <div>
                        <div className="row mb-2">
                            <div className="col-lg-3 offset-lg-9 text-end">
                                <button type={"button"} onClick={exportToPdf} className="btn btn-sm btn-primary"><i
                                    className={"fa-solid fa-file-pdf"}></i> Export to Pdf
                                </button>
                            </div>
                        </div>
                        <div id="pdf-content" style={{maxWidth: "100%"}}>
                            <div className={"row mb-2"}>
                                <div className={"col-lg-3 text-capitalize text-start"}>
                                    <img src={Server_URL_FILE + agent[0].logo} style={{height: '100px', width: '100px'}}
                                         alt="Logo"/><br/>
                                </div>
                                <div className={"col-lg-3 offset-lg-6 text-capitalize text-start"}>
                                    <strong>{agent[0].establishment_name}</strong><br/>
                                    <strong></strong>{agent[0].address}
                                    <br/>
                                    {"+" + agent[0].mobile}
                                </div>

                            </div>
                            {/*Booking Details*/}
                            <div className="row mb-2">
                                <div className="col-12">
                                    <h4 className="bg-danger text-white py-2 px-2 rounded">Booking Details</h4>
                                </div>
                                <div className="col-12">
                                    <div className="table-responsive table-container">
                                        <table className="table table-bordered align-middle">
                                            <thead className="">
                                            <tr>
                                                <th className={"fs-12 p-1"}>TDO Reference ID</th>
                                                <th className={"fs-12 p-1"}>Booked On</th>
                                                <th className={"fs-12 p-1"}>Trip Type</th>
                                                <th className={"fs-12 p-1"}>Journey Type</th>
                                                <th className={"fs-12 p-1"}>Ticket Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr className="text-center">
                                                <td className={"fs-12 p-1"}>{ticket[0]?.booking_id || "N/A"}</td>
                                                <td className={"fs-12 p-1"}>{ticket[0]?.booking_date_time || "N/A"}</td>
                                                <td className={"fs-12 p-1"}>
                                                    {ticket[0]?.trip_type === "ROUNDTRIP_CUSTOM" || ticket[0]?.trip_type === "ROUNDTRIP"
                                                        ? "Roundtrip"
                                                        : "Oneway"}
                                                </td>
                                                <td className={"fs-12 p-1"}>{ticket[0]?.is_domestic ? "Domestic" : "International"}</td>
                                                <td className={"fs-12 p-1"}>{ticket[0]?.ticket_status || "N/A"}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {sector.map((sec, secIndex) => (
                                <div key={secIndex}>
                                    {/* Sector Header */}
                                        <div className="bg-danger text-white py-2 px-2 rounded">
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <h4 className="text-white">{sec.origin} - {sec.destination}</h4>
                                                </div>
                                                <div className="col-sm-4">
                                                    <img src={"/images/icons/1.png"} alt=""
                                                         style={{width: "100%", height: "100%"}}/>
                                                </div>
                                                <div className="col-sm-4 text-end">
                                                    <h4 className="text-white">Duration: {formatDuration(sec.duration)}</h4>
                                                </div>
                                            </div>
                                        </div>

                                    {/* Segment Table */}
                                    {segment.some(segItem => segItem.sector_id === sec.sector_id) && (
                                        <div className="table-responsive mt-4">
                                            <table className="table table-striped table-bordered align-middle">
                                                <thead className="">
                                                <tr>
                                                    <th className={"fs-12 p-1"}>Flight</th>
                                                    <th className={"fs-12 p-1"}>PNR</th>
                                                    <th className={"fs-12 p-1"}>Departing</th>
                                                    <th className={"fs-12 p-1"}>Departing Airport</th>
                                                    <th className={"fs-12 p-1"}>Arriving Airport</th>
                                                    <th className={"fs-12 p-1"}>Duration / Layover</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {segment
                                                    .filter(segItem => segItem.sector_id === sec.sector_id)
                                                    .map((segItem, segInd) => (
                                                        <tr key={segInd} className="">
                                                            <td className={"fs-12 p-1"}>
                                                                <div className="d-flex flex-column ">
                                                                    <img
                                                                        src={`https://content.airhex.com/content/logos/airlines_${segItem.airline_code}_50_50_s.png`}
                                                                        alt={`${segItem.airline_name} logo`}
                                                                        className="mb-2"
                                                                        style={{width: "25px", height: "25px"}}
                                                                    />
                                                                    <div>
                                                                        <strong>{segItem.airline_name}</strong>
                                                                        <br/>
                                                                        ({segItem.airline_code} - {segItem.flight_number})
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className={"fs-12 p-1"}>{sec.gdspnr || "N/A"}</td>
                                                            <td className={"fs-12 p-1"}>{segItem.departure || "N/A"}</td>
                                                            <td className={"fs-12 p-1"}>
                                                                {segItem.departure_airport_name || "N/A"}
                                                                {segItem.departure_terminal && (
                                                                    <span> (Terminal {segItem.departure_terminal})</span>
                                                                )}
                                                            </td>
                                                            <td className={"fs-12 p-1"}>
                                                                {segItem.arrival_airport_name || "N/A"}
                                                                {segItem.arrival_terminal && (
                                                                    <span> (Terminal {segItem.arrival_terminal})</span>
                                                                )}
                                                            </td>
                                                            <td className={"fs-12 p-1"}>
                                                                { formatDurationHR(segItem.duration) || "N/A"}
                                                                {segItem.layover_time !== "NO_LAYOVER" && (
                                                                    <span> / {segItem.layover_time}</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Passenger Table */}
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered">
                                                    <thead className="">
                                                    <tr>
                                                        <th className={"fs-12 p-1"}>Sr. No. & Name</th>
                                                        <th className={"fs-12 p-1"}>Pax Type</th>
                                                        <th className={"fs-12 p-1"}>Ticket Number</th>
                                                        <th className={"fs-12 p-1"}>Extra Meal</th>
                                                        <th className={"fs-12 p-1"}>Extra Baggage</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {passenger?.some(passItem => passItem.sector_id === sec.sector_id) ? (
                                                        passenger
                                                            .filter(passItem => passItem.sector_id === sec.sector_id)
                                                            .map((passItem, passInd) => (
                                                                <tr key={passInd} className="">
                                                                    <td className={"fs-12 p-1"}>
                                                                        <strong>{passInd + 1}.</strong>{" "}
                                                                        {`${passItem.salutation} ${passItem.first_name} ${passItem.last_name}`}
                                                                    </td>
                                                                    <td className={"fs-12 p-1"}>{passItem.pax_type}</td>
                                                                    <td className={"fs-12 p-1"}>{passItem.ticket_no || "N/A"}</td>
                                                                    <td className={"fs-12 p-1"}>
                                                                        {passItem.ssr_data?.some(ssr => ssr.ssr_type === "meal")
                                                                            ? passItem.ssr_data.find(ssr => ssr.ssr_type === "meal").description
                                                                            : "Nil"}
                                                                    </td>
                                                                    <td className={"fs-12 p-1"}>
                                                                        {passItem.ssr_data?.some(ssr => ssr.ssr_type === "Baggage")
                                                                            ? passItem.ssr_data.find(ssr => ssr.ssr_type === "Baggage").description
                                                                            : "Nil"}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                    ) : (
                                                        <tr>
                                                            <td  colSpan="5" className="text-center fs-12 p-1">
                                                                No passengers found for this sector.
                                                            </td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/*payment details*/}
                            <div className="row mb-2">
                                <div className="col-12">
                                    <h4 className="bg-danger text-white py-2 px-2 rounded">Payment Details</h4>
                                </div>
                                <div className="table-container">
                                    <table className="table table-striped table-bordered">
                                        <thead>
                                        <tr>
                                        <th className={"fs-12 p-1"}>Payment Type</th>
                                            <th className={"fs-12 p-1"}>Platform Fee</th>
                                            <th className={"fs-12 p-1"}>Platform Tax</th>
                                            <th className={"fs-12 p-1"}>Gateway Charges</th>
                                            <th className={"fs-12 p-1"}>Total Amount Paid</th>

                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td className={"fs-12 p-1"}>{ticket[0].payment_type}</td>
                                            <td className={"fs-12 p-1"}><strong>AED</strong> {ticket[0].platform_fee}</td>
                                            <td className={"fs-12 p-1"}><strong>AED</strong> {ticket[0].platform_tax}</td>
                                            <td className={"fs-12 p-1"}><strong>AED</strong> {ticket[0].gateway_charges}</td>
                                            <td className={"fs-12 p-1"}><strong>AED</strong> {ticket[0].customer_amount}</td>
                                        </tr>

                                        </tbody>
                                    </table>

                                </div>
                            </div>

                            <div className="row mb-2">
                                <div className="col-12">
                                    <h4 className="bg-danger text-white py-2 px-2 rounded">Important Information</h4>
                                </div>
                                <div className="row border-bottom border-black p-2 mb-2">
                                    <div className="col-lg-12 col-sm-12">
                                        <ol style={{fontSize: "12px", listStyleType: "decimal"}}>
                                            <li>1. You must web check-in on the airline website and obtain a boarding
                                                pass.
                                            </li>
                                            <li>2. Reach the terminal at least 2 hours prior to the departure for domestic
                                                flights and
                                                4 hours prior to the departure for international flights.
                                            </li>
                                            <li>3. For the departure terminal, please check with the airline first.</li>
                                            <li>4. Date & Time is calculated based on the local time of the
                                                city/destination.
                                            </li>
                                            <li>5. Use the Airline PNR for all correspondence directly with the airline.
                                            </li>
                                            <li>6.
                                                For rescheduling/cancellation within 4 hours of the departure time,
                                                contact the airline directly.
                                            </li>
                                            <li>7.
                                                Your ability to travel is at the sole discretion of the airport
                                                authorities, and we shall not be held responsible.
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-lg-7 col-sm-7 border-right">
                                        <div className="row mb-2">
                                            <div className="col-lg-3 col-sm-3 text-end">
                                                <i className="fa-solid fa-xmark text-danger fs-1"></i>
                                            </div>
                                            <div className="col-lg-9 col-sm-9 text-center fw-bold">
                                                The items are dangerous goods and are not permitted <br/> to be carried
                                                as Hand/Check-In Baggage
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                        <div className="col-lg-2 col-sm-2 offset-lg-1 offset-sm-1 text-start">
                                                <img src="/images/icons/lighter.svg" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/><br/>
                                                <div className={"fs-12"}>Lighters</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/flammableLiquid.png" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/>
                                                <div className={"fs-12"}>Flammable Liquids</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/toxic.webp" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/><br/>
                                                <div className={"fs-12"}> Toxic</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/bleach.svg" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/><br/>
                                                <div className={"fs-12"}> Bleach</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/explosive.svg" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/>
                                                <div className={"fs-12"}> Explosives</div>
                                            </div>
                                        </div>

                                        <div className="row mb-2">
                                            <div className="col-lg-2 col-sm-2 offset-lg-1 offset-sm-1 text-start">
                                                <img src="/images/icons/virus.svg" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/>
                                                <div className={"fs-12"}> Infectious Substances</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/pepper-spray.webp" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/><br/>
                                                <div className={"fs-12"}> Pepper Spray</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/radioactive.svg" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/><br/>
                                                <div className={"fs-12"}> RadioActive Materials</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/flammableGas.png" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/><br/>
                                                <div className={"fs-12"}> Flammable Gas</div>
                                            </div>
                                            <div className="col-lg-2 col-sm-2 text-start">
                                                <img src="/images/icons/corrosive.png" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights"/><br/><br/>
                                                <div className={"fs-12"}> Corrosive</div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col-lg-5 col-sm-5">
                                        <div className="row mb-2">
                                            <div className="col-lg-4 col-sm-4 text-end">
                                                <i className="fa-solid fa-check text-success fs-1"></i>
                                            </div>
                                            <div className="col-lg-8 col-sm-8 text-start fw-bold">
                                                Items allowed only in Hand Baggage
                                            </div>
                                        </div>
                                        <div className="row mt-2 mb-2">
                                            <div className="col-lg-3 col-sm-3 text-start offset-lg-5 offset-sm-5">
                                                <img src="/images/icons/powerbank.jpg" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights-green bg-white"
                                                     alt={"Power Banks"}/> <br/><br/>
                                                <div className={"fs-12"}> Power Banks</div>
                                            </div>
                                            <div className="col-lg-3 col-sm-3 offset-lg-1 offset-sm-1">
                                                <img src="/images/icons/lithiumBattery.svg" style={{width: "50px", height: "50px"}}
                                                     className="icon-flights-green"/><br/><br/>
                                                <div className={"fs-12"}> Lithium Batteries</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
        </div>
    )
}

export default PrintTicket;
