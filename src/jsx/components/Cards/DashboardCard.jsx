import React from "react";
import CountUp from 'react-countup';

const DashboardCard = ({Count, Title}) => {
    return (
        <div className="col-lg-4 col-sm-6">
            <div className="card">
                <div className="card-header border-0 pb-0">
                    <div className="d-flex align-items-center">
                        <h2 className="chart-num font-w600 mb-0">
                            <CountUp end={Count}  duration={3} />
                        </h2>
                    </div>
                    <div>
                        <h5 className="text-black font-w500 mb-0">{Title}</h5>
                    </div>
                </div>
                <div className="card-body pt-0"></div>
            </div>
        </div>
    )
}
export default DashboardCard;