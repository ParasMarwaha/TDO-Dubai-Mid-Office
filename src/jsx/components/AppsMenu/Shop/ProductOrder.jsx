import React from "react";
import { Link } from 'react-router-dom'
import PageTitle from "../../../layouts/PageTitle";

// import data from "../../table/tableData";
import { Dropdown } from "react-bootstrap";

const ProductOrder = () => {
   const chackboxFun = (type) => {
      setTimeout(() => {
         const chackbox = document.querySelectorAll(".product_order_single");
         const motherChackBox = document.querySelector(".product_order");
         for (let i = 0; i < chackbox.length; i++) {
            const element = chackbox[i];
            if (type === "all") {
               if (motherChackBox.checked) {
                  element.checked = true;
               } else {
                  element.checked = false;
               }
            } else {
               if (!element.checked) {
                  motherChackBox.checked = false;
                  break;
               } else {
                  motherChackBox.checked = true;
               }
            }
         }
      }, 100);
   };
   
   return (
      <div className="h-80">
         <PageTitle activeMenu="Product Order" motherMenu="Shop" />
         <div className="row">
            <div className="col-lg-12">
               <div className="card">
                  <div className="card-body py-0 px-3">
                     <div className="table-responsive">
                        <table className="table table-sm mb-0 text-black">
                           <thead>
                              <tr>
                                 <th className="align-middle ps-2">
                                    <div className="form-check custom-checkbox">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun("all")}
                                          className="form-check-input product_order"
                                          id="checkAll"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkAll"
                                       />
                                    </div>
                                 </th>
                                 <th className="align-middle">Order</th>
                                 <th className="align-middle pr-7">Date</th>
                                 <th className="align-middle minw200" style={{"minWidth":"200px"}}>
                                    Ship To
                                 </th>
                                 <th className="align-middle text-end">
                                    Status
                                 </th>
                                 <th className="align-middle text-end">
                                    Amount
                                 </th>
                                 <th className="no-sort text-end">Action</th>
                              </tr>
                           </thead>
                           <tbody id="orders">
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox checkbox-success">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#181</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Ricky Antony</strong>
                                    <br />
                                    <a href="mailto:ricky@example.com">
                                       ricky@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">20/04/2023</td>
                                 <td className="py-2">
                                    Ricky Antony, 2392 Main Avenue, Penasauka,
                                    New Jersey 02149
                                    <p className="mb-0 text-500">
                                       Via Flat Rate
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-success badge-sm light">
                                       Completed
                                       <span className="ms-1 fa fa-check" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$99</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"
                                          data-toggle="dropdown"
                                          data-boundary="viewport"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox ">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox1"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox1"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#182</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Kin Rossow</strong>
                                    <br />
                                    <a href="mailto:kin@example.com">
                                       kin@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">20/04/2023</td>
                                 <td className="py-2">
                                    Kin Rossow, 1 Hollywood Blvd,Beverly Hills,
                                    California 90210
                                    <p className="mb-0 text-500">
                                       Via Free Shipping
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-primary badge-sm light">
                                       Processing
                                       <span className="ms-1 fa fa-redo" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$120</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                          
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu dropdown-menu-right border py-0" align="end">
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox checkbox-secondary">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox2"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox2"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#183</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Merry Diana</strong>
                                    <br />
                                    <a href="mailto:merry@example.com">
                                       merry@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">30/04/2023</td>
                                 <td className="py-2">
                                    Merry Diana, 1 Infinite Loop, Cupertino,
                                    California 90210
                                    <p className="mb-0 text-500">
                                       Via Link Road
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-secondary badge-sm light">
                                       On Hold
                                       <span className="ms-1 fa fa-ban" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$70</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"
                                          data-toggle="dropdown"
                                          data-boundary="viewport"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox  checkbox-warning">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox3"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox3"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#184</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Bucky Robert</strong>
                                    <br />
                                    <a href="mailto:bucky@example.com">
                                       bucky@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">30/04/2023</td>
                                 <td className="py-2">
                                    Bucky Robert, 1 Infinite Loop, Cupertino,
                                    California 90210
                                    <p className="mb-0 text-500">
                                       Via Free Shipping
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-warning badge-sm light">
                                       Pending
                                       <span className="ms-1 fas fa-stream" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$92</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                         
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu dropdown-menu-right border py-0" align="end">
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox checkbox-secondary">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox4"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox4"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#185</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Rocky Zampa</strong>
                                    <br />
                                    <a href="mailto:rocky@example.com">
                                       rocky@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">30/04/2023</td>
                                 <td className="py-2">
                                    Rocky Zampa, 1 Infinite Loop, Cupertino,
                                    California 90210
                                    <p className="mb-0 text-500">
                                       Via Free Road
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-secondary badge-sm light">
                                       On Hold
                                       <span className="ms-1 fa fa-ban" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$120</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                         
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox ">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox5"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox5"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#186</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Ricky John</strong>
                                    <br />
                                    <a href="mailto:ricky@example.com">
                                       ricky@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">30/04/2023</td>
                                 <td className="py-2">
                                    Ricky John, 1 Infinite Loop, Cupertino,
                                    California 90210
                                    <p className="mb-0 text-500">
                                       Via Free Shipping
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-primary badge-sm light">
                                       Processing
                                       <span className="ms-1 fa fa-redo" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$145</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"
                                          data-toggle="dropdown"
                                          data-boundary="viewport"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox checkbox-success">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox6"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox6"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#187</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Cristofer Henric</strong>
                                    <br />
                                    <a href="mailto:cristofer@example.com">
                                       cristofer@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">30/04/2023</td>
                                 <td className="py-2">
                                    Cristofer Henric, 1 Infinite Loop,
                                    Cupertino, California 90210
                                    <p className="mb-0 text-500">
                                       Via Flat Rate
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-success badge-sm light">
                                       Completed
                                       <span className="ms-1 fa fa-check" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$55</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"
                                          data-toggle="dropdown"
                                          data-boundary="viewport"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox checkbox-secondary">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox7"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox7"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#188</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Brate Lee</strong>
                                    <br />
                                    <a href="mailto:lee@example.com">
                                       lee@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">29/04/2023</td>
                                 <td className="py-2">
                                    Brate Lee, 1 Infinite Loop, Cupertino,
                                    California 90210
                                    <p className="mb-0 text-500">
                                       Via Link Road
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-secondary badge-sm light">
                                       On Hold
                                       <span className="ms-1 fa fa-ban" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$90</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                         
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox ">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox8"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox8"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#189</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Thomas Stephenson</strong>
                                    <br />
                                    <a href="mailto:Stephenson@example.com">
                                       Stephenson@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">29/04/2023</td>
                                 <td className="py-2">
                                    Thomas Stephenson, 116 Ballifeary Road,
                                    Bamff
                                    <p className="mb-0 text-500">
                                       Via Flat Rate
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-primary badge-sm light">
                                       Processing
                                       <span className="ms-1 fa fa-redo" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$52</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                         
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox checkbox-success">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox9"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox9"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#190</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Evie Singh</strong>
                                    <br />
                                    <a href="mailto:eviewsing@example.com">
                                       eviewsing@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">29/04/2023</td>
                                 <td className="py-2">
                                    Evie Singh, 54 Castledore Road, Tunstead
                                    <p className="mb-0 text-500">
                                       Via Flat Rate
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-success badge-sm light">
                                       Completed
                                       <span className="ms-1 fa fa-check" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$90</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                         
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox checkbox-success">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox10"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox10"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#191</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">David Peters</strong>
                                    <br />
                                    <a href="mailto:peter@example.com">
                                       peter@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">29/04/2023</td>
                                 <td className="py-2">
                                    David Peters, Rhyd Y Groes, Rhosgoch, LL66
                                    0AT
                                    <p className="mb-0 text-500">
                                       Via Link Road
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-success badge-sm light">
                                       Completed
                                       <span className="ms-1 fa fa-check" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$69</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                          
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                              <tr className="btn-reveal-trigger">
                                 <td className="py-2">
                                    <div className="form-check custom-checkbox ">
                                       <input
                                          type="checkbox"
                                          onClick={() => chackboxFun()}
                                          className="form-check-input product_order_single"
                                          id="checkbox11"
                                       />
                                       <label
                                          className="form-check-label"
                                          htmlFor="checkbox11"
                                       />
                                    </div>
                                 </td>
                                 <td className="py-2">
                                    <Link to={"#"}>
                                       <strong className="text-primary">#192</strong>
                                    </Link>{" "}
                                    by <strong className="text-primary">Jennifer Johnson</strong>
                                    <br />
                                    <a href="mailto:jennifer@example.com">
                                       jennifer@example.com
                                    </a>
                                 </td>
                                 <td className="py-2">28/04/2023</td>
                                 <td className="py-2">
                                    Jennifer Johnson, Rhyd Y Groes, Rhosgoch,
                                    LL66 0AT
                                    <p className="mb-0 text-500">
                                       Via Flat Rate
                                    </p>
                                 </td>
                                 <td className="py-2 text-end">
                                    <span className="badge badge-primary badge-sm light">
                                       Processing
                                       <span className="ms-1 fa fa-redo" />
                                    </span>
                                 </td>
                                 <td className="py-2 text-end">$112</td>
                                 <td className="py-2 text-end">
                                    <Dropdown className="dropdown text-sans-serif">
                                       <Dropdown.Toggle
                                          variant=""
                                          className="btn btn-primary tp-btn-light sharp i-false"
                                          type="button"
                                          id="order-dropdown-0"                                         
                                       >
                                          <span>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                             >
                                                <g
                                                   stroke="none"
                                                   strokeWidth={1}
                                                   fill="none"
                                                   fillRule="evenodd"
                                                >
                                                   <rect
                                                      x={0}
                                                      y={0}
                                                      width={24}
                                                      height={24}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={5}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={12}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                   <circle
                                                      fill="#000000"
                                                      cx={19}
                                                      cy={12}
                                                      r={2}
                                                   />
                                                </g>
                                             </svg>
                                          </span>
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu
                                          className="dropdown-menu dropdown-menu-right border py-0"
                                          align="end"
                                       >
                                          <div className="py-2">
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Completed
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Processing
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                On Hold
                                             </Link>
                                             <Link to={"#"}
                                                className="dropdown-item"                                                
                                             >
                                                Pending
                                             </Link>
                                             <div className="dropdown-divider" />
                                             <Link to={"#"}
                                                className="dropdown-item text-danger"                                                
                                             >
                                                Delete
                                             </Link>
                                          </div>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProductOrder;
