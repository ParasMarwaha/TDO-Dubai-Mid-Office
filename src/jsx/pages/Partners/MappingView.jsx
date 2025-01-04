import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { adminAuthToken, Server_URL } from "../../../helpers/config.js";
import { Logout } from "../../../store/actions/AuthActions.js";
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import DataTable from 'react-data-table-component';
import PageTitle from "../../layouts/PageTitle.jsx";
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {ErrorMessage} from "@hookform/error-message";

function ViewAgentsPartners() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [agentsPartners, setAgentsPartners] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMappingModal, setShowMappingModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [salesPersons, setSalesPersons] = useState([]);
    const [selectedSalesPerson, setSelectedSalesPerson] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { register, handleSubmit,reset, setValue, formState: { errors } } = useForm();

    function onLogout() {
        dispatch(Logout(navigate));
    }

    async function ReadAgentsPartners(salesPersonId) {
        setLoading(true);
        try {
            let dataLS = localStorage.getItem(adminAuthToken);
            if (dataLS) {
                dataLS = JSON.parse(dataLS);
            }

            const url = `${Server_URL}admin/agents-partners/${salesPersonId}`;
            let response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dataLS.idToken}`
                },
            });
            let data = await response.json();

            if (data) {
                if(data.message === 'Session Expired' || data.message === 'Token Missing') {
                    return onLogout()
                }
                if (data.responseCode === 1) {
                    if (data.message === 'Token Missing') {
                        onLogout();
                        Swal.fire({
                            icon: 'error',
                            title: 'Session Expired ',
                            showConfirmButton: true,
                            timer: 3000,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: data.message,
                            showConfirmButton: true,
                            timer: 3000,
                        });
                    }
                } else if (data.responseCode === 2) {
                    setAgentsPartners(data.data);
                    document.getElementById('search-table').style.display = 'block';
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unexpected response status',
                    text: 'The server returned an unexpected status code',
                    showConfirmButton: true,
                    timer: 3000,
                });
            }
        } catch (e) {
            console.error(e);
            Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: e.message,
                showConfirmButton: true,
                timer: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleMappingClick = (agent) => {
        setSelectedAgent(agent);
        setValue('SalesPerson', agent.sales_person_id || '');
        setShowMappingModal(true);
        GetSalesPersons();
    };

    const handleCloseMappingModal = () => {
        setShowMappingModal(false);
        setSelectedAgent(null);
    };

    const onSubmitSalesMapping = async (formData) => {
        //console.log(formData)
        try {
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + "admin/agent-salesMapping-update";
            const res = await axios.post(api, formData, {
                headers: { authorization: `Bearer ${data.idToken}` }
            });

            // Handle different response scenarios based on the provided logic
            if (res.status === 200) {
                if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                    return onLogout()
                }
                if (res.data.responseCode === 1 && res.data.error) {
                    Swal.fire({ icon: 'error', title: res.data.message });
                } else if (res.data.responseCode === 1 && res.data.warning) {
                    Swal.fire({ icon: 'warning', title: res.data.message });
                } else if (res.data.responseCode === 2) {
                    Swal.fire({ icon: 'success', title: res.data.message });
                    handleCloseMappingModal(); // Close the modal on success
                    reset()
                    ReadAgentsPartners(selectedSalesPerson); // Refresh data
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to update mapping',
                text: error.message,
                showConfirmButton: true,
            });
        }
    };

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
            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 2) {
                setSalesPersons(res.data.data);
            } else {
                Swal.fire({ icon: 'error', title: res.data.message });
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        }
    };

    const handleSalesPersonChange = (e) => {
        const newSalesPerson = e.target.value;
        setSelectedSalesPerson(newSalesPerson);
        setAgentsPartners([]); // Clear table data
        if (newSalesPerson) {
            ReadAgentsPartners(newSalesPerson);
        }
    };

    useEffect(() => {
        GetSalesPersons();
    }, []);

    const columns = [
        { name: 'Sr No.',selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, sortable: true, width: '100px', center: true },
        { name: 'Agent Name', selector: row => row.establishment_name || '', sortable: true, center: true },
        { name: 'Email', selector: row => row.email || '', sortable: true, center: true },
        { name: 'Mobile No.', selector: row => row.mobile || '', sortable: true, center: true },
        {
            name: 'Mapping',
            cell: row => (
                <button style={{padding:"4px"}} className="btn btn-sm btn-primary" onClick={() => handleMappingClick(row)}>
                    Change
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
        }
    ];



    const filteredAgentsPartners = agentsPartners.filter(ap =>
        (ap.assisted_by || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ap.establishment_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ap.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ap.mobile || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentData = filteredAgentsPartners.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div>
            <PageTitle motherMenu="Partners" activeMenu="/partners-agents"
                       pageContent="All Agents & Partners" />

            <div className="card">
                <div className="card-header card-header-bg">
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="col-8">
                                <h4 style={{color:'purple'}} className="mb-0 primary-color">Mapped Sales Person Report</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="mb-3 col-md-4">
                            <label htmlFor="SalesPersonDropdown">Select Sales Person:</label>
                            <select
                                id="SalesPersonDropdown"
                                className="form-control"
                                value={selectedSalesPerson}
                                onChange={handleSalesPersonChange}
                            >
                                <option value="">Select a sales person</option>
                                {salesPersons.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.first_name} {person.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div id="search-table" style={{display:"none"}} className="mb-3 offset-md-8">
                            <input
                                type="text"
                                placeholder="Filter Data Table"
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: '250px', height: '40px' }}
                            />
                        </div>
                    </div>
                    {selectedSalesPerson && (
                        <div className="table-responsive">
                            <DataTable
                                columns={columns}
                                data={currentData}
                                pagination
                                paginationServer
                                paginationPerPage={rowsPerPage}
                                onChangePage={(page) => {
                                    setCurrentPage(page); // Update the current page
                                }}
                                paginationTotalRows={filteredAgentsPartners.length} // Set total rows here
                                onChangeRowsPerPage={numberOfRows => {
                                    setRowsPerPage(numberOfRows);
                                    setCurrentPage(1); // Reset to first page when changing rows per page
                                }}
                                highlightOnHover
                                dense
                                striped
                                progressPending={loading}
                                progressComponent={<div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Mapping Modal */}
            <Modal show={showMappingModal} onHide={handleCloseMappingModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Sales Mapping</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAgent && (
                        <form onSubmit={handleSubmit(onSubmitSalesMapping)}>
                            <input
                                {...register('id')}
                                type="hidden"
                                id="id"
                                name="id"
                                value={selectedAgent.id}
                            />
                            <div className="form-group">
                                <label htmlFor="SalesPerson">Sales Person</label>
                                <select
                                    id="SalesPerson"
                                    className="form-control"
                                    {...register('SalesPerson', {required: true})}
                                >
                                    <option value="">Select Sales Person</option>
                                    {salesPersons.map((person) => (
                                        <option key={person.id} value={person.id}>
                                            {person.first_name} {person.last_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.SalesPerson && <span className="text-danger">Sales Person is required</span>}
                            </div>

                            <div className="col-md-12 mb-3">
                                <label htmlFor="remarks">Remarks:</label>
                                <textarea
                                    {...register('remarks',{required:true})}
                                    id="remarks"
                                    className="form-control"
                                ></textarea>
                                {errors.remarks && <span className="text-danger">Remark is required</span>}

                            </div>

                            <div className="form-group mt-3">
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ViewAgentsPartners;
