import axios from "axios";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message"
import Swal from "sweetalert2";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";

const UpdateFlightTicketDetails = ({booking,fetchDetails, handleClose}) => {
    console.log(booking.SegmentJson)
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues: {
            booking_id:booking.booking_id,
            agent_email:booking.agent_email,
            trip_type:booking.trip_type,
            fare_type: booking.SectorJson[0].fare_type,
            agent_phone_number:booking.agent_phone_no,
            supplier:booking.supplier,
            airline_name: booking.SegmentJson[0].airline_name,
            flight_no : booking.SegmentJson[0].flight_number
        }});

    const onSubmit = async (data) => {
        console.log(data)
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const res = await axios.post(Server_URL + "admin/update-flight-ticket-details", data, {
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
                    fetchDetails(booking.booking_id)
                    handleClose();
                }
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        }
    }

    return (
        <div className="container">
            <div className="border border-light shadow rounded p-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Booking Ref. Id</label>
                            <input type="text" className="form-control" readOnly style={{background:"lightgray"}}
                                   {...register('booking_id', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="booking_id"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>

                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Agent Email</label>
                            <input type="text" className="form-control" readOnly style={{background:"lightgray"}}
                                   {...register('agent_email')}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Agent Phone No.</label>
                            <input type="text" className="form-control" readOnly style={{background:"lightgray"}}
                                   {...register('agent_phone_number')}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Supplier</label>
                            <input type="text" className="form-control"
                                   {...register('supplier', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="supplier"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Trip Type</label>
                            <input type="text" className="form-control"
                                   {...register('trip_type', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="Email"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>


                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Fare Type</label>
                            <input type="text" className="form-control"
                                   {...register('fare_type', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="PhoneNumber"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Airline Name</label>
                            <input type="text" className="form-control"
                                   {...register('airline_name', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="airline_name"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Flight No.</label>
                            <input type="text" className="form-control"
                                   {...register('flight_no', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="flight_no"
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
export default UpdateFlightTicketDetails;
