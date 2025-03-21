import axios from "axios";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Swal from "sweetalert2";
import { Server_URL, adminAuthToken } from "../../../helpers/config.js";

const UpdateGuestDetails = ({ selectedPax, fetchDetails, paxHandleClose }) => {
    console.log(selectedPax);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            booking_id: selectedPax?.bookingDetailId || "",
            pt: selectedPax?.salutation || "",
            fN: selectedPax?.firstName || "",
            lN: selectedPax?.lastName || "",
        }
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }
            const res = await axios.post(Server_URL + "admin/update-guest-details", data, {
                headers: {
                    Authorization: `Bearer ${dataLS.idToken}`,
                    "Content-Type": "application/json",
                }
            });

            if (res.status === 200) {
                console.log(res.data);

                if (res.data.error) {
                    Swal.fire({ icon: "error", title: res.data.message });
                } else {
                    Swal.fire({ icon: "success", title: res.data.message });
                    fetchDetails(selectedPax.bId);
                    paxHandleClose();
                }
            }
        } catch (e) {
            Swal.fire({ icon: "error", title: e.message });
        }
    };

    return (
        <div className="container">
            <div className="border border-light shadow rounded p-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        {/* Booking ID (Read Only) */}
                        <div className="col-md-12 mb-3">
                            <label>Booking Ref. Id</label>
                            <input
                                type="text"
                                className="form-control"
                                readOnly
                                style={{ background: "lightgray" }}
                                {...register("booking_id", { required: "This field is required." })}
                            />
                            <ErrorMessage errors={errors} name="booking_id"
                                          render={({ message }) => <p className="text-danger">{message}</p>} />
                        </div>

                        {/* Salutation (Disabled if "Master") */}
                        <div className="col-md-4 mb-3">
                            <label>Salutation</label>
                            <select
                                className="form-control"
                                {...register("pt", { required: "This field is required." })}
                                disabled={selectedPax?.salutation === "Master"}
                                onChange={(e) => setValue("pt", e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Master">Master</option>
                            </select>
                            <ErrorMessage errors={errors} name="pt"
                                          render={({ message }) => <p className="text-danger">{message}</p>} />
                        </div>

                        {/* First Name */}
                        <div className="col-md-4 mb-3">
                            <label>First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("fN", { required: "This field is required." })}
                            />
                            <ErrorMessage errors={errors} name="fN"
                                          render={({ message }) => <p className="text-danger">{message}</p>} />
                        </div>

                        {/* Last Name */}
                        <div className="col-md-4 mb-3">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                {...register("lN", { required: "This field is required." })}
                            />
                            <ErrorMessage errors={errors} name="lN"
                                          render={({ message }) => <p className="text-danger">{message}</p>} />
                        </div>

                        {/* Submit Button */}
                        <div className="col-12 text-center mt-2">
                            <button className="btn btn-success w-50 text-white">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateGuestDetails;
