import React, { useState } from 'react';

const ControlPanelAuth = ({ onAuthSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const correctPassword = 'admin123'; // Replace with your secure password

        if (password === correctPassword) {
            onAuthSuccess(true);  // Call the success function to allow access
        } else {
            setError('Invalid password. Please try again.');
        }
    };

    return (
        <div style={{ backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}>
            <div className="container" style={{ margin: 0, padding: 0 }}>
                <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-7 col-md-9">
                        <div className="card mx-4">
                            <div className="card-body p-4">
                                <br />
                                <h3 style={{ textAlign: "center", color: "red" }}>
                                    <b>Enter Password to Access Control Panel</b>
                                </h3>
                                <br />
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="input-group mb-3">
                                        <span className="input-group-text">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon" role="img" aria-hidden="true">
                                                <path
                                                    fill="var(--ci-primary-color, currentColor)"
                                                    d="M384,200V144a128,128,0,0,0-256,0v56H88V328c0,92.635,75.364,168,168,168s168-75.365,168-168V200ZM160,144a96,96,0,0,1,192,0v56H160ZM392,328c0,74.99-61.01,136-136,136s-136-61.01-136-136V232H392Z"
                                                    className="ci-primary"
                                                />
                                            </svg>
                                        </span>
                                        <input
                                            className="form-control"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            required
                                        />
                                    </div>
                                    {error && <p className="text-danger">{error}</p>}
                                    <div className="d-grid">
                                        <button
                                            className="btn btn-success"
                                            type="submit"
                                            style={{ backgroundColor: "red", color: "white", border: "black" }}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlPanelAuth;
