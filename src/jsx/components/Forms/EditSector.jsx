import axios from "axios";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message"
import Swal from "sweetalert2";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
const EditSector = ({selectedSector, fetchDetails, handleClose}) => {
    const [bookingId,setBookingId] = useState(null);
    console.log("in edit segment")
    console.log(selectedSector)
    let location = useLocation();
    let deptDate = new Date(selectedSector.departure)
    let arrDate = new Date(selectedSector.arrival)
    console.log(deptDate,arrDate)
    let formattedDeptDate = formatDateTime(deptDate); // e.g., "2024-11-14 15:30:45"
    let formattedArrDate = formatDateTime(arrDate);   // e.g., "2024-11-14 18:45:30"
    function formatDateTime(date) {
        // Ensure the date is a valid Date object
        if (!(date instanceof Date) || isNaN(date)) return null;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /* const {
       register,
       handleSubmit,
       formState: {errors}
     } = useForm({defaultValues: selectedSegment});*/

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            ...selectedSector,
            departure: formattedDeptDate,
            arrival: formattedArrDate
        }
    });
    const onSubmit = async (data) => {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const res = await axios.post(Server_URL + "admin/update-sector", data, {
                headers: {
                    'Authorization': `Bearer ${dataLS.idToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 200) {
                console.log(res.data);

                if (res.data.error) {
                    Swal.fire({ icon: 'error', title: res.data.message });
                } else {
                    Swal.fire({ icon: 'success', title: res.data.message });
                    fetchDetails(bookingId);
                    handleClose();
                }
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        }
    }

    useEffect(() => {
        console.log("booking-id",location.state.id)
        setBookingId(location.state.id)
    }, []);
// Get today's date in the format 'YYYY-MM-DD'
    const today = new Date().toISOString().split("T")[0];
    return (
        <div className="container">
            <div className="border border-light shadow rounded p-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Sector Id</label>
                            <input type={"number"} className="form-control" readOnly
                                   {...register('sector_id', {required: 'This field is required.'})}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Origin</label>
                            <input className="form-control"
                                   {...register('origin', {required: 'This field is required.'})}/>


                            <ErrorMessage errors={errors} name="origin"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>

                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Destination</label>
                            <input type="text" className="form-control"
                                   {...register('destination', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="destination"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Departure Date & Time:</label>
                            <input type="text" className="form-control"
                                   {...register('departure', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="departure"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Arrival Date & Time:</label>
                            <input type="text" className="form-control"
                                   {...register('arrival', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="arrival"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Arrival Airport Name:</label>
                            <input className="form-control"
                                   {...register('arrival_airport_name', {required: 'This field is required.'})}/>


                            <ErrorMessage errors={errors} name="arrival_airport_name"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Arrival Airport Code</label>
                            <input className="form-control"
                                   {...register('arrival_airport_code', {required: 'This field is required.'})}/>


                            <ErrorMessage errors={errors} name="arrival_airport_code"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Arrival Terminal</label>
                            <input className="form-control"
                                   {...register('arrival_terminal')}/>


                            <ErrorMessage errors={errors} name="arrival_terminal"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Departure Airport Name</label>
                            <input className="form-control"
                                   {...register('departure_airport_name', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="departure_airport_name"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Departure Airport Code</label>
                            <input className="form-control"
                                   {...register('departure_airport_code', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="departure_airport_code"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Departure Terminal</label>
                            <input className="form-control"
                                   {...register('departure_terminal')}/>
                            <ErrorMessage errors={errors} name="departure_terminal"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Destination</label>
                            <input className="form-control"
                                   {...register('destination', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="destination"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Duration</label>
                            <input className="form-control"
                                   {...register('duration', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="duration"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Airline Name</label>
                            <input className="form-control"
                                   {...register('airline_name', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="airline_name"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Airline Code</label>
                            <input className="form-control"
                                   {...register('airline_code', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="airline_code"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Base Fare</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('base_fare', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="base_fare"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Total Tax</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('total_tax', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="total_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Published Fare</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('published_fare', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="published_fare"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Offered Fare</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('offered_fare', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="offered_fare"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Commission</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('commission', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="commission"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">TDS on Commission</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('tds_on_commission', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="tds_on_commission"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">YQ Tax</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('yq_tax', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="yq_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">YR Tax</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('yr_tax', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="yr_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">K3 Tax</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('k3_tax', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="k3_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Additional Taxes</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('additional_taxes', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="additional_taxes"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Tdo Markup</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('tdo_markup', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="tdo_markup"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Agent Markup</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('agent_markup', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="agent_markup"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Service Fee</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('service_fee', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="service_fee"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Other Charges</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('other_charges', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="other_charges"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Transaction Fee</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('transaction_fee', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="transaction_fee"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">GDSPNR</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('gdspnr', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="gdspnr"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Total SSR Amount</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('total_ssr_amount', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="total_ssr_amount"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Flight Number</label>
                            <input className="form-control" defaultValue={0}
                                   {...register('flight_number', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="flight_number"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Fare Type</label>
                            <input className="form-control"
                                   {...register('fare_type', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="fare_type"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-12 text-center mt-2">
                            <button className="btn btn-success w-50 text-white">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default EditSector;
