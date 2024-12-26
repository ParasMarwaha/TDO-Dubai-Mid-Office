import axios from "axios";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message"
import Swal from "sweetalert2";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
const EditSegment = ({selectedSegment, fetchDetails, handleClose}) => {
    const [bookingid,setBookingid] = useState(null);
    console.log("in edit segment")
    console.log(selectedSegment)
    let location = useLocation();
    let deptDate = new Date(selectedSegment.departure)
    let arrDate = new Date(selectedSegment.arrival)
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
            ...selectedSegment,
            departure: formattedDeptDate,
            arrival: formattedArrDate
        }
    });

    useEffect(() => {
        console.log("booking-id",location.state.id)
        setBookingid(location.state.id)
    }, []);
    const onSubmit = async (data) => {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const res = await axios.post(Server_URL + "admin/update-segment", data, {
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
                    fetchDetails(bookingid);
                    handleClose();
                }
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        }
    }
// Get today's date in the format 'YYYY-MM-DD'
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="container">
            <div className="border border-light shadow rounded p-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Segment Id</label>
                            <input type={"number"} className="form-control" readOnly style={{background:"lightgray"}}
                                   {...register('segment_id', {required: 'This field is required.'})}/>
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
                                   {...register('arrival_terminal', {required: 'This field is required.'})}/>


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
                                   {...register('departure_terminal', {required: 'This field is required.'})}/>
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
                            <label htmlFor="">Layover Time</label>
                            <input className="form-control"
                                   {...register('layover_time', {required: 'This field is required.'})}/>
                            <ErrorMessage errors={errors} name="layover_time"
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
export default EditSegment;
