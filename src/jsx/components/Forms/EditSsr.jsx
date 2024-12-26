import axios from "axios";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message"
import Swal from "sweetalert2";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {adminAuthToken, Server_URL} from "../../../helpers/config.js";

const EditSsr = ({selectedSsr, fetchDetails, handleClose}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();
    const [bookingid,setBookingid] = useState(null);
    let location = useLocation();

    useEffect(() => {
        console.log("booking-id",location.state.id)
        setBookingid(location.state.id)
    }, []);

    const onSubmit = async (data) => {
        console.log(data)
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const res = await axios.post(Server_URL + "admin/update-ssr", data, {
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
                    fetchDetails(bookingid)
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
                    {
                        selectedSsr.ssr_data.map((item, index) => (
                            <div className={"row"} key={index}>
                                {Object.keys(item).map((column, colIndex) => (
                                    <div className="col-md-6 mb-2" key={colIndex}>
                                        <label htmlFor={`${column}-${item.ssr_id}`}>{column}</label>
                                        {column === "ssr_type" ? (
                                            // Render dropdown for ssr_type column
                                            <>
                                                <select
                                                    id={`${column}-${item.ssr_id}`}
                                                    name={`${column}-${item.ssr_id}`}
                                                    {...register(`${column}-${item.ssr_id}`)}
                                                    className="form-control"
                                                    defaultValue={item[column]} // Set default value for dropdown
                                                >
                                                    <option value="meal">Meal</option>
                                                    <option value="Baggage">Baggage</option>
                                                    <option value="seat">Seat</option>
                                                </select>
                                                <ErrorMessage errors={errors} name={`${column}-${item.ssr_id}`}
                                                              render={({message}) => <p
                                                                  className="text-danger">{message}</p>}/>
                                            </>
                                        ) : (
                                            // Render input for other columns
                                            <input type="text" id={`${column}-${item.ssr_id}`}
                                                   name={`${column}-${item.ssr_id}`} {...register(`${column}-${item.ssr_id}`)}
                                                   className="form-control"
                                                   defaultValue={item[column]} // Populate with the value
                                                   readOnly={column === "ssr_id"} // Make ssr_id readonly
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    }


                    <div className="row mt-2">
                        <div className="col-lg-12 text-center">
                            <button type="submit" className={"btn btn-success w-50"}>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default EditSsr;
