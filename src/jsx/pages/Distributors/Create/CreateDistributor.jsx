import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {ErrorMessage} from "@hookform/error-message";
import PageTitle from "../../../layouts/PageTitle.jsx";
import DataTable from "react-data-table-component";
import React from "react";

const FILE_SIZE = 5000000; // 5MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "application/pdf"];

const schema = yup.object({
    AgencyName: yup.string().required('This is a required field.'),
    NatureOfBusiness: yup.string().required('This is a required field.'),
    Firstname: yup.string().required('This is a required field.'),
    Lastname: yup.string().required('This is a required field.'),
    Email: yup.string().email('Enter a valid email').required('This is a required field.'),
    Mobile: yup.string().required('This is a required field.'),
    Address: yup.string().required('This is a required field.'),
    City: yup.string().required('This is a required field.'),
    State: yup.string().required('This is a required field.'),
    AadhaarNumber: yup.string().required('This is a required field.'),
    UploadAadhaar: yup.mixed()
        .test('required', 'This is a required field.', (value) => {
            return value && value.length > 0;
        })
        .test('fileSize', 'File size is too large', (value) => {
            return value && value[0] && value[0].size <= FILE_SIZE;
        })
        .test('fileFormat', 'Unsupported Format', (value) => {
            return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
        }),
    PANNumberPerson: yup.string().required('This is a required field.'),
    UploadPANPerson: yup.mixed()
        .test('required', 'This is a required field.', (value) => {
            return value && value.length > 0;
        })
        .test('fileSize', 'File size is too large', (value) => {
            return value && value[0] && value[0].size <= FILE_SIZE;
        })
        .test('fileFormat', 'Unsupported Format', (value) => {
            return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
        }),
    GSTNumber: yup.string().required('This is a required field.'),
    GSTUpload: yup.mixed()
        .test('required', 'This is a required field.', (value) => {
            return value && value.length > 0;
        })
        .test('fileSize', 'File size is too large', (value) => {
            return value && value[0] && value[0].size <= FILE_SIZE;
        })
        .test('fileFormat', 'Unsupported Format', (value) => {
            return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
        }),
    PANNumber: yup.string().required('This is a required field.'),
    UploadPAN: yup.mixed()
        .test('required', 'This is a required field.', (value) => {
            return value && value.length > 0;
        })
        .test('fileSize', 'File size is too large', (value) => {
            return value && value[0] && value[0].size <= FILE_SIZE;
        })
        .test('fileFormat', 'Unsupported Format', (value) => {
            return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
        }),
    IATACode: yup.string(),
    IATAUpload: yup.mixed()
        .test('fileSize', 'File size is too large', (value) => {
            if (!value || !value[0]) return true; // Optional field
            return value[0].size <= FILE_SIZE;
        })
        .test('fileFormat', 'Unsupported Format', (value) => {
            if (!value || !value[0]) return true; // Optional field
            return SUPPORTED_FORMATS.includes(value[0].type);
        }),
    UDYAM_Number: yup.string(),
    UploadUDYAM: yup.mixed()
        .test('fileSize', 'File size is too large', (value) => {
            if (!value || !value[0]) return true; // Optional field
            return value[0].size <= FILE_SIZE;
        })
        .test('fileFormat', 'Unsupported Format', (value) => {
            if (!value || !value[0]) return true; // Optional field
            return SUPPORTED_FORMATS.includes(value[0].type);
        }),
});


