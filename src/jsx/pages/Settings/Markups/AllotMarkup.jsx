import React, { useState } from "react";
import PageTitle from "../../../layouts/PageTitle.jsx";

function AllotMarkup() {
    const [markupPlan, setMarkupPlan] = useState('');
    const [travelAgent, setTravelAgent] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Markup Plan:', markupPlan);
        console.log('Travel Agent:', travelAgent);
        // Add logic to handle form submission here
    };

    return (
        <div>
            <PageTitle
                motherMenu="Control Panel"
                activeMenu="Flights / Allot Markups"
                pageContent="Flights / Allot Markups"
            />

            <div className="card mb-4">
                <div className="card-body">
                    <div className="text-center mb-4">
                        <h2><b>Allot New Markup</b></h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-sm-4">
                                <label htmlFor="MarkupPlans">Markup Plans</label>
                                <select
                                    id="MarkupPlans"
                                    className="form-control"
                                    value={markupPlan}
                                    onChange={(e) => setMarkupPlan(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="97">test plan training</option>
                                </select>
                            </div>
                            <div className="col-sm-4">
                                <label htmlFor="TravelAgents">Travel Agents</label>
                                <input
                                    type="text"
                                    id="TravelAgents"
                                    className="form-control"
                                    value={travelAgent}
                                    onChange={(e) => setTravelAgent(e.target.value)}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-sm-4 d-flex align-items-end">
                                <button type="submit" className="w-100 btn btn-primary">Add</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="text-center my-4">
                    <h2><b>Already Allotted Markups</b></h2>
                    <span>(Get details of those agents who have enrolled in these plans)</span>
                </div>

                <div className="row">
                    <div className="col-lg-3 col-sm-6 m-2">
                        <div className="card mb-4" style={{maxHeight: '100px',minHeight: '80px', backgroundColor: 'blue'}}>
                            <div className="card-body text-white d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="fs-6 fw-semibold" style={{fontSize: '1rem'}}>
                                        <span>test plan training</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-info btn-sm px-2 py-1"
                                        style={{fontSize: '0.75rem'}}
                                    >
                                        Get Info
                                    </button>
                                </div>
                                <div className="mt-2" style={{fontSize: '0.875rem'}}>
                                    Status: active
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllotMarkup;
