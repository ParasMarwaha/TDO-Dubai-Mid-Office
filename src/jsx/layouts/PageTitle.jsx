import React from "react";
import { Link } from "react-router-dom";

const PageTitle = ({ motherMenu, activeMenu, pageContent }) => {
  let path = window.location.pathname.split("/");

  return (
    <div className="row page-titles">		
		<ol className="breadcrumb">
			<li className="breadcrumb-item "><Link to={``}>{motherMenu}</Link></li>
			<li className="breadcrumb-item active"><Link to={activeMenu}>{pageContent}</Link></li>
		</ol>
    </div>
  );
};

export default PageTitle;