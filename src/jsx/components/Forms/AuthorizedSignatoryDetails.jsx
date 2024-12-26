import axios from "axios";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message"
import Swal from "sweetalert2";
import {Server_URL,adminAuthToken} from "../../../helpers/config.js";

const AuthorizedSignatoryDetails = ({agent, ReadAgentDetails, handleClose}) => {
    // console.log(agent);
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({defaultValues: agent});

    const onSubmit = async (data) => {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const res = await axios.post(Server_URL + "admin/update-agent-details", data, {
                headers: {
                    'Authorization': `Bearer ${dataLS.idToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (res.status === 200) {
                // console.log(res.data);

                if (res.data.error) {
                    Swal.fire({ icon: 'error', title: res.data.message });
                } else {
                    Swal.fire({ icon: 'success', title: res.data.message });
                    ReadAgentDetails(agent?.AspNetUserId);
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
                        <div className="col-md-12 mb-2">
                            <h5 style={{color: '#FF0000'}}>Authorized Signatory Details</h5>
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
                            <label htmlFor="">Email Id</label>
                            <input type="text" className="form-control"
                                   {...register('Email', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="Email"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Mobile Number</label>
                            <input type="text" className="form-control"
                                   {...register('PhoneNumber', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="PhoneNumber"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Whatsapp Number</label>
                            <input type="text" className="form-control" {...register('WhatsappNumber')}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Alternate Number</label>
                            <input type="text" className="form-control" {...register('AlternateNumber')}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Address Line 1</label>
                            <input type="text" className="form-control"
                                   {...register('Address', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="Address"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">City</label>
                            <input type="text" className="form-control"
                                   {...register('City', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="City"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">State</label>
                            <input type="text" className="form-control"
                                   {...register('State', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="State"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Country</label>
                            <input type="text" className="form-control"
                                   {...register('Country', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="Country"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Postal Code</label>
                            <input type="text" className="form-control"
                                   {...register('PinCode', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="PinCode"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-12 mb-2 mt-2">
                            <h5 style={{color: '#FF0000'}}>Business Details</h5>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">Agency Name</label>
                            <input type="text" className="form-control"
                                   {...register('CompanyName', {required: 'This field is required.'})}/>

                            <ErrorMessage errors={errors} name="CompanyName"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="">GST Number</label>
                            <input type="text"
                                   className="form-control" {...register('GSTNumber')}/>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label htmlFor="BusinessType">Business Type</label>
                            <select name="BusinessType" id="BusinessType" className="form-select"
                                    {...register('BusinessType', {required: 'This field is required.'})}>
                                <option value="Proprietor">Proprietor</option>
                                <option value="Partnership">Partnership</option>
                                <option value="Company/LLP/Private Limited">Company/LLP/Private Limited</option>
                            </select>

                            <ErrorMessage errors={errors} name="BusinessType"
                                          render={({message}) => <p className="text-danger">{message}</p>}/>
                        </div>

                        <div className="col-12 text-center mt-2">
                            <button className="btn btn-success w-100 text-white">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AuthorizedSignatoryDetails;
