import React from 'react';

const EditableRow = ({editFormData, handleEditFormChange, handleCancelClick}) =>{
    return(
        <>
            <tr>
                <td>
                    <input type="text" className="form-control" required = "required" placeholder = "Enter a Cust_Id" name="Cust_Id" 
                        value={editFormData.Cust_Id}
                        onChange={handleEditFormChange}
                    />
                    
                </td>   
                <td>
                    <input type="text" className="form-control" required = "required" placeholder = "Enter a Date_Join" name="Date_Join" 
                        value={editFormData.Date_Join}
                        onChange={handleEditFormChange}
                    />
                </td>
                <td>
                    <input type="text" className="form-control" required = "required" placeholder = "Enter a Cust_Name" name="Cust_Name" 
                        value={editFormData.Cust_Name}
                        onChange={handleEditFormChange}
                    />
                </td>
                <td>
                    <input type="text" className="form-control" required = "required" placeholder = "Enter a TickOrd" name="TickOrd"
                        value={editFormData.TickOrd}
                        onChange={handleEditFormChange}
                    />
                </td>
                <td>
                    <input type="text" className="form-control" required = "required" placeholder = "Enter a Location" name="Location"
                        value={editFormData.Location}
                        onChange={handleEditFormChange}
                    />
                </td>
                <td>
                    <input type="text" className="form-control" required = "required" placeholder = "Enter a Price" name="Price"
                        value={editFormData.Price}
                        onChange={handleEditFormChange}
                    />
                </td>
                <td>
                    <div className="d-flex">
                        <button type="submit" className="btn btn-primary shadow btn-sm sharp me-2"><i className="las la-check-circle scale5"></i></button>
                        <button type="button" className="btn btn-danger shadow btn-sm sharp" onClick={handleCancelClick}><i className="las la-times-circle scale5"></i></button>
                    </div>
                    
                </td>
            </tr>
            
           
        </>
    )
}
export default EditableRow;