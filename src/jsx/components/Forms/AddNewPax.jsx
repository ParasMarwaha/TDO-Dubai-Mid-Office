import axios from "axios";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message"
import Swal from "sweetalert2";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";

const AddNewPax = ({booking_id, fetchDetails, paxHandleClose}) => {
    console.log(booking_id);
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues: {
            booking_id:booking_id
        }});

    const [bookingid,setBookingid] = useState(null);
    let location = useLocation();

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
            const res = await axios.post(Server_URL + "admin/add-new-pax", data, {
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
                    paxHandleClose();
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
                            <label htmlFor="">Booking Id</label>
                            <input type={"number"}  className="form-control" readOnly style={{background:"lightgray"}}
                                   {...register('booking_id', {required: 'This field is required.'})}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Salutation</label>
                            <select  className="form-control"
                                     {...register('salutation', {required: 'This field is required.'})}>
                                <option value="">Please Select</option>
                                <option>MR</option>
                                <option>MS</option>
                                <option>MRS</option>
                                <option>MASTER</option>
                            </select>

                            <ErrorMessage errors={errors} name="salutation"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>

                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">First Name</label>
                            <input type="text" className="form-control"
                                   {...register('FirstName', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="FirstName"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>

                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Last Name</label>
                            <input type="text" className="form-control"
                                   {...register('LastName', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="LastName"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Pax Type</label>
                            <select className="form-control"
                                    {...register('pax_type', {required: 'This field is required.'})}>
                                <option value={""}>Select</option>
                                <option>Adult</option>
                                <option>Child</option>
                                <option>Infant</option>
                            </select>

                            <ErrorMessage errors={errors} name="pax_type"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Gender</label>
                            <select className="form-control"
                                    {...register('gender', {required: 'This field is required.'})}>
                                <option value={""}>Select</option>
                                <option value={"1"}>Male</option>
                                <option value={"2"}>Female</option>
                            </select>

                            <ErrorMessage errors={errors} name="gender"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Ticket Number</label>
                            <input type="text" className="form-control"
                                   {...register('ticket_number', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="ticket_number"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Date of Birth</label>
                            <input type="date" className="form-control"  max={today}
                                   {...register('date_of_birth', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="date_of_birth"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Passport No.</label>
                            <input type="text" className="form-control"  max={today}
                                   {...register('passport_no')}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Passport Expiry Date</label>
                            <input type="date" max={today} className="form-control"
                                   {...register('passport_expiry')}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Nationality</label>
                            <input type="text" className="form-control" defaultValue={"IN"}
                                   {...register('nationality', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="nationality"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Email Id</label>
                            <input type="email" className="form-control"
                                   {...register('email_id', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="email_id"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Phone No.</label>
                            <input type="number" className="form-control"
                                   {...register('agent_phone_no', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="email_id"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Check In Baggage</label>
                            <input type="text" className="form-control"
                                   {...register('check_in', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="check_in"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Cabin Baggage</label>
                            <input type="text" className="form-control"
                                   {...register('cabin', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="cabin"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Stops</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('stops', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="stops"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">City</label>
                            <input type="text" className="form-control"
                                   {...register('city', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="city"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Country Code</label>
                            <input type="text" className="form-control"
                                   {...register('country_code', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="country_code"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Address</label>
                            <input type="text" className="form-control"
                                   {...register('address', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="address"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Markup Per Pax</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('markup_per_pax', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="markup_per_pax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Commission Per Pax</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('commission_per_pax', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="commission_per_pax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Tds Per Pax</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('tds_per_pax', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="tds_per_pax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Base Fare</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('base_fare', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="base_fare"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">YQ Tax</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('yq_tax', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="yq_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">YR Tax</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('yr_tax', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="yr_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">K3 Tax</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('k3_tax', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="k3_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Additional Taxes</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('additional_taxes', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="k3_tax"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Published Fare</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('published_fare', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="published_fare"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Service Fee</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('service_fee', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="service_fee"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Other Charges</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('other_charges', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="other_charges"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Transaction Fee</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('transaction_fee', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="transaction_fee"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Total SSR Amount</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('total_ssr_amount', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="total_ssr_amount"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Pax Id</label>
                            <input type="number" className="form-control" defaultValue={0}
                                   {...register('pax_id', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="pax_id"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                            <small>Pax Id to be fetched from API</small>
                        </div>

                        <div className="col-12 text-center mt-2">
                            <button className="btn btn-success w-100 text-white">Add</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddNewPax;
