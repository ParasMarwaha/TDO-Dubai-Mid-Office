import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// Image
import image02 from "../../../../assets/images/avatar/2.jpg";
import image03 from "../../../../assets/images/avatar/3.jpg";
import image04 from "../../../../assets/images/avatar/4.jpg";
import image05 from "../../../../assets/images/avatar/5.jpg";
import image06 from "../../../../assets/images/avatar/6.jpg";

const PublishedTable = () => {
	
	const [data, setData] = useState(
		document.querySelectorAll("#publishe tbody tr")
	);
	const sort = 3;
	const activePag = useRef(0);
	const [test, settest] = useState(0);

  // Active data
	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};
  // use effect
	useEffect(() => {
		setData(document.querySelectorAll("#publishe tbody tr"));
		//chackboxFun();
	}, [test]);

  
	// Active pagginarion
	activePag.current === 0 && chageData(0, sort);
  // paggination
	let paggination = Array(Math.ceil(data.length / sort))
		.fill()
		.map((_, i) => i + 1);

  // Active paggination & chage data
	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		settest(i);
	};

  
	const chackbox = document.querySelectorAll(".sorting_2 input");
	const motherChackBox = document.querySelector(".sorting_asc2 input");
  
	const chackboxFun = (type) => {
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
	};
  return (
    <div id="All" className="tab-pane">
		
      <div className="table-responsive rounded table-hover fs-14">
        <div id="publishe" className="dataTables_wrapper no-footer">
          <table
            id="example2"
            className="table mb-4 dataTablesCard p-0 card-table fs-14 review-table dataTable no-footer"
            role="grid"
            aria-describedby="example2_info"
          >
            <thead>
                <tr role="row">
                  <th className="sorting_asc2">
                    <div className="form-check checkbox-secondary ">
                      <input type="checkbox" onClick={() => chackboxFun("all")}
                        className="form-check-input" id="checkAll" required=""
                      />
                      <label className="form-check-label" htmlFor="checkAll"></label>
                    </div>
                  </th>
                  <th style={{width:"250px"}} className="sorting">
                    Customer
                  </th>
                  <th className="d-none d-lg-inline-block sorting" >
                    Event NAME
                  </th>
                  <th className="sorting">
                    Stars Review
                  </th>
                  <th className="sorting text-center">
                    Action
                  </th>
                </tr>
            </thead>
            <tbody>
              
              <tr role="row" className="odd">
                <td className="sorting_2">
                    <div className="form-check checkbox-secondary ">
                      <input
                        type="checkbox"
                        onClick={() => chackboxFun()}
                        className="form-check-input"
                        id="customCheckBox33"
                        required=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customCheckBox33"
                      ></label>
                    </div>
                </td>
                <td>
                  <div className="media align-items-center">
                    <img
                      className="img-fluid rounded me-3 d-none d-xl-inline-block"
                      width="70"
                      src={image03}
                      alt="DexignZone"
                    />
                    <div className="media-body">
                      <h4 className="font-w600 mb-1 wspace-no">
                        <Link to="" className="text-black">
                          Cindy Hawkins
                        </Link>
                      </h4>
                      <span>Sunday, 24 July 2020 04:55 PM</span>
                    </div>
                  </div>
                </td>
                <td className="d-none d-lg-table-cell">
                  The Story of Danau Toba (Musical Drama)
                </td>
                <td>
                  <span className="star-review d-inline-block mb-2 fs-16 wspace-no">
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-gray"></i>
                  </span>
                  <p className="mb-0 d-none d-xl-inline-block">
                    Ventic is one of the best vendors we've ever worked with.
                    Thanks for your wonderful, helpful service across the board.
                    It is greatly appreciated!
                  </p>
                </td>
                <td>
                  <div className="d-flex">
                    <Link to="" className="btn btn-secondary btn-rounded text-white btn-sm px-4">
                      Publish
                    </Link>
                    <Link
                      to=""
                      className="btn btn-outline-danger btn-rounded btn-sm ms-2 px-4"
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
              <tr role="row" className="even">
                <td className="sorting_2">
                 
                    <div className="form-check checkbox-secondary ">
                      <input
                        type="checkbox"
                        onClick={() => chackboxFun()}
                        className="form-check-input"
                        id="customCheckBox33"
                        required=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customCheckBox33"
                      ></label>
                    </div>
                  
                </td>
                <td>
                  <div className="media align-items-center">
                    <img
                      className="img-fluid rounded me-3 d-none d-xl-inline-block"
                      width="70"
                      src={image04}
                      alt="DexignZone"
                    />
                    <div className="media-body">
                      <h4 className="font-w600 mb-1 wspace-no">
                        <Link to="" className="text-black">
                          Glee Smiley
                        </Link>
                      </h4>
                      <span>Sunday, 24 July 2020 04:55 PM</span>
                    </div>
                  </div>
                </td>
                <td className="d-none d-lg-table-cell">
                  The Story of Danau Toba (Musical Drama)
                </td>
                <td>
                  <span className="star-review d-inline-block mb-2 fs-16 wspace-no">
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-gray"></i>
                  </span>
                  <p className="mb-0 d-none d-xl-inline-block">
                    Ventic is one of the best vendors we've ever worked with.
                    Thanks for your wonderful, helpful service across the board.
                    It is greatly appreciated!
                  </p>
                </td>
                <td>
                  <div className="d-flex">
                    <Link to="" className="btn btn-secondary btn-rounded text-white btn-sm px-4">
                      Publish
                    </Link>
                    <Link
                      to=""
                      className="btn btn-outline-danger btn-rounded btn-sm ms-2 px-4"
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
              <tr role="row" className="odd">
                <td className="sorting_2">
                 
                    <div className="form-check checkbox-secondary ">
                      <input
                        type="checkbox"
                        onClick={() => chackboxFun()}
                        className="form-check-input"
                        id="customCheckBox34"
                        required=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customCheckBox34"
                      ></label>
                    </div>
                  
                </td>
                <td>
                  <div className="media align-items-center">
                    <img
                      className="img-fluid rounded me-3 d-none d-xl-inline-block"
                      width="70"
                      src={image02}
                      alt="DexignZone"
                    />
                    <div className="media-body">
                      <h4 className="font-w600 mb-1 wspace-no">
                        <Link to="" className="text-black">
                          Louis Jovanny
                        </Link>
                      </h4>
                      <span>Sunday, 24 July 2020 04:55 PM</span>
                    </div>
                  </div>
                </td>
                <td className="d-none d-lg-table-cell">
                  The Story of Danau Toba (Musical Drama)
                </td>
                <td>
                  <span className="star-review d-inline-block mb-2 fs-16 wspace-no">
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-gray"></i>
                  </span>
                  <p className="mb-0 d-none d-xl-inline-block">
                    Ventic is one of the best vendors we've ever worked with.
                    Thanks for your wonderful, helpful service across the board.
                    It is greatly appreciated!
                  </p>
                </td>
                <td>
                  <div className="d-flex">
                    <Link to="" className="btn btn-secondary btn-rounded text-white btn-sm px-4">
                      Publish
                    </Link>
                    <Link
                      to=""
                      className="btn btn-outline-danger btn-rounded btn-sm ms-2 px-4"
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
              <tr role="row" className="even">
                <td className="sorting_2">
                 
                    <div className="form-check checkbox-secondary ">
                      <input
                        type="checkbox"
                        onClick={() => chackboxFun()}
                        className="form-check-input"
                        id="customCheckBox35"
                        required=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customCheckBox35"
                      ></label>
                    </div>
                  
                </td>
                <td>
                  <div className="media align-items-center">
                    <img
                      className="img-fluid rounded me-3 d-none d-xl-inline-block"
                      width="70"
                      src={image05}
                      alt="DexignZone"
                    />
                    <div className="media-body">
                      <h4 className="font-w600 mb-1 wspace-no">
                        <Link to="" className="text-black">
                          Louis Jovanny
                        </Link>
                      </h4>
                      <span>Sunday, 24 July 2020 04:55 PM</span>
                    </div>
                  </div>
                </td>
                <td className="d-none d-lg-table-cell">
                  The Story of Danau Toba (Musical Drama)
                </td>
                <td>
                  <span className="star-review d-inline-block mb-2 fs-16 wspace-no">
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-gray"></i>
                  </span>
                  <p className="mb-0 d-none d-xl-inline-block">
                    Ventic is one of the best vendors we've ever worked with.
                    Thanks for your wonderful, helpful service across the board.
                    It is greatly appreciated!
                  </p>
                </td>
                <td>
                  <div className="d-flex">
                    <Link to="" className="btn btn-secondary btn-rounded text-white btn-sm px-4">
                      Publish
                    </Link>
                    <Link
                      to=""
                      className="btn btn-outline-danger btn-rounded btn-sm ms-2 px-4"
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
              <tr role="row" className="odd">
                <td className="sorting_2">
                  
                    <div className="form-check checkbox-secondary ">
                      <input
                        type="checkbox"
                        onClick={() => chackboxFun()}
                        className="form-check-input"
                        id="customCheckBox36"
                        required=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="customCheckBox36"
                      ></label>
                    </div>
                  
                </td>
                <td>
                  <div className="media align-items-center">
                    <img
                      className="img-fluid rounded me-3 d-none d-xl-inline-block"
                      width="70"
                      src={image06}
                      alt="DexignZone"
                    />
                    <div className="media-body">
                      <h4 className="font-w600 mb-1 wspace-no">
                        <Link to="" className="text-black">
                          Cindy Hawkins
                        </Link>
                      </h4>
                      <span>Sunday, 24 July 2020 04:55 PM</span>
                    </div>
                  </div>
                </td>
                <td className="d-none d-lg-table-cell">
                  The Story of Danau Toba (Musical Drama)
                </td>
                <td>
                  <span className="star-review d-inline-block mb-2 fs-16 wspace-no wspace-no">
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-orange"></i>{" "}
                    <i className="fa fa-star fs-16 text-gray"></i>
                  </span>
                  <p className="mb-0 d-none d-xl-inline-block">
                    Ventic is one of the best vendors we've ever worked with.
                    Thanks for your wonderful, helpful service across the board.
                    It is greatly appreciated!
                  </p>
                </td>
                <td>
                  <div className="d-flex">
                    <Link to="" className="btn btn-secondary btn-rounded text-white btn-sm px-4">
                      Publish
                    </Link>
                    <Link
                      to=""
                      className="btn btn-outline-danger btn-rounded btn-sm ms-2 px-4"
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
            <div className="dataTables_info">
              Showing {activePag.current * sort + 1} to{" "}
              {data.length > (activePag.current + 1) * sort
                ? (activePag.current + 1) * sort
                : data.length}{" "}
              of {data.length} entries
            </div>
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="example2_paginate"
            >
              <Link
                className="paginate_button previous disabled"
                to="/reviews"
                onClick={() =>
                  activePag.current > 0 && onClick(activePag.current - 1)
                }
              >
                <i className="fa fa-angle-double-left" aria-hidden="true"></i>
              </Link>
              <span>
                {paggination.map((number, i) => (
                  <Link
                    key={i}
                    to="/reviews"
                    className={`paginate_button  ${
                      activePag.current === i ? "current" : ""
                    } `}
                    onClick={() => onClick(i)}
                  >
                    {number}
                  </Link>
                ))}
              </span>

              <Link
                className="paginate_button next"
                to="/reviews"
                onClick={() =>
                  activePag.current + 1 < paggination.length &&
                  onClick(activePag.current + 1)
                }
              >
                <i className="fa fa-angle-double-right" aria-hidden="true"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishedTable;
