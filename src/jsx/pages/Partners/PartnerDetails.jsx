import {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {useLocation, useNavigate} from 'react-router-dom';
import {adminAuthToken, Server_URL, Server_URL_FILE} from "../../../helpers/config.js";
import axios from "axios";
import Swal from "sweetalert2";
import PageTitle from "../../layouts/PageTitle.jsx";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {ErrorMessage} from "@hookform/error-message";
import {useDispatch} from "react-redux";
import {Logout} from "../../../store/actions/AuthActions.js";

// Validation schema with yup
const validationSchema = yup.object().shape({
    FileType: yup.string().required('File type is required.'),
    file: yup
        .mixed()
        .required('File is required.')
        .test('fileRequired', 'File is required.', (value) => value && value.length > 0), // Check if file is present
    remarks: yup.string().required('Remarks are required.')
});

const validationSchemaMapping = yup.object().shape({
    SalesPerson: yup.string().required('Sales Person is required.'),
    remarks: yup.string().required('Remarks are required.'),
});

const validationSchemaEstablishmentDetails = yup.object().shape({
    establishment_name: yup.string().required('Establishment Name is required.'),
    address: yup.string().required('Address is required.'),
    area: yup.string().required('Area is required.'),
    mobile: yup.string().matches(/^971[0-9]{9}$/, 'Mobile Number must start with 971 followed by 9 digits').required('Mobile Number is required.'),
    email: yup.string().email('Invalid email format').required('Email is required.'),
    emirates: yup.string().required('Emirates is required.'),
    nature_of_business: yup.string().required('Nature of Business is required.'),
});

const validationSchemaDirector1 = yup.object().shape({
    name: yup.string().required('Name as per Passport is required.'),
    nationality: yup.string().required('Nationality is required.'),
    passportNumber: yup.string().required('Passport Number is required.'),
    passportIssuingCountry: yup.string().required('Passport Issuing Country is required.'),
    passportExpiry: yup.date().required('Passport Expiry Date is required.').nullable(),
    emiratesId: yup.string().required('Emirates ID is required.'),
    emiratesIdExpiry: yup.date().required('Emirates ID Validity is required.').nullable(),
    email1: yup.string().email('Invalid email format').required('Email ID is required.'),
    mobile1: yup.string().matches(/^971[0-9]{9}$/, 'Mobile Number must start with 971 followed by 9 digits').required('Mobile Number is required.'),
});

const validationSchemaDirector2 = yup.object().shape({
    name2: yup.string().required('Name as per Passport is required.'),
    nationality2: yup.string().required('Nationality is required.'),
    passportNumber2: yup.string().required('Passport Number is required.'),
    passportIssuingCountry2: yup.string().required('Passport Issuing Country is required.'),
    passportExpiry2: yup.date().required('Passport Expiry Date is required.').nullable(),
    emiratesId2: yup.string().required('Emirates ID is required.'),
    emiratesIdExpiry2: yup.date().required('Emirates ID Validity is required.').nullable(),
    email2: yup.string().email('Invalid email format').required('Email ID is required.'),
    mobile2: yup.string().matches(/^971[0-9]{9}$/, 'Mobile Number must start with 971 followed by 9 digits').required('Mobile Number is required.'),
});

const validationSchemaSignatory = yup.object().shape({
    authorized_person_name: yup.string().required('Authorized Person Name is required.'),
    authorized_person_nationality: yup.string().required('Authorized Person Nationality is required.'),
    authorized_person_passport_number: yup.string().required('Authorized Person Passport Number is required.'),
    authorized_person_passport_issuing_country: yup.string().required('Authorized Person Passport Issuing Country is required.'),
    authorized_person_passport_expiry: yup.date().required('Passport Expiry Date is required.').nullable(),
    authorized_person_emirates_id: yup.string().required('Authorized Person Emirates ID is required.'),
    authorized_person_emirates_id_expiry: yup.date().required('Emirates ID Validity is required.').nullable(),
    authorized_person_email: yup.string().email('Invalid email format').required('Authorized Person Email is required.'),
    authorized_person_mobile: yup.string().matches(/^971[0-9]{9}$/, 'Mobile Number must start with 971 followed by 9 digits').required('Mobile Number is required.'),
});

const validationSchemaBank = yup.object().shape({
    banker_name: yup.string().required('Banker Name is required.'),
    branch_location: yup.string().required('Branch Location is required.'),
    account_number: yup.string().required('Account Number is required.'),
    current_business_volume: yup.string().required('Current Business Volume is required.'),
});

const PartnerDetails = () => {

    const [loading, setLoading] = useState(
        { activate: false, deactivate: false, suspend: false, resetPassword: false }
    );

    const [loadingStatus, setLoadingStatus] = useState({
        activate: false,
        deactivate: false,
        suspend: false,
        resendPassword: false,
        documentUpdate: false,
        salesMappingUpdate: false,
        establishmentUpdate: false,
        director1Update: false,
        director2Update: false,
        signatoryUpdate: false,
        bankDetailsUpdate: false,
    });

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function onLogout() {
        dispatch(Logout(navigate));
    }

    const PartnerInfo_GET = async (id) => {
        try {
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + 'admin/agent/' + id;
            const res = await axios.get(api, {
                headers: {authorization: `Bearer ${data.idToken}`}
            });

            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 1 && res.data.error) {
                Swal.fire({icon: 'error', title: res.data.message});
            } else if (res.status === 200 && res.data.responseCode === 1 && res.data.warning) {
                Swal.fire({icon: 'warning', title: res.data.message});
            } else if (res.status === 200 && res.data.responseCode === 2) {
                setPartnerInfo(res.data.data[0]);
                //console.log(res.data.data[0])
                const partner = res.data.data[0];
                setFormData({
                    establishment_name: partner.establishment_name || '',
                    address: partner.address || '',
                    area: partner.area || '',
                    nature_of_business: partner.nature_of_business || '',
                    emirates: partner.emirates || '',
                    email: partner.email || '',
                    mobile: partner.mobile || '',
                    id: partner.id || '',
                    name: partner.director1_name || '',
                    nationality: partner.director1_nationality || '',
                    passportNumber: partner.director1_passport_number || '',
                    passportIssuingCountry: partner.director1_passport_issuing_country || '',
                    passportExpiry: formatDateToISO(partner.director1_passport_expiry) || '',
                    emiratesId: partner.director1_emirates_id || '',
                    emiratesIdExpiry: formatDateToISO(partner.director1_emirates_id_expiry) || '',
                    email1: partner.director1_email || '',
                    mobile1: partner.director1_mobile || '',
                    name2: partner.director2_name || '',
                    nationality2: partner.director2_nationality || '',
                    passportNumber2: partner.director2_passport_number || '',
                    passportIssuingCountry2: partner.director2_passport_issuing_country || '',
                    passportExpiry2: formatDateToISO(partner.director2_passport_expiry) || '',
                    emiratesId2: partner.director2_emirates_id || '',
                    emiratesIdExpiry2: formatDateToISO(partner.director2_emirates_id_expiry) || '',
                    email2: partner.director2_email || '',
                    mobile2: partner.director2_mobile || '',
                    authorized_person_name: partner.authorized_person_name || '',
                    authorized_person_nationality: partner.authorized_person_nationality || '',
                    authorized_person_passport_number: partner.authorized_person_passport_number || '',
                    authorized_person_passport_issuing_country: partner.authorized_person_passport_issuing_country || '',
                    authorized_person_passport_expiry: formatDateToISO(partner.authorized_person_passport_expiry) || '',
                    authorized_person_emirates_id: partner.authorized_person_emirates_id || '',
                    authorized_person_emirates_id_expiry: formatDateToISO(partner.authorized_person_emirates_id_expiry) || '',
                    authorized_person_email: partner.authorized_person_email || '',
                    authorized_person_mobile: partner.authorized_person_mobile || '',
                    banker_name: partner.banker_name || '',
                    branch_location: partner.branch_location || '',
                    account_number: partner.account_number || '',
                    current_business_volume: partner.current_business_volume || '',
                    otherDetails: partner.otherDetails || {}
                });
            }
        } catch (e) {
            Swal.fire({icon: 'error', title: e.message});
        }
    }

    useEffect(() => {
        if (!location.state) {
            navigate('/dashboard');
        } else {
            PartnerInfo_GET(location.state.id).then();
        }
    }, [location, navigate]);

    const [formData, setFormData] = useState({
        establishment_name: '',
        address: '',
        area: '',
        nature_of_business: '',
        emirates: '',
        email: '',
        mobile: '',
        id: '',
        name: '',
        nationality: '',
        passportNumber: '',
        passportIssuingCountry: '',
        passportExpiry: '',
        emiratesId: '',
        emiratesIdExpiry: '',
        email1: '',
        mobile1: '',
        name2: '',
        nationality2: '',
        passportNumber2: '',
        passportIssuingCountry2: '',
        passportExpiry2: '',
        emiratesId2: '',
        emiratesIdExpiry2: '',
        email2: '',
        mobile2: '',
        authorized_person_name: '',
        authorized_person_nationality: '',
        authorized_person_passport_issuing_country: '',
        authorized_person_passport_expiry: '',
        authorized_person_emirates_id_expiry: '',
        authorized_person_email: '',
        authorized_person_mobile: '',
        branch_name: '',
        branch_location: '',
        account_number: '',
        current_business_volume: '',
        otherDetails: {}
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const {
        register:registerSignatory,
        handleSubmit:handleSubmitSignatory,
        reset:resetSignatory,
        formState: {errors:errorsSignatory}
    } = useForm({
        resolver: yupResolver(validationSchemaSignatory),
    });

    const {
        register:registerBank,
        handleSubmit:handleSubmitBank,
        reset:resetBank,
        formState: {errors:errorsBank}
    } = useForm({
        resolver: yupResolver(validationSchemaBank),
    });

    const {
        register:registerDirector1,
        handleSubmit:handleSubmitDirector1,
        reset:resetDirector1,
        formState: {errors:errorsDirector1}
    } = useForm({
        resolver: yupResolver(validationSchemaDirector1),
    });

    const {
        register:registerDirector2,
        handleSubmit:handleSubmitDirector2,
        reset:resetDirector2,
        formState: {errors:errorsDirector2}
    } = useForm({
        resolver: yupResolver(validationSchemaDirector2),
    });

    const {
        register:registerMap,
        handleSubmit:handleSubmitMap,
        reset:resetMap,
        formState: {errors:errorsMap}
    } = useForm({
        resolver: yupResolver(validationSchemaMapping),
    });

    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: {errors: errorsEdit}
    } = useForm({
        resolver: yupResolver(validationSchemaEstablishmentDetails),
    });

    const [show, setShow] = useState({
        establish: false,
        director1: false,
        director2: false,
        signatory: false,
        bankDetails: false,
        SalesMapping: false,
        document: false,
    });

    const handleClose = (modal) => {
        setShow(prev => ({...prev, [modal]: false}));
        reset();// Reset form when closing the modal
        resetEdit();
        resetDirector1();
        resetDirector2();
        resetSignatory();
        resetMap();
        resetBank();
    };



    // const handleShow = async (modal, partner) => {
    const handleShow = async (modal, id) => {
        // console.log(partnerInfo)
        if (id) {
        await PartnerInfo_GET(id);
        }

        // setFormData({
        //     establishment_name: partner.establishment_name || '',
        //     address: partner.address || '',
        //     area: partner.area || '',
        //     nature_of_business: partner.nature_of_business || '',
        //     emirates: partner.emirates || '',
        //     email: partner.email || '',
        //     mobile: partner.mobile || '',
        //     id: partner.id || '',
        //     name: partner.director1_name || '',
        //     nationality: partner.director1_nationality || '',
        //     passportNumber: partner.director1_passport_number || '',
        //     passportIssuingCountry: partner.director1_passport_issuing_country || '',
        //     passportExpiry: formatDateToISO(partner.director1_passport_expiry) || '',
        //     emiratesId: partner.director1_emirates_id || '',
        //     emiratesIdExpiry: formatDateToISO(partner.director1_emirates_id_expiry) || '',
        //     email1: partner.director1_email || '',
        //     mobile1: partner.director1_mobile || '',
        //     name2: partner.director2_name || '',
        //     nationality2: partner.director2_nationality || '',
        //     passportNumber2: partner.director2_passport_number || '',
        //     passportIssuingCountry2: partner.director2_passport_issuing_country || '',
        //     passportExpiry2: formatDateToISO(partner.director2_passport_expiry) || '',
        //     emiratesId2: partner.director2_emirates_id || '',
        //     emiratesIdExpiry2: formatDateToISO(partner.director2_emirates_id_expiry) || '',
        //     email2: partner.director2_email || '',
        //     mobile2: partner.director2_mobile || '',
        //     authorized_person_name: partner.authorized_person_name || '',
        //     authorized_person_nationality: partner.authorized_person_nationality || '',
        //     authorized_person_passport_number: partner.authorized_person_passport_number || '',
        //     authorized_person_passport_issuing_country: partner.authorized_person_passport_issuing_country || '',
        //     authorized_person_passport_expiry: formatDateToISO(partner.authorized_person_passport_expiry) || '',
        //     authorized_person_emirates_id: partner.authorized_person_emirates_id || '',
        //     authorized_person_emirates_id_expiry: formatDateToISO(partner.authorized_person_emirates_id_expiry) || '',
        //     authorized_person_email: partner.authorized_person_email || '',
        //     authorized_person_mobile: partner.authorized_person_mobile || '',
        //     banker_name: partner.banker_name || '',
        //     branch_location: partner.branch_location || '',
        //     account_number: partner.account_number || '',
        //     current_business_volume: partner.current_business_volume || '',
        //     otherDetails: partner.otherDetails || {}
        // });

        setShow(prev => ({...prev, [modal]: true}));
    };

    const handleShowSale = async (modal, id) => {
        // console.log(partnerInfo)
        if (id){
              await GetSalesPersons();
             }
        setShow(prev => ({...prev, [modal]: true}));
    };

    const [salesPersons, setSalesPersons] = useState([]);

    // All Sales Staff
    const GetSalesPersons = async () => {
        try {
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + 'admin/getSalesStaff';
            const res = await axios.get(api, {
                headers: { authorization: `Bearer ${data.idToken}` }
            });

            //console.log(res.data.data)
            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 1 && res.data.error) {
                Swal.fire({ icon: 'error', title: res.data.message });
            } else if (res.status === 200 && res.data.responseCode === 1 && res.data.warning) {
                Swal.fire({ icon: 'warning', title: res.data.message });
            } else if (res.status === 200 && res.data.responseCode === 2) {
                setSalesPersons(res.data.data); // Adjust the field based on your API response
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        }
    }


    // Activity API Call
    const Activity = async (description,id) =>{
        //console.log(description)
        //console.log(id)

        let data = localStorage.getItem(adminAuthToken);
        if (data) {
            data = JSON.parse(data);
        }

        const api = Server_URL + 'admin/mid-office-agent-activity-log' ;
        const res = await axios.post(api, {description:description,id:id}, {
            headers: { authorization: `Bearer ${data.idToken}` }
        });
       // console.log(res)
    }

    // Date Formating
    const formatDateToISO = (dateString) => {
        if (!dateString) return "";
        const [day, month, year] = dateString.split('-'); // Split the date by '-'
        return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
    };

    const [partnerInfo, setPartnerInfo] = useState(null);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Update Partner Status
    const UpdatePartnerStatus = async (id, status) => {
        try {
            const actionText =
                status === '1'
                    ? "Do you want to activate this account?"
                    : status === '2'
                        ? "Do you want to suspend this account?"
                        : "Do you want to deactivate this account?";

            Swal.fire({
                title: "Are you sure?",
                text: actionText,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: status === '1' ? "Yes" : "Yes"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let data = localStorage.getItem(adminAuthToken);
                    if (data) {
                        data = JSON.parse(data);
                    }

                    let api = Server_URL;
                    let description = "";

                    if (status === '1') {
                        api += 'admin/activate-agent/' + id;
                        description = "Account activated";
                    } else if (status === '0') {
                        api += 'admin/deactivate-agent/' + id;
                        description = "Account deactivated";
                    } else {
                        api += 'admin/suspend-agent/' + id;
                        description = "Account suspended";
                    }

                    const res = await axios.post(api, {}, {
                        headers: { authorization: `Bearer ${data.idToken}` }
                    });

                    if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                        return onLogout()
                    }
                    if (res.status === 200 && res.data.responseCode === 1 && res.data.error) {
                        Swal.fire({ icon: 'error', title: res.data.message });
                    } else if (res.status === 200 && res.data.responseCode === 1 && res.data.warning) {
                        Swal.fire({ icon: 'warning', title: res.data.message });
                    } else if (res.status === 200 && res.data.responseCode === 2) {
                        await PartnerInfo_GET(id);

                        // Call Activity function here with description and id
                        await Activity(description, partnerInfo.id);

                        Swal.fire({ icon: 'success', title: res.data.message });
                    }
                }
            });
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        } finally {
            setLoading({ activate: false, deactivate: false, suspend: false, resetPassword: false });
        }
    };

    // Resend Password
    const ResendPassword = async (id) => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "Do you want to resend the password?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, resend it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let data = localStorage.getItem(adminAuthToken);
                    if (data) {
                        data = JSON.parse(data);
                    }

                    const api = Server_URL + 'admin/resend-agent-password/' + id;
                    const res = await axios.post(api, {}, {
                        headers: { authorization: `Bearer ${data.idToken}` }
                    });

                    if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                        return onLogout()
                    }
                    if (res.status === 200 && res.data.responseCode === 1 && res.data.error) {
                        Swal.fire({ icon: 'error', title: res.data.message });
                    } else if (res.status === 200 && res.data.responseCode === 1 && res.data.warning) {
                        Swal.fire({ icon: 'warning', title: res.data.message });
                    } else if (res.status === 200 && res.data.responseCode === 2) {
                        await Activity('Reset Agent Password',partnerInfo.id)
                        Swal.fire({ icon: 'success', title: res.data.message });
                    }
                }
            });
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        } finally {
            setLoading({ activate: false, deactivate: false, suspend: false, resetPassword: false });
        }
    };

    // Update Details
    const updatePartnerDetails = async (apiEndpoint, formData, modalName,actionType,description) => {
        try {
            setLoadingStatus((prev) => ({ ...prev, [actionType]: true })); // Set loading state

            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + apiEndpoint;
            const res = await axios.post(api, formData, {
                headers: {authorization: `Bearer ${data.idToken}`}
            });

            //console.log(partnerInfo.id)
            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 1 && res.data.error) {
                Swal.fire({icon: 'error', title: res.data.message});
            } else if (res.status === 200 && res.data.responseCode === 1 && res.data.warning) {
                Swal.fire({icon: 'warning', title: res.data.message}).then(()=>{
                    handleClose('document')
                })

            } else if (res.status === 200 && res.data.responseCode === 2) {
                Swal.fire({icon: 'success', title: res.data.message});
                handleClose(modalName);
                await Activity(description,partnerInfo.id)// Close the modal on success
                await PartnerInfo_GET(partnerInfo.id);
            }
        } catch (e) {
            Swal.fire({icon: 'error', title: e.message});
        }finally {
            setLoadingStatus((prev) => ({ ...prev, [actionType]: false })); // Reset loading state
        }
    };

    // Handlers for form submissions
    const onSubmitDocuments = async (data) => {
        //console.log(partnerInfo)
        try {
            let formData = new FormData();
            formData.append('FileType', data.FileType);
            formData.append('file', data.file[0]); // Ensure to use [0] to get the actual file
            formData.append('remarks', data.remarks);
            formData.append('id', partnerInfo.id);

            await updatePartnerDetails('admin/agent-document-update', formData, 'document', 'documentUpdate','Document Updated');
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmitSalesMapping = async (data) => {
        try {
            let formData = new FormData();
            formData.append('SalesPerson', data.SalesPerson);
            formData.append('remarks', data.remarks);
            formData.append('id', partnerInfo.id);

            await updatePartnerDetails('admin/agent-salesMapping-update', formData, 'SalesMapping','salesMappingUpdate','Updated SalesMapping');
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmitEstablishment = async (data) => {
        await updatePartnerDetails('admin/agent-establishment-update', {...data, id: partnerInfo.id}, 'establish','establishmentUpdate','Updated Partner Details');
    };

    const onSubmitDirector1 = async (data) => {
        await updatePartnerDetails('admin/agent-director1-update', {...data, id: partnerInfo.id}, 'director1','director1Update','Updated Partner Details');
    };

    const onSubmitDirector2 = async (data) => {
        await updatePartnerDetails('admin/agent-director2-update', {...data, id: partnerInfo.id}, 'director2','director2Update','Updated Partner Details');
    };

    const onSubmitSignatory = async (data) => {
        await updatePartnerDetails('admin/agent-signatory-update', {...data, id: partnerInfo.id}, 'signatory','signatoryUpdate','Updated Partner Details');
    };

    const onSubmitBankDetails = async (data) => {
        await updatePartnerDetails('admin/agent-bank-update', {...data, id: partnerInfo.id}, 'bankDetails','bankDetailsUpdate','Updated Partner Details');
    };



    return (
        <div>
            <div>
                {/*<PageTitle motherMenu="Partners" activeMenu="/agent-details" pageContent="Partner Details"/>*/}

                {partnerInfo ?
                    <>
                        <div className="row">
                            <div className="col-md-6 offset-md-6 d-flex justify-content-end mb-3">
                                {/* Status === '0' [Inactive] */}
                                {partnerInfo?.status === '0' && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-success me-2"
                                        onClick={() => UpdatePartnerStatus(partnerInfo?.id, '1')}
                                        disabled={loading.activate}
                                    >
                                        <i className="fa fa-check me-1"></i> Activate
                                    </button>
                                )}
                            </div>

                            <div className="col-md-12  d-flex justify-content-end mb-3">
                                {/* Status === '1' [Active] */}
                                {partnerInfo?.status === '1' && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-info me-2"
                                            onClick={() => handleShowSale('SalesMapping', partnerInfo.id)}
                                            disabled={loading.suspend || loading.deactivate || loading.resetPassword}
                                        >
                                            Sales Person Mapping
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger me-2"
                                            onClick={() => UpdatePartnerStatus(partnerInfo.id, '2')}
                                            disabled={loading.suspend}
                                        >
                                            <i className="fa fa-ban me-2"></i> Suspend
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-warning me-2"
                                            onClick={() => ResendPassword(partnerInfo.id)}
                                            disabled={loading.resetPassword}
                                        >
                                            <i className="fa fa-refresh me-1"></i> Reset Password
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => UpdatePartnerStatus(partnerInfo?.id, '0')}
                                            disabled={loading.deactivate}

                                        >
                                            Deactivate
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="col-md-6 offset-md-6 d-flex justify-content-end mb-3">
                                {/* Status === '2' [Suspended] */}
                                {partnerInfo?.status === '2' && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary btn-sm me-2"
                                            onClick={() => UpdatePartnerStatus(partnerInfo?.id, '0')}
                                            disabled={loading.deactivate}
                                        >
                                            Deactivate
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success btn-sm"
                                            onClick={() => UpdatePartnerStatus(partnerInfo?.id, '1')}
                                            disabled={loading.activate}
                                        >
                                            <i className="fa fa-check me-1"></i> Activate
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Sales Mapping Modal */}
                        <Modal show={show.SalesMapping} onHide={() => handleClose('SalesMapping')} backdrop="static"
                               keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>MAP Sales Person</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmitMap(onSubmitSalesMapping)}>
                                    <div className="row">
                                        <input
                                            {...registerMap('Id')}
                                            type="hidden"
                                            id="Id"
                                            name="Id"
                                            value={formData.id}
                                        />
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="SalesPerson">Select Sales Person:</label>
                                            <select
                                                {...registerMap('SalesPerson')}
                                                id="SalesPerson"
                                                className="form-control"
                                            >
                                                <option value="">Select a sales person</option>
                                                {salesPersons.map((person) => (
                                                    <option key={person.id} value={person.id}>
                                                        {person.first_name} {person.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ErrorMessage
                                                errors={errorsMap}
                                                name="SalesPerson"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="remarks">Remarks:</label>
                                            <textarea
                                                {...registerMap('remarks')}
                                                id="remarks"
                                                className="form-control"
                                            ></textarea>
                                            <ErrorMessage
                                                errors={errorsMap}
                                                name="remarks"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <button     disabled={loadingStatus.salesMappingUpdate}
                                                type="submit" className="btn btn-primary">Update</button>
                                </form>

                            </Modal.Body>
                        </Modal>

                        {/* Document Modal */}
                        <Modal show={show.document} onHide={() => handleClose('document')} backdrop="static" keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Update Documents</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit(onSubmitDocuments)}>
                                    <div className="row">
                                        <input
                                            {...register('Id')}
                                            type="hidden"
                                            id="Id"
                                            name="Id"
                                            value={formData.id}
                                        />

                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="FileType">Select File Type:</label>
                                            <select
                                                {...register('FileType')}
                                                id="FileType"
                                                className="form-control"
                                            >
                                                <option value="">Select a file type</option>
                                                <option value="company_trade_license_path">Trade License</option>
                                                <option value="director1_emirates_passport_path">Director1 Passport Issuing Country</option>
                                                <option value="director2_emirates_passport_path">Director2 Passport Issuing Country</option>
                                                <option value="authorized_person_emirates_passport_path">Signatory Passport Issuing Country</option>
                                                <option value="director1_emirates_id_path">Director1 Emirates ID</option>
                                                <option value="director2_emirates_id_path">Director2 Emirates ID</option>
                                                <option value="authorized_person_emirates_id_path">Signatory Emirates ID</option>
                                                <option value="iata_document_path">IATA Accredited</option>
                                                {/* Add more options as needed */}
                                            </select>
                                            <ErrorMessage
                                                errors={errors}
                                                name="FileType"
                                                render={({ message }) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="file">Upload New File:</label>
                                            <input
                                                {...register('file', {
                                                    required: 'File is required.',
                                                    validate: {
                                                        checkFile: (files) => files.length > 0 || 'File is required.'
                                                    }
                                                })}
                                                id="file"
                                                className="form-control"
                                                type="file"
                                            />
                                            <ErrorMessage
                                                errors={errors}
                                                name="file"
                                                render={({ message }) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="remarks">Remarks:</label>
                                            <textarea
                                                {...register('remarks')}
                                                id="remarks"
                                                className="form-control"
                                            ></textarea>
                                            <ErrorMessage
                                                errors={errors}
                                                name="remarks"
                                                render={({ message }) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <button disabled={loadingStatus.documentUpdate} type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Establishment Modal */}
                        <Modal show={show.establish} onHide={() => {handleClose('establish')}} backdrop="static"
                               keyboard={false} className="modal-lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Update Establishment Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmitEdit(onSubmitEstablishment)}>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditNatureOfBusiness">Nature Of
                                                Business</label>
                                            <select
                                                {...registerEdit('nature_of_business')}
                                                className="form-control"
                                                name="nature_of_business"
                                                id="EditNatureOfBusiness"
                                                value={formData.nature_of_business}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Iata Agent">Iata Agent</option>
                                                <option value="Non Iata Agent">Non Iata Agent</option>
                                                <option value="Other Business">Other Business</option>
                                            </select>
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="nature_of_business"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEstablishmentName">Name of
                                                Establishment</label>
                                            <input
                                                {...registerEdit('establishment_name')}
                                                className="form-control"
                                                type="text"
                                                id="EditEstablishmentName"
                                                name="establishment_name"
                                                value={formData.establishment_name}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="establishment_name"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditAddress">Address</label>
                                            <input
                                                {...registerEdit('address')}
                                                className="form-control"
                                                type="text"
                                                id="EditAddress"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="address"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditArea">Area</label>
                                            <input
                                                {...registerEdit('area')}
                                                className="form-control"
                                                type="text"
                                                id="EditArea"
                                                name="area"
                                                value={formData.area}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="area"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmirates">Emirates</label>
                                            <select
                                                {...registerEdit('emirates')}
                                                className="form-control"
                                                name="emirates"
                                                id="EditEmirates"
                                                value={formData.emirates}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Abu Dhabi">Abu Dhabi</option>
                                                <option value="Ajman">Ajman</option>
                                                <option value="Dubai">Dubai</option>
                                                <option value="Fujairah">Fujairah</option>
                                                <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                                                <option value="Sharjah">Sharjah</option>
                                                <option value="Umm Al-Quwain">Umm Al-Quwain</option>
                                            </select>
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="emirates"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmail">Email</label>
                                            <input
                                                {...registerEdit("email")}
                                                className="form-control"
                                                type="text"
                                                id="EditEmail"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="email"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditMobile">Mobile</label>
                                            <input
                                                {...registerEdit('mobile')}
                                                className="form-control"
                                                type="text"
                                                id="EditMobile"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsEdit}
                                                name="mobile"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <button     disabled={loadingStatus.establishmentUpdate}
                                                type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Director1 Modal */}
                        <Modal show={show.director1} onHide={() => handleClose('director1')} backdrop="static"
                               keyboard={false} className="modal-lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Update Director 1 Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmitDirector1(onSubmitDirector1)}>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditDirector1Name">Name as per
                                                Passport</label>
                                            <input
                                                {...registerDirector1('name')}
                                                className="form-control"
                                                type="text"
                                                id="EditDirector1Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}

                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="name"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditNationality">Nationality</label>
                                            <input
                                                {...registerDirector1('nationality')}
                                                className="form-control"
                                                type="text"
                                                id="EditNationality"
                                                name="nationality"
                                                value={formData.nationality}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="nationality"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditPassportNumber">Passport
                                                Number</label>
                                            <input
                                                {...registerDirector1('passportNumber')}
                                                className="form-control"
                                                type="text"
                                                id="EditPassportNumber"
                                                name="passportNumber"
                                                value={formData.passportNumber}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="passportNumber"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditPassportIssuingCountry">Passport
                                                Issuing Country</label>
                                            <select
                                                {...registerDirector1('passportIssuingCountry')}
                                                className="form-control"
                                                id="EditPassportIssuingCountry"
                                                name="passportIssuingCountry"
                                                value={formData.passportIssuingCountry}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Country</option>
                                                <option value="Afghanistan">Afghanistan</option>
                                                <option value="Albania">Albania</option>
                                                <option value="Algeria">Algeria</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="Angola">Angola</option>
                                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                <option value="Argentina">Argentina</option>
                                                <option value="Armenia">Armenia</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Austria">Austria</option>
                                                <option value="Azerbaijan">Azerbaijan</option>
                                                <option value="Bahamas">Bahamas</option>
                                                <option value="Bahrain">Bahrain</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="Barbados">Barbados</option>
                                                <option value="Belarus">Belarus</option>
                                                <option value="Belgium">Belgium</option>
                                                <option value="Belize">Belize</option>
                                                <option value="Benin">Benin</option>
                                                <option value="Bhutan">Bhutan</option>
                                                <option value="Bolivia">Bolivia</option>
                                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina
                                                </option>
                                                <option value="Botswana">Botswana</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="Brunei">Brunei</option>
                                                <option value="Bulgaria">Bulgaria</option>
                                                <option value="Burkina Faso">Burkina Faso</option>
                                                <option value="Burundi">Burundi</option>
                                                <option value="Cabo Verde">Cabo Verde</option>
                                                <option value="Cambodia">Cambodia</option>
                                                <option value="Cameroon">Cameroon</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Central African Republic">Central African Republic
                                                </option>
                                                <option value="Chad">Chad</option>
                                                <option value="Chile">Chile</option>
                                                <option value="China">China</option>
                                                <option value="Colombia">Colombia</option>
                                                <option value="Comoros">Comoros</option>
                                                <option value="Congo, Democratic Republic of the">Congo, Democratic
                                                    Republic of
                                                    the
                                                </option>
                                                <option value="Congo, Republic of the">Congo, Republic of the
                                                </option>
                                                <option value="Costa Rica">Costa Rica</option>
                                                <option value="Croatia">Croatia</option>
                                                <option value="Cuba">Cuba</option>
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="Czech Republic">Czech Republic</option>
                                                <option value="Denmark">Denmark</option>
                                                <option value="Djibouti">Djibouti</option>
                                                <option value="Dominica">Dominica</option>
                                                <option value="Dominican Republic">Dominican Republic</option>
                                                <option value="Ecuador">Ecuador</option>
                                                <option value="Egypt">Egypt</option>
                                                <option value="El Salvador">El Salvador</option>
                                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                <option value="Eritrea">Eritrea</option>
                                                <option value="Estonia">Estonia</option>
                                                <option value="Eswatini">Eswatini</option>
                                                <option value="Ethiopia">Ethiopia</option>
                                                <option value="Fiji">Fiji</option>
                                                <option value="Finland">Finland</option>
                                                <option value="France">France</option>
                                                <option value="Gabon">Gabon</option>
                                                <option value="Gambia">Gambia</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Ghana">Ghana</option>
                                                <option value="Greece">Greece</option>
                                                <option value="Grenada">Grenada</option>
                                                <option value="Guatemala">Guatemala</option>
                                                <option value="Guinea">Guinea</option>
                                                <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                <option value="Guyana">Guyana</option>
                                                <option value="Haiti">Haiti</option>
                                                <option value="Honduras">Honduras</option>
                                                <option value="Hungary">Hungary</option>
                                                <option value="Iceland">Iceland</option>
                                                <option value="India">India</option>
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Iran">Iran</option>
                                                <option value="Iraq">Iraq</option>
                                                <option value="Ireland">Ireland</option>
                                                <option value="Israel">Israel</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Jamaica">Jamaica</option>
                                                <option value="Japan">Japan</option>
                                                <option value="Jordan">Jordan</option>
                                                <option value="Kazakhstan">Kazakhstan</option>
                                                <option value="Kenya">Kenya</option>
                                                <option value="Kiribati">Kiribati</option>
                                                <option value="Korea, North">Korea, North</option>
                                                <option value="Korea, South">Korea, South</option>
                                                <option value="Kosovo">Kosovo</option>
                                                <option value="Kuwait">Kuwait</option>
                                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                                <option value="Laos">Laos</option>
                                                <option value="Latvia">Latvia</option>
                                                <option value="Lebanon">Lebanon</option>
                                                <option value="Lesotho">Lesotho</option>
                                                <option value="Liberia">Liberia</option>
                                                <option value="Libya">Libya</option>
                                                <option value="Liechtenstein">Liechtenstein</option>
                                                <option value="Lithuania">Lithuania</option>
                                                <option value="Luxembourg">Luxembourg</option>
                                                <option value="Madagascar">Madagascar</option>
                                                <option value="Malawi">Malawi</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Maldives">Maldives</option>
                                                <option value="Mali">Mali</option>
                                                <option value="Malta">Malta</option>
                                                <option value="Marshall Islands">Marshall Islands</option>
                                                <option value="Mauritania">Mauritania</option>
                                                <option value="Mauritius">Mauritius</option>
                                                <option value="Mexico">Mexico</option>
                                                <option value="Micronesia">Micronesia</option>
                                                <option value="Moldova">Moldova</option>
                                                <option value="Monaco">Monaco</option>
                                                <option value="Mongolia">Mongolia</option>
                                                <option value="Montenegro">Montenegro</option>
                                                <option value="Morocco">Morocco</option>
                                                <option value="Mozambique">Mozambique</option>
                                                <option value="Myanmar">Myanmar</option>
                                                <option value="Namibia">Namibia</option>
                                                <option value="Nauru">Nauru</option>
                                                <option value="Nepal">Nepal</option>
                                                <option value="Netherlands">Netherlands</option>
                                                <option value="New Zealand">New Zealand</option>
                                                <option value="Nicaragua">Nicaragua</option>
                                                <option value="Niger">Niger</option>
                                                <option value="Nigeria">Nigeria</option>
                                                <option value="North Macedonia">North Macedonia</option>
                                                <option value="Norway">Norway</option>
                                                <option value="Oman">Oman</option>
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="Palau">Palau</option>
                                                <option value="Palestine">Palestine</option>
                                                <option value="Panama">Panama</option>
                                                <option value="Papua New Guinea">Papua New Guinea</option>
                                                <option value="Paraguay">Paraguay</option>
                                                <option value="Peru">Peru</option>
                                                <option value="Philippines">Philippines</option>
                                                <option value="Poland">Poland</option>
                                                <option value="Portugal">Portugal</option>
                                                <option value="Qatar">Qatar</option>
                                                <option value="Romania">Romania</option>
                                                <option value="Russia">Russia</option>
                                                <option value="Rwanda">Rwanda</option>
                                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                                <option value="Saint Lucia">Saint Lucia</option>
                                                <option value="Saint Vincent and the Grenadines">Saint Vincent and
                                                    the Grenadines
                                                </option>
                                                <option value="Samoa">Samoa</option>
                                                <option value="San Marino">San Marino</option>
                                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Senegal">Senegal</option>
                                                <option value="Serbia">Serbia</option>
                                                <option value="Seychelles">Seychelles</option>
                                                <option value="Sierra Leone">Sierra Leone</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Slovakia">Slovakia</option>
                                                <option value="Slovenia">Slovenia</option>
                                                <option value="Solomon Islands">Solomon Islands</option>
                                                <option value="Somalia">Somalia</option>
                                                <option value="South Africa">South Africa</option>
                                                <option value="South Sudan">South Sudan</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Sri Lanka">Sri Lanka</option>
                                                <option value="Sudan">Sudan</option>
                                                <option value="Suriname">Suriname</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Switzerland">Switzerland</option>
                                                <option value="Syria">Syria</option>
                                                <option value="Taiwan">Taiwan</option>
                                                <option value="Tajikistan">Tajikistan</option>
                                                <option value="Tanzania">Tanzania</option>
                                                <option value="Thailand">Thailand</option>
                                                <option value="Timor-Leste">Timor-Leste</option>
                                                <option value="Togo">Togo</option>
                                                <option value="Tonga">Tonga</option>
                                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                                <option value="Tunisia">Tunisia</option>
                                                <option value="Turkey">Turkey</option>
                                                <option value="Turkmenistan">Turkmenistan</option>
                                                <option value="Tuvalu">Tuvalu</option>
                                                <option value="Uganda">Uganda</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States">United States</option>
                                                <option value="Uruguay">Uruguay</option>
                                                <option value="Uzbekistan">Uzbekistan</option>
                                                <option value="Vanuatu">Vanuatu</option>
                                                <option value="Vatican City">Vatican City</option>
                                                <option value="Venezuela">Venezuela</option>
                                                <option value="Vietnam">Vietnam</option>
                                                <option value="Yemen">Yemen</option>
                                                <option value="Zambia">Zambia</option>
                                                <option value="Zimbabwe">Zimbabwe</option>
                                            </select>
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="passportIssuingCountry"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditPassportExpiry">Passport Expiry
                                                Date</label>
                                            <input
                                                {...registerDirector1('passportExpiry')}
                                                className="form-control"
                                                type="date"
                                                id="EditPassportExpiry"
                                                name="passportExpiry"
                                                value={formData.passportExpiry}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="passportExpiry"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmiratesId">Emirates ID</label>
                                            <input
                                                {...registerDirector1('emiratesId')}
                                                className="form-control"
                                                type="text"
                                                id="EditEmiratesId"
                                                name="emiratesId"
                                                value={formData.emiratesId}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="emiratesId"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmiratesIdExpiry">Emirates ID
                                                Validity</label>
                                            <input
                                                {...registerDirector1('emiratesIdExpiry')}
                                                className="form-control"
                                                type="date"
                                                id="EditEmiratesIdExpiry"
                                                name="emiratesIdExpiry"
                                                value={formData.emiratesIdExpiry}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="emiratesIdExpiry"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmail1">Email ID</label>
                                            <input
                                                {...registerDirector1('email1')}
                                                className="form-control"
                                                type="email1"
                                                id="EditEmail1"
                                                name="email1"
                                                value={formData.email1}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="email1"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditMobile1">Mobile Number</label>
                                            <input
                                                {...registerDirector1('mobile1')}
                                                className="form-control"
                                                type="text"
                                                id="EditMobile1"
                                                name="mobile1"
                                                value={formData.mobile1}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector1}
                                                name="mobile1"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <button     disabled={loadingStatus.director1Update}
                                                type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Director2 Modal */}
                        <Modal show={show.director2} onHide={() => handleClose('director2')} backdrop="static"
                               keyboard={false} className="modal-lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Update Director 2 Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmitDirector2(onSubmitDirector2)}>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditDirector2Name">Name as per
                                                Passport</label>
                                            <input
                                                {...registerDirector2('name2')}
                                                className="form-control"
                                                type="text"
                                                id="EditDirector2Name"
                                                name="name2"
                                                value={formData.name2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="name2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditNationality2">Nationality</label>
                                            <input
                                                {...registerDirector2('nationality2')}
                                                className="form-control"
                                                type="text"
                                                id="EditNationality2"
                                                name="nationality2"
                                                value={formData.nationality2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="nationality2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditPassportNumber2">Passport
                                                Number</label>
                                            <input
                                                {...registerDirector2('passportNumber2')}
                                                className="form-control"
                                                type="text"
                                                id="EditPassportNumber2"
                                                name="passportNumber2"
                                                value={formData.passportNumber2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="passportNumber2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditPassportIssuingCountry2">Passport
                                                Issuing Country</label>
                                            <select
                                                {...registerDirector2('passportIssuingCountry2')}
                                                className="form-control"
                                                id="EditPassportIssuingCountry2"
                                                name="passportIssuingCountry2"
                                                value={formData.passportIssuingCountry2}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Country</option>
                                                <option value="Afghanistan">Afghanistan</option>
                                                <option value="Albania">Albania</option>
                                                <option value="Algeria">Algeria</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="Angola">Angola</option>
                                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                <option value="Argentina">Argentina</option>
                                                <option value="Armenia">Armenia</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Austria">Austria</option>
                                                <option value="Azerbaijan">Azerbaijan</option>
                                                <option value="Bahamas">Bahamas</option>
                                                <option value="Bahrain">Bahrain</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="Barbados">Barbados</option>
                                                <option value="Belarus">Belarus</option>
                                                <option value="Belgium">Belgium</option>
                                                <option value="Belize">Belize</option>
                                                <option value="Benin">Benin</option>
                                                <option value="Bhutan">Bhutan</option>
                                                <option value="Bolivia">Bolivia</option>
                                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina
                                                </option>
                                                <option value="Botswana">Botswana</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="Brunei">Brunei</option>
                                                <option value="Bulgaria">Bulgaria</option>
                                                <option value="Burkina Faso">Burkina Faso</option>
                                                <option value="Burundi">Burundi</option>
                                                <option value="Cabo Verde">Cabo Verde</option>
                                                <option value="Cambodia">Cambodia</option>
                                                <option value="Cameroon">Cameroon</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Central African Republic">Central African Republic
                                                </option>
                                                <option value="Chad">Chad</option>
                                                <option value="Chile">Chile</option>
                                                <option value="China">China</option>
                                                <option value="Colombia">Colombia</option>
                                                <option value="Comoros">Comoros</option>
                                                <option value="Congo, Democratic Republic of the">Congo, Democratic
                                                    Republic of
                                                    the
                                                </option>
                                                <option value="Congo, Republic of the">Congo, Republic of the
                                                </option>
                                                <option value="Costa Rica">Costa Rica</option>
                                                <option value="Croatia">Croatia</option>
                                                <option value="Cuba">Cuba</option>
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="Czech Republic">Czech Republic</option>
                                                <option value="Denmark">Denmark</option>
                                                <option value="Djibouti">Djibouti</option>
                                                <option value="Dominica">Dominica</option>
                                                <option value="Dominican Republic">Dominican Republic</option>
                                                <option value="Ecuador">Ecuador</option>
                                                <option value="Egypt">Egypt</option>
                                                <option value="El Salvador">El Salvador</option>
                                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                <option value="Eritrea">Eritrea</option>
                                                <option value="Estonia">Estonia</option>
                                                <option value="Eswatini">Eswatini</option>
                                                <option value="Ethiopia">Ethiopia</option>
                                                <option value="Fiji">Fiji</option>
                                                <option value="Finland">Finland</option>
                                                <option value="France">France</option>
                                                <option value="Gabon">Gabon</option>
                                                <option value="Gambia">Gambia</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Ghana">Ghana</option>
                                                <option value="Greece">Greece</option>
                                                <option value="Grenada">Grenada</option>
                                                <option value="Guatemala">Guatemala</option>
                                                <option value="Guinea">Guinea</option>
                                                <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                <option value="Guyana">Guyana</option>
                                                <option value="Haiti">Haiti</option>
                                                <option value="Honduras">Honduras</option>
                                                <option value="Hungary">Hungary</option>
                                                <option value="Iceland">Iceland</option>
                                                <option value="India">India</option>
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Iran">Iran</option>
                                                <option value="Iraq">Iraq</option>
                                                <option value="Ireland">Ireland</option>
                                                <option value="Israel">Israel</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Jamaica">Jamaica</option>
                                                <option value="Japan">Japan</option>
                                                <option value="Jordan">Jordan</option>
                                                <option value="Kazakhstan">Kazakhstan</option>
                                                <option value="Kenya">Kenya</option>
                                                <option value="Kiribati">Kiribati</option>
                                                <option value="Korea, North">Korea, North</option>
                                                <option value="Korea, South">Korea, South</option>
                                                <option value="Kosovo">Kosovo</option>
                                                <option value="Kuwait">Kuwait</option>
                                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                                <option value="Laos">Laos</option>
                                                <option value="Latvia">Latvia</option>
                                                <option value="Lebanon">Lebanon</option>
                                                <option value="Lesotho">Lesotho</option>
                                                <option value="Liberia">Liberia</option>
                                                <option value="Libya">Libya</option>
                                                <option value="Liechtenstein">Liechtenstein</option>
                                                <option value="Lithuania">Lithuania</option>
                                                <option value="Luxembourg">Luxembourg</option>
                                                <option value="Madagascar">Madagascar</option>
                                                <option value="Malawi">Malawi</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Maldives">Maldives</option>
                                                <option value="Mali">Mali</option>
                                                <option value="Malta">Malta</option>
                                                <option value="Marshall Islands">Marshall Islands</option>
                                                <option value="Mauritania">Mauritania</option>
                                                <option value="Mauritius">Mauritius</option>
                                                <option value="Mexico">Mexico</option>
                                                <option value="Micronesia">Micronesia</option>
                                                <option value="Moldova">Moldova</option>
                                                <option value="Monaco">Monaco</option>
                                                <option value="Mongolia">Mongolia</option>
                                                <option value="Montenegro">Montenegro</option>
                                                <option value="Morocco">Morocco</option>
                                                <option value="Mozambique">Mozambique</option>
                                                <option value="Myanmar">Myanmar</option>
                                                <option value="Namibia">Namibia</option>
                                                <option value="Nauru">Nauru</option>
                                                <option value="Nepal">Nepal</option>
                                                <option value="Netherlands">Netherlands</option>
                                                <option value="New Zealand">New Zealand</option>
                                                <option value="Nicaragua">Nicaragua</option>
                                                <option value="Niger">Niger</option>
                                                <option value="Nigeria">Nigeria</option>
                                                <option value="North Macedonia">North Macedonia</option>
                                                <option value="Norway">Norway</option>
                                                <option value="Oman">Oman</option>
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="Palau">Palau</option>
                                                <option value="Palestine">Palestine</option>
                                                <option value="Panama">Panama</option>
                                                <option value="Papua New Guinea">Papua New Guinea</option>
                                                <option value="Paraguay">Paraguay</option>
                                                <option value="Peru">Peru</option>
                                                <option value="Philippines">Philippines</option>
                                                <option value="Poland">Poland</option>
                                                <option value="Portugal">Portugal</option>
                                                <option value="Qatar">Qatar</option>
                                                <option value="Romania">Romania</option>
                                                <option value="Russia">Russia</option>
                                                <option value="Rwanda">Rwanda</option>
                                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                                <option value="Saint Lucia">Saint Lucia</option>
                                                <option value="Saint Vincent and the Grenadines">Saint Vincent and
                                                    the Grenadines
                                                </option>
                                                <option value="Samoa">Samoa</option>
                                                <option value="San Marino">San Marino</option>
                                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Senegal">Senegal</option>
                                                <option value="Serbia">Serbia</option>
                                                <option value="Seychelles">Seychelles</option>
                                                <option value="Sierra Leone">Sierra Leone</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Slovakia">Slovakia</option>
                                                <option value="Slovenia">Slovenia</option>
                                                <option value="Solomon Islands">Solomon Islands</option>
                                                <option value="Somalia">Somalia</option>
                                                <option value="South Africa">South Africa</option>
                                                <option value="South Sudan">South Sudan</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Sri Lanka">Sri Lanka</option>
                                                <option value="Sudan">Sudan</option>
                                                <option value="Suriname">Suriname</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Switzerland">Switzerland</option>
                                                <option value="Syria">Syria</option>
                                                <option value="Taiwan">Taiwan</option>
                                                <option value="Tajikistan">Tajikistan</option>
                                                <option value="Tanzania">Tanzania</option>
                                                <option value="Thailand">Thailand</option>
                                                <option value="Timor-Leste">Timor-Leste</option>
                                                <option value="Togo">Togo</option>
                                                <option value="Tonga">Tonga</option>
                                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                                <option value="Tunisia">Tunisia</option>
                                                <option value="Turkey">Turkey</option>
                                                <option value="Turkmenistan">Turkmenistan</option>
                                                <option value="Tuvalu">Tuvalu</option>
                                                <option value="Uganda">Uganda</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States">United States</option>
                                                <option value="Uruguay">Uruguay</option>
                                                <option value="Uzbekistan">Uzbekistan</option>
                                                <option value="Vanuatu">Vanuatu</option>
                                                <option value="Vatican City">Vatican City</option>
                                                <option value="Venezuela">Venezuela</option>
                                                <option value="Vietnam">Vietnam</option>
                                                <option value="Yemen">Yemen</option>
                                                <option value="Zambia">Zambia</option>
                                                <option value="Zimbabwe">Zimbabwe</option>
                                            </select>
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="passportIssuingCountry2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditPassportExpiry2">Passport Expiry
                                                Date</label>
                                            <input
                                                {...registerDirector2('passportExpiry2')}
                                                className="form-control"
                                                type="date"
                                                id="EditPassportExpiry2"
                                                name="passportExpiry2"
                                                value={formData.passportExpiry2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="passportExpiry2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmiratesId2">Emirates ID</label>
                                            <input
                                                {...registerDirector2('emiratesId2')}
                                                className="form-control"
                                                type="text"
                                                id="EditEmiratesId2"
                                                name="emiratesId2"
                                                value={formData.emiratesId2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="emiratesId2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmiratesIdExpiry2">Emirates ID
                                                Validity</label>
                                            <input
                                                {...registerDirector2('emiratesIdExpiry2')}
                                                className="form-control"
                                                type="date"
                                                id="EditEmiratesIdExpiry2"
                                                name="emiratesIdExpiry2"
                                                value={formData.emiratesIdExpiry2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="emiratesIdExpiry2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditEmail2">Email ID</label>
                                            <input
                                                {...registerDirector2('email2')}
                                                className="form-control"
                                                type="email2"
                                                id="EditEmail2"
                                                name="email2"
                                                value={formData.email2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="email2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditMobile2">Mobile Number</label>
                                            <input
                                                {...registerDirector2('mobile2')}
                                                className="form-control"
                                                type="text"
                                                id="EditMobile2"
                                                name="mobile2"
                                                value={formData.mobile2}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsDirector2}
                                                name="mobile2"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <button     disabled={loadingStatus.director2Update}
                                                type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Signatory Modal */}
                        <Modal show={show.signatory} onHide={() => handleClose('signatory')} backdrop="static"
                               keyboard={false} className="modal-lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Update Signatory Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmitSignatory(onSubmitSignatory)}>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryName">Name as per
                                                Passport</label>
                                            <input
                                                {...registerSignatory('authorized_person_name')}
                                                className="form-control"
                                                type="text"
                                                id="EditSignatoryName"
                                                name="authorized_person_name"
                                                value={formData.authorized_person_name}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_name"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label"
                                                   htmlFor="EditSignatoryNationality">Nationality</label>
                                            <input
                                                {...registerSignatory('authorized_person_nationality')}
                                                className="form-control"
                                                type="text"
                                                id="EditSignatoryNationality"
                                                name="authorized_person_nationality"
                                                value={formData.authorized_person_nationality}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_nationality"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryPassportNumber">Passport
                                                Number</label>
                                            <input
                                                {...registerSignatory('authorized_person_passport_number')}
                                                className="form-control"
                                                type="text"
                                                id="EditSignatoryPassportNumber"
                                                name="authorized_person_passport_number"
                                                value={formData.authorized_person_passport_number}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_passport_number"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryPassportIssuingCountry">Passport
                                                Issuing Country</label>
                                            <select
                                                {...registerSignatory('authorized_person_passport_issuing_country')}
                                                className="form-control"
                                                id="EditSignatoryPassportIssuingCountry"
                                                name="authorized_person_passport_issuing_country"
                                                value={formData.authorized_person_passport_issuing_country}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Country</option>
                                                <option value="Afghanistan">Afghanistan</option>
                                                <option value="Albania">Albania</option>
                                                <option value="Algeria">Algeria</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="Angola">Angola</option>
                                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                <option value="Argentina">Argentina</option>
                                                <option value="Armenia">Armenia</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Austria">Austria</option>
                                                <option value="Azerbaijan">Azerbaijan</option>
                                                <option value="Bahamas">Bahamas</option>
                                                <option value="Bahrain">Bahrain</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="Barbados">Barbados</option>
                                                <option value="Belarus">Belarus</option>
                                                <option value="Belgium">Belgium</option>
                                                <option value="Belize">Belize</option>
                                                <option value="Benin">Benin</option>
                                                <option value="Bhutan">Bhutan</option>
                                                <option value="Bolivia">Bolivia</option>
                                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina
                                                </option>
                                                <option value="Botswana">Botswana</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="Brunei">Brunei</option>
                                                <option value="Bulgaria">Bulgaria</option>
                                                <option value="Burkina Faso">Burkina Faso</option>
                                                <option value="Burundi">Burundi</option>
                                                <option value="Cabo Verde">Cabo Verde</option>
                                                <option value="Cambodia">Cambodia</option>
                                                <option value="Cameroon">Cameroon</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Central African Republic">Central African Republic
                                                </option>
                                                <option value="Chad">Chad</option>
                                                <option value="Chile">Chile</option>
                                                <option value="China">China</option>
                                                <option value="Colombia">Colombia</option>
                                                <option value="Comoros">Comoros</option>
                                                <option value="Congo, Democratic Republic of the">Congo, Democratic
                                                    Republic of
                                                    the
                                                </option>
                                                <option value="Congo, Republic of the">Congo, Republic of the
                                                </option>
                                                <option value="Costa Rica">Costa Rica</option>
                                                <option value="Croatia">Croatia</option>
                                                <option value="Cuba">Cuba</option>
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="Czech Republic">Czech Republic</option>
                                                <option value="Denmark">Denmark</option>
                                                <option value="Djibouti">Djibouti</option>
                                                <option value="Dominica">Dominica</option>
                                                <option value="Dominican Republic">Dominican Republic</option>
                                                <option value="Ecuador">Ecuador</option>
                                                <option value="Egypt">Egypt</option>
                                                <option value="El Salvador">El Salvador</option>
                                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                <option value="Eritrea">Eritrea</option>
                                                <option value="Estonia">Estonia</option>
                                                <option value="Eswatini">Eswatini</option>
                                                <option value="Ethiopia">Ethiopia</option>
                                                <option value="Fiji">Fiji</option>
                                                <option value="Finland">Finland</option>
                                                <option value="France">France</option>
                                                <option value="Gabon">Gabon</option>
                                                <option value="Gambia">Gambia</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Ghana">Ghana</option>
                                                <option value="Greece">Greece</option>
                                                <option value="Grenada">Grenada</option>
                                                <option value="Guatemala">Guatemala</option>
                                                <option value="Guinea">Guinea</option>
                                                <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                <option value="Guyana">Guyana</option>
                                                <option value="Haiti">Haiti</option>
                                                <option value="Honduras">Honduras</option>
                                                <option value="Hungary">Hungary</option>
                                                <option value="Iceland">Iceland</option>
                                                <option value="India">India</option>
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Iran">Iran</option>
                                                <option value="Iraq">Iraq</option>
                                                <option value="Ireland">Ireland</option>
                                                <option value="Israel">Israel</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Jamaica">Jamaica</option>
                                                <option value="Japan">Japan</option>
                                                <option value="Jordan">Jordan</option>
                                                <option value="Kazakhstan">Kazakhstan</option>
                                                <option value="Kenya">Kenya</option>
                                                <option value="Kiribati">Kiribati</option>
                                                <option value="Korea, North">Korea, North</option>
                                                <option value="Korea, South">Korea, South</option>
                                                <option value="Kosovo">Kosovo</option>
                                                <option value="Kuwait">Kuwait</option>
                                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                                <option value="Laos">Laos</option>
                                                <option value="Latvia">Latvia</option>
                                                <option value="Lebanon">Lebanon</option>
                                                <option value="Lesotho">Lesotho</option>
                                                <option value="Liberia">Liberia</option>
                                                <option value="Libya">Libya</option>
                                                <option value="Liechtenstein">Liechtenstein</option>
                                                <option value="Lithuania">Lithuania</option>
                                                <option value="Luxembourg">Luxembourg</option>
                                                <option value="Madagascar">Madagascar</option>
                                                <option value="Malawi">Malawi</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Maldives">Maldives</option>
                                                <option value="Mali">Mali</option>
                                                <option value="Malta">Malta</option>
                                                <option value="Marshall Islands">Marshall Islands</option>
                                                <option value="Mauritania">Mauritania</option>
                                                <option value="Mauritius">Mauritius</option>
                                                <option value="Mexico">Mexico</option>
                                                <option value="Micronesia">Micronesia</option>
                                                <option value="Moldova">Moldova</option>
                                                <option value="Monaco">Monaco</option>
                                                <option value="Mongolia">Mongolia</option>
                                                <option value="Montenegro">Montenegro</option>
                                                <option value="Morocco">Morocco</option>
                                                <option value="Mozambique">Mozambique</option>
                                                <option value="Myanmar">Myanmar</option>
                                                <option value="Namibia">Namibia</option>
                                                <option value="Nauru">Nauru</option>
                                                <option value="Nepal">Nepal</option>
                                                <option value="Netherlands">Netherlands</option>
                                                <option value="New Zealand">New Zealand</option>
                                                <option value="Nicaragua">Nicaragua</option>
                                                <option value="Niger">Niger</option>
                                                <option value="Nigeria">Nigeria</option>
                                                <option value="North Macedonia">North Macedonia</option>
                                                <option value="Norway">Norway</option>
                                                <option value="Oman">Oman</option>
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="Palau">Palau</option>
                                                <option value="Palestine">Palestine</option>
                                                <option value="Panama">Panama</option>
                                                <option value="Papua New Guinea">Papua New Guinea</option>
                                                <option value="Paraguay">Paraguay</option>
                                                <option value="Peru">Peru</option>
                                                <option value="Philippines">Philippines</option>
                                                <option value="Poland">Poland</option>
                                                <option value="Portugal">Portugal</option>
                                                <option value="Qatar">Qatar</option>
                                                <option value="Romania">Romania</option>
                                                <option value="Russia">Russia</option>
                                                <option value="Rwanda">Rwanda</option>
                                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                                <option value="Saint Lucia">Saint Lucia</option>
                                                <option value="Saint Vincent and the Grenadines">Saint Vincent and
                                                    the Grenadines
                                                </option>
                                                <option value="Samoa">Samoa</option>
                                                <option value="San Marino">San Marino</option>
                                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Senegal">Senegal</option>
                                                <option value="Serbia">Serbia</option>
                                                <option value="Seychelles">Seychelles</option>
                                                <option value="Sierra Leone">Sierra Leone</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Slovakia">Slovakia</option>
                                                <option value="Slovenia">Slovenia</option>
                                                <option value="Solomon Islands">Solomon Islands</option>
                                                <option value="Somalia">Somalia</option>
                                                <option value="South Africa">South Africa</option>
                                                <option value="South Sudan">South Sudan</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Sri Lanka">Sri Lanka</option>
                                                <option value="Sudan">Sudan</option>
                                                <option value="Suriname">Suriname</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Switzerland">Switzerland</option>
                                                <option value="Syria">Syria</option>
                                                <option value="Taiwan">Taiwan</option>
                                                <option value="Tajikistan">Tajikistan</option>
                                                <option value="Tanzania">Tanzania</option>
                                                <option value="Thailand">Thailand</option>
                                                <option value="Timor-Leste">Timor-Leste</option>
                                                <option value="Togo">Togo</option>
                                                <option value="Tonga">Tonga</option>
                                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                                <option value="Tunisia">Tunisia</option>
                                                <option value="Turkey">Turkey</option>
                                                <option value="Turkmenistan">Turkmenistan</option>
                                                <option value="Tuvalu">Tuvalu</option>
                                                <option value="Uganda">Uganda</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States">United States</option>
                                                <option value="Uruguay">Uruguay</option>
                                                <option value="Uzbekistan">Uzbekistan</option>
                                                <option value="Vanuatu">Vanuatu</option>
                                                <option value="Vatican City">Vatican City</option>
                                                <option value="Venezuela">Venezuela</option>
                                                <option value="Vietnam">Vietnam</option>
                                                <option value="Yemen">Yemen</option>
                                                <option value="Zambia">Zambia</option>
                                                <option value="Zimbabwe">Zimbabwe</option>
                                            </select>
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_passport_issuing_country"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryPassportExpiry">Passport
                                                Expiry Date</label>
                                            <input
                                                {...registerSignatory('authorized_person_passport_expiry')}
                                                className="form-control"
                                                type="date"
                                                id="EditSignatoryPassportExpiry"
                                                name="authorized_person_passport_expiry"
                                                value={formData.authorized_person_passport_expiry}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_passport_expiry"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryEmiratesId">Emirates
                                                ID</label>
                                            <input
                                                {...registerSignatory('authorized_person_emirates_id')}
                                                className="form-control"
                                                type="text"
                                                id="EditSignatoryEmiratesId"
                                                name="authorized_person_emirates_id"
                                                value={formData.authorized_person_emirates_id}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_emirates_id"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryEmiratesIdExpiry">Emirates
                                                ID Validity</label>
                                            <input
                                                {...registerSignatory('authorized_person_emirates_id_expiry')}
                                                className="form-control"
                                                type="date"
                                                id="EditSignatoryEmiratesIdExpiry"
                                                name="authorized_person_emirates_id_expiry"
                                                value={formData.authorized_person_emirates_id_expiry}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_emirates_id_expiry"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryEmail">Email ID</label>
                                            <input
                                                {...registerSignatory('authorized_person_email')}
                                                className="form-control"
                                                type="email"
                                                id="EditSignatoryEmail"
                                                name="authorized_person_email"
                                                value={formData.authorized_person_email}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_email"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label" htmlFor="EditSignatoryMobile">Mobile
                                                Number</label>
                                            <input
                                                {...registerSignatory('authorized_person_mobile')}
                                                className="form-control"
                                                type="text"
                                                id="EditSignatoryMobile"
                                                name="authorized_person_mobile"
                                                value={formData.authorized_person_mobile}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsSignatory}
                                                name="authorized_person_mobile"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <button     disabled={loadingStatus.signatoryUpdate}
                                                type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </Modal.Body>
                        </Modal>

                        {/* Bank Modal */}
                        <Modal show={show.bankDetails} onHide={() => handleClose('bankDetails')} backdrop="static"
                               keyboard={false} className="modal-lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Update Bank Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmitBank(onSubmitBankDetails)}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="EditBankerName">Banker Name</label>
                                            <input
                                                {...registerBank('banker_name')}
                                                className="form-control"
                                                type="text"
                                                id="EditBankerName"
                                                name="banker_name"
                                                value={formData.banker_name}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsBank}
                                                name="banker_name"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="EditBranchLocation">Branch
                                                Location</label>
                                            <input
                                                {...registerBank('branch_location')}
                                                className="form-control"
                                                type="text"
                                                id="EditBranchLocation"
                                                name="branch_location"
                                                value={formData.branch_location}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsBank}
                                                name="branch_location"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="EditAccountNumber">Account
                                                Number</label>
                                            <input
                                                {...registerBank('account_number')}
                                                className="form-control"
                                                type="text"
                                                id="EditAccountNumber"
                                                name="account_number"
                                                value={formData.account_number}
                                                onChange={handleInputChange}
                                            />
                                            <ErrorMessage
                                                errors={errorsBank}
                                                name="account_number"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label" htmlFor="EditCurrentBusinessVolume">Current
                                                Balance Volume (AED)</label>
                                            <select
                                                {...registerBank('current_business_volume')}
                                                className="form-control"
                                                id="EditCurrentBusinessVolume"
                                                name="current_business_volume"
                                                value={formData.current_business_volume}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Below 50K">Below 50K</option>
                                                <option value="50K-100K">50K-100K</option>
                                                <option value="100K-300K">100K-300K</option>
                                                <option value="300K-500K">300K-500K</option>
                                                <option value="500K and Above">500K and Above</option>
                                            </select>
                                            <ErrorMessage
                                                errors={errorsBank}
                                                name="current_business_volume"
                                                render={({message}) => <div className="text-danger">{message}</div>}
                                            />
                                        </div>
                                    </div>

                                    <button     disabled={loadingStatus.bankDetailsUpdate}
                                                type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </Modal.Body>
                        </Modal>


                        {/* Establishment Details */}
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <div className="">
                                    <h4 className="card-title">Establishment Details</h4>
                                </div>

                                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm m-1"
                                        style={{
                                            height: '40px',
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '0 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s, box-shadow 0.3s',
                                        }}
                                        onClick={() => handleShow('document', formData.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0056b3';
                                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'blue';
                                            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                                        }}
                                    >
                                        Update Documents <i className="fa fa-upload"></i>
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        style={{
                                            height: '40px',
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '0 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s, box-shadow 0.3s',
                                        }}
                                        onClick={() => handleShow('establish', partnerInfo.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0056b3';
                                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'blue';
                                            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                                        }}
                                    >
                                        Edit Info <i className="fa fa-edit"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 mb-4">
                                        <span className="fs-13 text-muted me-3">Status</span>
                                        {partnerInfo?.status === '0' && <span className="badge light badge-danger">
                                            <i className="fa fa-circle text-danger me-1"/>Inactive
                                        </span>}

                                        {partnerInfo?.status === '1' && <span className="badge light badge-success">
                                            <i className="fa fa-circle text-success me-1"/>Active
                                        </span>}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Name of Establishment</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.establishment_name}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Trade License Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.company_trade_license}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">View Trade License</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.company_trade_license_path}`}>View
                                                Document</a>
                                        </p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Address</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.address}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Area</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.area}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Nature of Business</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.nature_of_business}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Emirates</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.emirates}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Email</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.email}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Mobile</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.mobile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Director 1 Details */}
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Director 1 Details</h4>

                                <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        style={{
                                            height: '40px',
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '0 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s, box-shadow 0.3s',
                                        }}
                                        onClick={() => handleShow('director1', partnerInfo.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0056b3';
                                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'blue';
                                            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                                        }}
                                    >
                                        Edit Info <i className="fa fa-edit"></i>
                                    </button>
                                </div>
                            </div>


                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Name as per Passport</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_name}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Nationality</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_nationality}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_passport_number}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Issuing Country</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_passport_issuing_country}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">View Passport Issuing Country</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.director1_emirates_passport_path}`}>
                                                View Document
                                            </a>
                                        </p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Expiry Date</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_passport_expiry}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Emirates ID</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_emirates_id}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">View Emirates ID</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.director1_emirates_id_path}`}>
                                                View Document
                                            </a>
                                        </p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Emirates ID Validity</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_emirates_id_expiry}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Email ID</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_email}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Mobile Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director1_mobile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Director 2 Details */}
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Director 2 Details</h4>
                                <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        style={{
                                            height: '40px',
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '0 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s, box-shadow 0.3s',
                                        }}
                                        onClick={() => handleShow('director2', partnerInfo.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0056b3';
                                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'blue';
                                            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                                        }}
                                    >
                                        Edit Info <i className="fa fa-edit"></i>
                                    </button>
                                </div>

                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Name as per Passport</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_name}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Nationality</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_nationality}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_passport_number}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Issuing Country</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_passport_issuing_country}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">View Passport Issuing Country</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.director2_emirates_passport_path}`}>
                                                View Document
                                            </a>
                                        </p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Expiry Date</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_passport_expiry}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Emirates ID</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_emirates_id}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">View Emirates ID</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.director2_emirates_id_path}`}>
                                                View Document
                                            </a>
                                        </p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Emirates ID Validity</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_emirates_id_expiry}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Email ID</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_email}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Mobile Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.director2_mobile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signatory Details */}
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Signatory Details</h4>
                                <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        style={{
                                            height: '40px',
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '0 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s, box-shadow 0.3s',
                                        }}
                                        onClick={() => handleShow('signatory', partnerInfo.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0056b3';
                                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'blue';
                                            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                                        }}
                                    >
                                        Edit Info <i className="fa fa-edit"></i>
                                    </button>
                                </div>

                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Name as per Passport</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_name}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Nationality</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_nationality}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_passport_number}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Issuing Country</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_passport_issuing_country}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">View Passport Issuing Country</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.authorized_person_emirates_passport_path}`}>
                                                View Document
                                            </a>
                                        </p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Passport Expiry Date</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_passport_expiry}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Emirates ID</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_emirates_id}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">View Emirates ID</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.authorized_person_emirates_id_path}`}>
                                                View Document
                                            </a>
                                        </p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Emirates ID Validity</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_emirates_id_expiry}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Email ID</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_email}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Mobile Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.authorized_person_mobile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Bank Details</h4>
                                <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-sm"
                                        style={{
                                            height: '40px',
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '0 15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                                            transition: 'background-color 0.3s, box-shadow 0.3s',
                                        }}
                                        onClick={() => handleShow('bankDetails', partnerInfo.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0056b3';
                                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'blue';
                                            e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                                        }}
                                    >
                                        Edit Info <i className="fa fa-edit"></i>
                                    </button>
                                </div>

                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Banker Name</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.banker_name}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Branch Location</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.branch_location}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Account Number</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.account_number}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Current Balance Volume (AED)</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.current_business_volume}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* IATA Details */}
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">IATA Details</h4>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">IATA Accredited</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.iata_accredited}</p>
                                    </div>

                                    <div className="col-md-8 mb-3">
                                        <span className="fs-13 text-muted">View IATA Accredited</span>
                                        <p className="fs-18 fw-bold">
                                            <a className="text-decoration-underline text-info" target="_blank"
                                               href={`${Server_URL_FILE}${partnerInfo?.iata_document_path}`}>
                                                View Document
                                            </a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Staff Details */}
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Staff Details</h4>
                            </div>

                            <div className="card-body">
                                <div className="row">

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Staff Name</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.assisted_by}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Staff Id</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.assisted_by_details}</p>
                                    </div>
                                </div>


                                <div className="row">

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Staff Email</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.staff_email}</p>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <span className="fs-13 text-muted">Mobile No.</span>
                                        <p className="fs-18 fw-bold">{partnerInfo?.staff_mobile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <div className="text-center">
                        <span className="spinner spinner-border"></span>
                    </div>
                }
            </div>
        </div>
    );
}
export default PartnerDetails;