function CreateDistributor() {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({resolver: yupResolver(schema)});

    async function onSubmit(data) {
        console.log(data);
    }

    return (
        <div>
            <div>
                <PageTitle motherMenu="Distributor" activeMenu="Create Distributor" pageContent="Create Distributor"/>

                <div className="card">
                    <div className="card-header card-header-bg">
                        <h4 className="mb-0 primary-color">Create New Distributor</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <h5 className="text-danger">Member Information</h5>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="AgencyName">Business/Agency Name <span
                                        className="text-danger">*</span></label>
                                    <input {...register('AgencyName')} type="text" id="AgencyName"
                                           className="form-control"
                                           placeholder="Enter Business/Agency Name"/>
                                    <ErrorMessage errors={errors} name="AgencyName" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="NatureOfBusiness">Nature of Business <span
                                        className="text-danger">*</span></label>
                                    <select {...register('NatureOfBusiness')} id="NatureOfBusiness"
                                            className="form-control">
                                        <option value="">Please Select Nature of Business</option>
                                        <option value="1">1</option>
                                        {/* Add options here */}
                                    </select>
                                    <ErrorMessage errors={errors} name="NatureOfBusiness" as="p"
                                                  className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="Firstname">Authorized Person Firstname <span
                                        className="text-danger">*</span></label>
                                    <input {...register('Firstname')} type="text" id="Firstname"
                                           className="form-control"
                                           placeholder="Enter Firstname"/>
                                    <ErrorMessage errors={errors} name="Firstname" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="Lastname">Authorized Person Lastname <span
                                        className="text-danger">*</span></label>
                                    <input {...register('Lastname')} type="text" id="Lastname" className="form-control"
                                           placeholder="Enter Lastname"/>
                                    <ErrorMessage errors={errors} name="Lastname" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="Email">Email <span className="text-danger">*</span></label>
                                    <input {...register('Email')} type="email" id="Email" className="form-control"
                                           placeholder="Enter Email"/>
                                    <ErrorMessage errors={errors} name="Email" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="Mobile">Mobile Number <span className="text-danger">*</span></label>
                                    <input {...register('Mobile')} type="text" id="Mobile" className="form-control"
                                           placeholder="Enter Mobile Number"/>
                                    <ErrorMessage errors={errors} name="Mobile" as="p" className="text-danger"/>
                                </div>

                                <div className="col-12 mt-2 mb-3">
                                    <h5 className="text-danger">Office Address</h5>
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label htmlFor="Address">Address <span className="text-danger">*</span></label>
                                    <textarea {...register('Address')} id="Address" className="form-control"
                                              placeholder="Enter Address"></textarea>
                                    <ErrorMessage errors={errors} name="Address" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="City">City <span className="text-danger">*</span></label>
                                    <input {...register('City')} type="text" id="City" className="form-control"
                                           placeholder="Enter City"/>
                                    <ErrorMessage errors={errors} name="City" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="State">State <span className="text-danger">*</span></label>
                                    <input {...register('State')} type="text" id="State" className="form-control"
                                           placeholder="Enter State"/>
                                    <ErrorMessage errors={errors} name="State" as="p" className="text-danger"/>
                                </div>
                                <div className="col-12 mt-2 mb-3">
                                    <h5 className="text-muted">Authorized Person Documents</h5>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="AadhaarNumber">Aadhaar Number <span
                                        className="text-danger">*</span></label>
                                    <input {...register('AadhaarNumber')} type="text" id="AadhaarNumber"
                                           className="form-control" placeholder="Enter Aadhaar Number"/>
                                    <ErrorMessage errors={errors} name="AadhaarNumber" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="UploadAadhaar">Upload Aadhaar <span
                                        className="text-danger">*</span></label>
                                    <input {...register('UploadAadhaar')} type="file" id="UploadAadhaar"
                                           className="form-control" accept=".png, .jpg, .jpeg, .pdf"/>
                                    <ErrorMessage errors={errors} name="UploadAadhaar" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="PANNumberPerson">PAN Number <span
                                        className="text-danger">*</span></label>
                                    <input {...register('PANNumberPerson')} type="text" id="PANNumberPerson"
                                           className="form-control" placeholder="Enter PAN Number"/>
                                    <ErrorMessage errors={errors} name="PANNumberPerson" as="p"
                                                  className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="UploadPANPerson">Upload PAN <span
                                        className="text-danger">*</span></label>
                                    <input {...register('UploadPANPerson')} type="file" id="UploadPANPerson"
                                           className="form-control" accept=".png, .jpg, .jpeg, .pdf"/>
                                    <ErrorMessage errors={errors} name='UploadPANPerson'
                                                  render={({message}) => <p className="text-danger">{message}</p>}/>
                                </div>

                                <div className="col-12 mt-2 mb-3">
                                    <h5 className="text-danger">Agency Documents</h5>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="GSTNumber">GST Number <span className="text-danger">*</span></label>
                                    <input {...register('GSTNumber')} type="text" id="GSTNumber"
                                           className="form-control"
                                           placeholder="Enter GST Number"/>
                                    <ErrorMessage errors={errors} name="GSTNumber" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="GSTUpload">Upload GST Certificate <span
                                        className="text-danger">*</span></label>
                                    <input {...register('GSTUpload')} type="file" id="GSTUpload"
                                           className="form-control"
                                           accept=".png, .jpg, .jpeg, .pdf"/>
                                    <ErrorMessage errors={errors} name="GSTUpload" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="PANNumber">PAN Number <span className="text-danger">*</span></label>
                                    <input {...register('PANNumber')} type="text" id="PANNumber"
                                           className="form-control"
                                           placeholder="Enter PAN Number"/>
                                    <ErrorMessage errors={errors} name="PANNumber" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="UploadPAN">Upload PAN <span className="text-danger">*</span></label>
                                    <input {...register('UploadPAN')} type="file" id="UploadPAN"
                                           className="form-control"
                                           accept=".png, .jpg, .jpeg, .pdf"/>
                                    <ErrorMessage errors={errors} name="UploadPAN" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="IATACode">IATA Code</label>
                                    <input {...register('IATACode')} type="text" id="IATACode" className="form-control"
                                           placeholder="Enter IATA Code"/>
                                    <ErrorMessage errors={errors} name="IATACode" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="IATAUpload">Upload IATA</label>
                                    <input {...register('IATAUpload')} type="file" id="IATAUpload"
                                           className="form-control"
                                           accept=".png, .jpg, .jpeg, .pdf"/>
                                    <ErrorMessage errors={errors} name="IATAUpload" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="UDYAM_Number">UDYAM Number</label>
                                    <input {...register('UDYAM_Number')} type="text" id="UDYAM_Number"
                                           className="form-control" placeholder="Enter UDYAM Number"/>
                                    <ErrorMessage errors={errors} name="UDYAM_Number" as="p" className="text-danger"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="UploadUDYAM">Upload UDYAM</label>
                                    <input {...register('UploadUDYAM')} type="file" id="UploadUDYAM"
                                           className="form-control" accept=".png, .jpg, .jpeg, .pdf"/>
                                    <ErrorMessage errors={errors} name="UploadUDYAM" as="p" className="text-danger"/>
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="px-5 btn btn-primary">Create</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CreateDistributor;
