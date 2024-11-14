import React, { useState } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import {nanoid} from 'nanoid';
import data from '../Ventic/Customers/tabledata.json';
import EditableRow from '../Ventic/Customers/EditableRow';

const CustomerList = () => {
	const [timesession, setTimesession] = useState('October 29th - November 29th, 2023');
	
    //Modal box
    const [addItem, setAddItem] = useState(false);
    // Add function default data loop
    const [contacts, setContacts] = useState(data);
    
    //Add data 
    const [addFormData, setAddFormData ] = useState({
        Cust_Id:'',
        Date_Join:'',
        Cust_Name:'',
        TickOrd:'',
        Location:'',
        Price:'',
    }); 
    
    // Add contact function
    const handleAddFormChange = (event) => {
        event.preventDefault();   
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newFormData = {...addFormData};
        newFormData[fieldName] = fieldValue;
        setAddFormData(newFormData);
    };
    
     //Add Submit data
    const handleAddFormSubmit = (event)=> {
        event.preventDefault(); 
        const newContact = {
            id: nanoid(),
            Cust_Id: addFormData.Cust_Id,
            Date_Join:  addFormData.Date_Join,
            Cust_Name:  addFormData.Cust_Name ,
            TickOrd: addFormData.TickOrd,
            Location:  addFormData.Location,
            Price:  addFormData.Price,
        };
        const newContacts = [...contacts, newContact];
        setContacts(newContacts);
        setAddItem(false);
    }; 
    
     // delet function to delete data
    const handleDeleteClick = (contactId) => {
        const newContacts = [...contacts];    
        const index = contacts.findIndex((contact)=> contact.id === contactId);
        newContacts.splice(index, 1);
        setContacts(newContacts);
    }
    
    // edit form data submit
    const handleEditFormSubmit = (event) => {
        event.preventDefault();
        const editedContact = {
            id: editContactId,
            Cust_Id: editFormData.Cust_Id,
            Date_Join: editFormData.Date_Join,
            Cust_Name: editFormData.Cust_Name,
            TickOrd: editFormData.TickOrd,
            Location: editFormData.Location,
            Price: editFormData.Price,
        }
        const newContacts = [...contacts];
        const index = contacts.findIndex((contact)=> contact.id === editContactId);
        newContacts[index] = editedContact;
        setContacts(newContacts);
        setEditContactId(null);
    }
    
    // Edit function editable page loop
    const [editContactId, setEditContactId] = useState(null);
   
    // Edit function button click to edit
    const handleEditClick = ( event, contact) => {
        event.preventDefault();
        setEditContactId(contact.id);
        const formValues = {
            Cust_Id: contact.Cust_Id,
            Date_Join: contact.Date_Join,
            Cust_Name: contact.Cust_Name,
            TickOrd: contact.TickOrd,
            Location: contact.Location,
            Price: contact.Price,
        }
        setEditFormData(formValues);
    };
    
    
    // edit  data  
    const [editFormData, setEditFormData] = useState({
        Cust_Id:'',
        Date_Join:'',
        Cust_Name:'',
        TickOrd:'',
        Location:'',
        Price:'',   
    })
    
    //update data function
    const handleEditFormChange = (event) => {
        event.preventDefault();   
        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;
        const newFormData = {...editFormData};
        newFormData[fieldName] = fieldValue;
        setEditFormData(newFormData);
       
    };
    //Cencel button to same data
    const handleCancelClick = () => {
        setEditContactId(null);    
    };
    
	return(
		<>
			<div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item "><Link to={"#"}>Dashboard</Link></li>
					<li className="breadcrumb-item active"><Link to={"#"}>Customer </Link></li>
				</ol>
			</div>
			<div className="form-head mb-4 d-flex flex-wrap align-items-center">
				<div className="me-auto">
					<h2 className="font-w600 mb-0">Customer List</h2>
					<p className="">Lorem ipsum  dolor sit amet </p>
				</div>	
				<div className="input-group search-area2 d-xl-inline-flex mb-2 me-lg-4 me-md-2">
					<button className="input-group-text"><i className="flaticon-381-search-2 text-primary" /></button>
					<input type="text" className="form-control" placeholder="Search here..." />
				</div>
				<Dropdown className="dropdown custom-dropdown mb-2 period-btn" >
					<Dropdown.Toggle  as="div" className="btn btn-sm  d-flex align-items-center i-false c-pointer" >
						<svg className="primary-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M22.167 5.83362H21.0003V3.50028C21.0003 3.19087 20.8774 2.89412 20.6586 2.67533C20.4398 2.45653 20.143 2.33362 19.8336 2.33362C19.5242 2.33362 19.2275 2.45653 19.0087 2.67533C18.7899 2.89412 18.667 3.19087 18.667 3.50028V5.83362H9.33362V3.50028C9.33362 3.19087 9.2107 2.89412 8.99191 2.67533C8.77312 2.45653 8.47637 2.33362 8.16695 2.33362C7.85753 2.33362 7.56079 2.45653 7.34199 2.67533C7.1232 2.89412 7.00028 3.19087 7.00028 3.50028V5.83362H5.83362C4.90536 5.83362 4.01512 6.20237 3.35874 6.85874C2.70237 7.51512 2.33362 8.40536 2.33362 9.33362V10.5003H25.667V9.33362C25.667 8.40536 25.2982 7.51512 24.6418 6.85874C23.9854 6.20237 23.0952 5.83362 22.167 5.83362Z" fill="#0E8A74"/>
							<path d="M2.33362 22.1669C2.33362 23.0952 2.70237 23.9854 3.35874 24.6418C4.01512 25.2982 4.90536 25.6669 5.83362 25.6669H22.167C23.0952 25.6669 23.9854 25.2982 24.6418 24.6418C25.2982 23.9854 25.667 23.0952 25.667 22.1669V12.8336H2.33362V22.1669Z" fill="#0E8A74"/>
						</svg>
						<div className="text-start ms-3 flex-1">
							<span className="d-block text-black ">Change Periode</span>
							<small className="d-block text-muted">{timesession}</small>
						</div>
						<i className="fa fa-caret-down text-light scale5 ms-3"></i>
					</Dropdown.Toggle>
					<Dropdown.Menu className="dropdown-menu dropdown-menu-end">
						<Dropdown.Item onClick={()=>setTimesession("October 29th - November 29th, 2023")}>
							October 29th - November 29th, 2023
						</Dropdown.Item>
						<Dropdown.Item onClick={()=>setTimesession("July 27th - Auguts 27th, 2023")}>
							July 27th - Auguts 27th, 2023
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			<div className="row mb-5 align-items-center">
				<div className="col-xl-3 col-lg-4 mb-4 mb-lg-0">
					<Link to={"#"} className="btn btn-secondary btn-lg btn-block rounded text-white" onClick={()=> setAddItem(true)}> + New Customer</Link>
				</div>
                {/* <!-- Modal --> */}
				<Modal className="modal fade" id="addContactModal" show={addItem} onHide={setAddItem}>
					<div className="" role="document">
						<div className="">
							<form >
								<div className="modal-header">
									<h4 className="modal-title">Add Customer</h4>
									<button type="button" className="btn-close" data-dismiss="modal" onClick={()=> setAddItem(false)}></button>
								</div>
								<div className="modal-body">
									<i className="flaticon-cancel-12 close" data-dismiss="modal"></i>
									<div className="add-contact-box">
										<div className="add-contact-content">
											<div className="form-group mb-3">
												<label className="text-black font-w500">Cust_Id</label>
												<div className="contact-name">
													<input type="text" className="form-control" name="Cust_Id" required="required" placeholder="Enter a id" 
														onChange={handleAddFormChange}
													/>
												</div>
											</div>
											<div className="form-group mb-3">
												<label className="text-black font-w500">Ticket Date</label>
												<div className="contact-name">
													<input type="text" className="form-control" name="Date_Join" required="required" placeholder="Enter a date" 
														onChange={handleAddFormChange}
													/>
												</div>
											</div>
											<div className="form-group mb-3">
												<label className="text-black font-w500">Customer Name</label>
												<div className="contact-name">
													<input type="text" className="form-control" name="Cust_Name" required="required" placeholder="Enter a name" 
														onChange={handleAddFormChange}
													/>
												</div>
											</div>
											<div className="form-group mb-3">
												<label className="text-black font-w500">Ticket Summary</label>
												<div className="contact-name">
													<input type="text" className="form-control" name="TickOrd" required="required" placeholder="Enter a Summary" 
														onChange={handleAddFormChange}
													/>
												</div>
											</div>
											<div className="form-group mb-3">
												<label className="text-black font-w500">Location</label>
												<div className="contact-name">
													<input type="text" className="form-control" name="Location" required="required" placeholder="Enter a location" 
														onChange={handleAddFormChange}
													/>
												</div>
											</div>
											<div className="form-group mb-3">
												<label className="text-black font-w500">Price</label>
												<div className="contact-name">
													<input type="text" className="form-control" name="Price" required="required" placeholder="Enter a price" 
														onChange={handleAddFormChange}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button type="submit" onClick={handleAddFormSubmit} className="btn btn-primary">Add</button> 
									<button type="button"  className="btn btn-danger" onClick={()=> setAddItem(false)}> <i className="flaticon-delete-1"></i> Discard</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
				<div className="col-xl-9 col-lg-8">
					<div className="card m-0 ">
						<div className="card-body py-3 py-md-2">
							<div className="d-sm-flex  d-block align-items-center">
								<div className="d-flex mb-sm-0 mb-3 me-auto align-items-center">
									<svg className="me-2 user-ico mb-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g clipPath="url(#clip0)">
											<path d="M21 24H3C2.73478 24 2.48043 23.8946 2.29289 23.7071C2.10536 23.5196 2 23.2652 2 23V22.008C2.00287 20.4622 2.52021 18.9613 3.47044 17.742C4.42066 16.5227 5.74971 15.6544 7.248 15.274C7.46045 15.2219 7.64959 15.1008 7.78571 14.9296C7.92182 14.7583 7.9972 14.5467 8 14.328V13.322L6.883 12.206C6.6032 11.9313 6.38099 11.6036 6.22937 11.2419C6.07776 10.8803 5.99978 10.4921 6 10.1V5.96201C6.01833 4.41693 6.62821 2.93765 7.70414 1.82861C8.78007 0.719572 10.2402 0.0651427 11.784 5.16174e-06C12.5992 -0.00104609 13.4067 0.158488 14.1603 0.469498C14.9139 0.780509 15.5989 1.2369 16.1761 1.81263C16.7533 2.38835 17.2114 3.07213 17.5244 3.82491C17.8373 4.5777 17.999 5.38476 18 6.20001V10.1C17.9997 10.4949 17.9204 10.8857 17.7666 11.2495C17.6129 11.6132 17.388 11.9426 17.105 12.218L16 13.322V14.328C16.0029 14.5469 16.0784 14.7586 16.2147 14.9298C16.351 15.1011 16.5404 15.2221 16.753 15.274C18.251 15.6548 19.5797 16.5232 20.5298 17.7424C21.4798 18.9617 21.997 20.4624 22 22.008V23C22 23.2652 21.8946 23.5196 21.7071 23.7071C21.5196 23.8946 21.2652 24 21 24ZM4 22H20C19.9954 20.8996 19.6249 19.8319 18.9469 18.9651C18.2689 18.0983 17.3219 17.4816 16.255 17.212C15.6125 17.0494 15.0423 16.6779 14.6341 16.1558C14.2259 15.6337 14.0028 14.9907 14 14.328V12.908C14.0001 12.6428 14.1055 12.3885 14.293 12.201L15.703 10.792C15.7965 10.7026 15.8711 10.5952 15.9221 10.4763C15.9731 10.3574 15.9996 10.2294 16 10.1V6.20001C16.0017 5.09492 15.5671 4.03383 14.7907 3.24737C14.0144 2.46092 12.959 2.01265 11.854 2.00001C10.8264 2.04117 9.85379 2.47507 9.1367 3.21225C8.41962 3.94943 8.01275 4.93367 8 5.96201V10.1C7.99979 10.2266 8.0249 10.352 8.07384 10.4688C8.12278 10.5856 8.19458 10.6914 8.285 10.78L9.707 12.2C9.89455 12.3875 9.99994 12.6418 10 12.907V14.327C9.99724 14.9896 9.77432 15.6325 9.3663 16.1545C8.95827 16.6766 8.3883 17.0482 7.746 17.211C6.67872 17.4804 5.73137 18.0972 5.05318 18.9642C4.37498 19.8313 4.00447 20.8993 4 22Z" fill="#000"/>
											</g>
										<defs>
										<clipPath id="clip0">
										<rect width="24" height="24" fill="white"/>
										</clipPath>
										</defs>
									</svg>
									<div className="media-body">
										<p className="mb-1 fs-12 ">Total Customer</p>
										<h3 className="mb-0 font-w600 fs-22">129.000 Person</h3>
									</div>
								</div>
								<div>
									<Link to={"#"} className="btn btn-outline-primary rounded"><i className="fa fa-check-square me-2 scale4" aria-hidden="true"></i>Active</Link>
									<Link to={"#"} className="btn btn-outline-warning rounded ms-2">Edit</Link>
									<Link to={"#"} className="btn btn-danger rounded ms-2">Delete</Link>
								</div>
							</div>							
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-12">
					<div className="table-responsive dataTables_wrapper rounded">
                        <form onSubmit={handleEditFormSubmit}>
                            <table	className='table customer-table display mb-4 fs-14  card-table no-footer'>
                                <thead>
                                    <tr role='row'>
                                        <th>Cust.Id</th>
                                        <th>Joining Date</th>
                                        <th>Customer Name</th>
                                        <th>Ticket Ordered</th>
                                        <th>Location</th>
										<th>Last Order</th>
                                        <th>Total Spent</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact, index)=>(
                                        <>
                                            {editContactId === contact.id ? 
                                                ( <EditableRow  editFormData={editFormData} handleEditFormChange={handleEditFormChange} handleCancelClick={handleCancelClick}/> ) : 
                                                (  
                                                    <tr  key={index}>
                                                        <td>{contact.Cust_Id}</td>
                                                        <td>{contact.Date_Join}</td>
                                                        <td>{contact.Cust_Name}</td>
                                                        <td>{contact.TickOrd}</td>
                                                        <td>{contact.Location}</td>
														<td>04/11/2023 12:34 AM</td>
                                                        <td className="text-secondary font-w500">{contact.Price}</td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={"#"}
                                                                    onClick={(event) => handleEditClick(event, contact)} 
                                                                >
                                                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#FF7B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                    </svg>
                                                                </Link>
                                                                <Link to={"#"} className="ms-4" onClick={()=>handleDeleteClick(contact.id)}>
                                                                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<path d="M3 6H5H21" stroke="#FF3131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
																		<path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#FF3131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
																	</svg>	
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </>    
                                    ))}							
                                </tbody> 
                            </table>	
							
                        </form>    
					</div>
				</div>
			</div>
		</>
		
	)
}
export default CustomerList;