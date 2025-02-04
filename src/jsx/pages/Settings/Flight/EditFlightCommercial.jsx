import Select from "react-select";
import {Controller, useForm} from "react-hook-form";
import  {useEffect, useState} from "react";
import {CCard, CCardHeader, CCardBody} from "@coreui/react";
import {useNavigate,useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";

const products = ["Air Ticket", "Fixed Departure"];
const markupTypes = ["PLB", "Non PLB"];
const airTicket = ["All", "TBO", "Tripjack"];
const fixedDeparture = ["All", "Airiq", "Travelopedia"];
const bookingTypes = ["International", "Domestic"];

import {Server_URL,adminAuthToken} from "../../../../helpers/config.js";
import axios from "axios";
import Swal from "sweetalert2";
import {Logout} from "../../../../store/actions/AuthActions.js";

const EditFlightCommercial = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
        control,
        trigger
    } = useForm();

    /* ---------------------------------------- */
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [fareTypes, setFareTypes] = useState([]);
    const [carriers, setCarriers] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [groupType, setGroupType] = useState([]);


    async function fetchData() {
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            // Fetch fare types
            const fareTypesApi = `${Server_URL}admin/fare-types`;
            let response = await fetch(fareTypesApi, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                }
            });
            const fareTypesData = await response.json();
            if(fareTypesData.message === 'Session Expired' || fareTypesData.message === 'Token Missing') {
                return onLogout()
            }
            if (fareTypesData.responseCode === 2) {
                //console.log(fareTypesData.data)
                setFareTypes(fareTypesData.data);
            } else {
                Swal.fire({ icon: 'error', title: fareTypesData.message });
            }

            // Fetch carriers
            const carriersApi = `${Server_URL}admin/carriers`;
            response = await fetch(carriersApi, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                }
            });
            const carriersData = await response.json();
            if(carriersData.message === 'Session Expired' || carriersData.message === 'Token Missing') {
                return onLogout()
            }
            if (carriersData.responseCode === 2) {
                // console.log(carriersData.data)
                setCarriers(carriersData.data);
            } else {
                Swal.fire({ icon: 'error', title: carriersData.message });
            }

            // Fetch Group Type
            const groupTypeApi = `${Server_URL}admin/user-group`;
            let res = await fetch(groupTypeApi, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                }
            });
            const groupTypeData = await res.json();
            if(groupTypeData.message === 'Session Expired' || groupTypeData.message === 'Token Missing') {
                return onLogout()
            }
            if (groupTypeData.responseCode === 2) {
                console.log(groupTypeData.data)
                setGroupType(groupTypeData.data);
            } else {
                Swal.fire({ icon: 'error', title: groupTypeData.message });
            }

        }
        catch (e) {
            Swal.fire({
                icon: "error",
                title: "An error occurred",
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        }
    }
    const carrierOptions = [
        { value: 'All', label: 'All' },
        ...carriers.map(carrier => ({ value: carrier.AirlineIndex, label: carrier.Name }))
    ];

    const fareOptions = [
        { value: 'All', label: 'All' },
        ...fareTypes.map(faretypes => ({ value: faretypes.id, label: faretypes.fare }))
    ];
    function onLogout() {
        dispatch(Logout(navigate));
    }
    async function showDataInForm(row) {
        console.log(row.group_type,row.group_name);
        const {
            id, product, vendor, booking_type, fare_type,
            airline, carriers, fare, markup_type, markup_plb, markup_percentage, group_type,group_name
        } = row;

        // Set simple fields
        setValue("id", id);
        checkProduct(product);
        setValue("product", product);
        setTimeout(() => setValue("vendor", vendor), 100);
        setValue("booking_type", booking_type);
        setValue("markup_type", markup_type);
        if (markup_type === "Non PLB") {
            setIsNonPLB(true);
        }
        setValue("markup_plb", markup_plb);
        setPercentage(markup_percentage);
        setValue("group_type", group_type);

        // Update controlled components explicitly
        setValue("fare_type", { value: fare_type, label: fare });
        setValue("airline", { value: airline, label: carriers });

        // Trigger validation to update form state
        await trigger(["fare_type", "airline"]);
    }

    useEffect(() => {
        fetchData().then()
    }, []);

    useEffect(()=>{
        showDataInForm(location.state.row);
    },[]);

    // const [selectedOptionAirline, setSelectedOptionAirline] = useState(null);

    /* ---------------------------------------- */

    const [isNonPLB, setIsNonPLB] = useState(null);

    function checkMarkupType(e) {
        console.log("Check")
        e.target.value === 'Non PLB' ? setIsNonPLB(true) : setIsNonPLB(false)
    }

    /* ---------------------------------------- */

    const [percentage, setPercentage] = useState(0);

    const handleSliderChange = (e) => {
        setPercentage(e.target.value);
    };

    /* ---------------------------------------- */

    const [product, setProduct] = useState(null);

    function checkProduct(product) {

        if (!product) {
            setProduct(null);
            Swal.fire({ icon: 'error', title: "Please Select Product" });
            return false;
        }
        product === 'Air Ticket' ? setProduct('AT') : setProduct('FD');
    }

    /* ---------------------------------------- */

    async function onSubmit(data) {
        setSubmitting(true)
        console.log(data)
        try {
            // Prepare data for submission
            data['markup_percentage'] = percentage;

            // If markup_type is 'PLB', set markup_plb to 0, else check for presence
            if (data.markup_type === 'PLB') {
                data['markup_plb'] = 0;
            } else if (!data.markup_plb) {
                data['markup_plb'] = null;  // You can set this to null or handle as needed
            }
            data['airline'] = [data.airline.value]
            data['fare_type'] = data.fare_type.value

            // Get token from localStorage for auth
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            // Send data to server
            const res = await axios.post(Server_URL + "admin/edit-flight-commercial", data, {
                headers: {'Authorization': `Bearer ${dataLS.idToken}`}
            });

            // Handle response
            if (res.data.error) {
                Swal.fire({ icon: 'error', title: res.data.message });
            } else {
                // Reset form after successful submission
                reset();
                setPercentage(percentage);
                setIsNonPLB(null);
                Swal.fire({ icon: 'success', title: res.data.message }).then(() => {
                    navigate('/manage-flight-commission');
                });
                reset({ airline: [] }); // Resets the 'airline' field in the form
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        }finally {
            setSubmitting(false)
        }
    }

    return (
        <CCard>
            <CCardHeader className="card-header-bg">
                <h4 className="mb-0 primary-color">Edit Flight Commercial</h4>
            </CCardHeader>
            <CCardBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        {/* Product */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="product">
                                Product <span className="text-danger">*</span>
                            </label>
                            <select {...register('product', {required: "This is a required field."})}
                                    name="product" id="product" className="form-select" onChange={checkProduct}>
                                <option value="">--Select Product--</option>
                                {products.map(x => <option value={x} key={x}>{x}</option>)}
                            </select>

                            {errors?.product && <p className='text-danger'>{errors?.product?.message}</p>}
                        </div>

                        {/* Vendor */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="vendor">
                                Vendor <span className="text-danger">*</span>
                            </label>
                            <select name="vendor" id="vendor" className="form-select"
                                    {...register('vendor', {required: "This is a required field."})}>
                                <option value="">--Select Product--</option>
                                {product ? (product === 'AT' ?
                                        airTicket.map(x => <option value={x} key={x}>{x}</option>) :
                                        fixedDeparture.map(x => <option value={x} key={x}>{x}</option>)) :
                                    null}
                            </select>

                            {errors?.vendor && <p className='text-danger'>{errors?.vendor?.message}</p>}
                        </div>

                        {/* Booking Type */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="booking_type">
                                Booking Type <span className="text-danger">*</span>
                            </label>
                            <select name="booking_type" id="booking_type" className="form-select"
                                    {...register('booking_type', {required: "This is a required field."})}>
                                <option value="">--Select Product--</option>
                                {bookingTypes.map(x => <option value={x} key={x}>{x}</option>)}
                            </select>

                            {errors?.booking_type && <p className='text-danger'>{errors?.booking_type?.message}</p>}
                        </div>

                        {/* Fare Type */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="fare_type">
                                Fare Type <span className="text-danger">*</span>
                            </label>
                            <Controller
                                name="fare_type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        // isMulti
                                        options={fareOptions}
                                        placeholder="Select Fare Type"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                )}
                            />

                            {errors?.fare_type && <p className='text-danger'>{errors?.fare_type?.message}</p>}
                        </div>

                        {/* Airline */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="airline">Airline <span className="text-danger">*</span></label>
                            <Controller
                                name="airline"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        // isMulti
                                        options={carrierOptions}
                                        placeholder="Select Airlines"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                )}
                            />
                            {errors?.airline && <p className="text-danger">{errors.airline.message}</p>}
                        </div>


                        {/* Markup Type */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="markup_type">
                                Markup Type <span className="text-danger">*</span>
                            </label>
                            <select name="markup_type" id="markup_type" className="form-select"
                                    {...register('markup_type', {required: "This is a required field."})}
                                    onChange={checkMarkupType}>
                                {/*<option value="">--Select Product--</option>*/}
                                {markupTypes.map(x => <option value={x} key={x}>{x}</option>)}
                            </select>

                            {errors?.markup_type && <p className='text-danger'>{errors?.markup_type?.message}</p>}
                        </div>

                        {/* Markup Percentage (%) */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="markup_percentage">
                                Markup Percentage (%) <span className="text-danger">*</span>
                            </label>
                            <div className="row mt-2">
                                <div className="col-10">
                                    <input type="range" id="markup_percentage" className="form-range" min="0" max="100"
                                           value={percentage} onChange={handleSliderChange}
                                    />
                                </div>
                                <div className="col-2">
                                    <b className="text-primary">{percentage}%</b>
                                </div>
                            </div>

                            {errors?.markup_percentage && <p className='text-danger'>{errors?.markup_percentage?.message}</p>}
                        </div>

                        {/* Markup PLB */}
                        {isNonPLB &&
                            <div className="col-md-6 mb-3">
                                <label htmlFor="markup_plb">
                                    Markup PLB <span className="text-danger">*</span>
                                </label>
                                <input type="number" id="markup_plb" className="form-control" min={0} placeholder="Enter PLB Markup"
                                       {...register('markup_plb', {required: "This is a required field."})}/>

                                {errors?.markup_plb && <p className='text-danger'>{errors?.markup_plb?.message}</p>}
                            </div>
                        }

                        {/* Group Type */}
                        <div className="col-md-6 mb-3">
                            <label htmlFor="group_type">
                                Group Type <span className="text-danger">*</span>
                            </label>
                            <select name="group_type" id="group_type" className="form-select"
                                    {...register('group_type', {
                                        required: "This is a required field.",
                                    })}
                            >
                                {groupType && groupType.map(x =>
                                    <option key={x.id} value={x.id}>{x.name}</option>
                                )}
                            </select>

                            {errors?.group_type && <p className='text-danger'>{errors?.group_type?.message}</p>}
                        </div>

                        <div className="col-12">
                            <button className="btn btn-primary px-5"
                                    disabled={submitting}>{submitting ? 'Editing...' : 'Edit'}</button>
                        </div>
                    </div>
                </form>
            </CCardBody>
        </CCard>
    )
}
export default EditFlightCommercial;
