import axios from "axios";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message"
import Swal from "sweetalert2";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";

const UpdateHotelDetails = ({booking,fetchDetails, handleClose}) => {
    console.log(booking)
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues: {
            booking_id:booking.api_booking_id,
            hotel_name:booking.hotelName,
            check_In:booking.checkIN,
            check_Out:booking.checkOut,
            hotel_address:JSON.parse(booking.hotel_address).line1 ? JSON.parse(booking.hotel_address).line1 : JSON.parse(booking.hotel_address),
            hotel_phone:booking.hotel_phone
        }});

    const onSubmit = async (data) => {
        console.log(data)
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const res = await axios.post(Server_URL + "admin/update-hotel-ticket-details", data, {
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
                    fetchDetails(booking.id)
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
                            <input type="text" className="form-control" readOnly style={{background: "lightgray"}}
                                   {...register('booking_id', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="booking_id"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>

                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Check In</label>
                            <input type="date" className="form-control"
                                   {...register('check_In', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="check_In"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Check Out</label>
                            <input type="date" className="form-control"
                                   {...register('check_Out', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="check_Out"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Hotel Name</label>
                            <input type="text" className="form-control"
                                   {...register('hotel_name', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="hotel_name"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Hotel Address</label>
                            <input type="text" className="form-control"
                                   {...register('hotel_address', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="hotel_address"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Hotel Phone</label>
                            <input type="text" className="form-control"
                                   {...register('hotel_phone', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="hotel_phone"
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
export default UpdateHotelDetails;
