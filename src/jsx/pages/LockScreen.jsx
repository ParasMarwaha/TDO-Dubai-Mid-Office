import React,{useState} from "react";
import { Link , useNavigate} from "react-router-dom";
// image
import logo from "../../assets/images/logo-full.png";

const LockScreen = ({ history }) => {
  const Nav = useNavigate();
  const submitHandler = (e) => {
      e.preventDefault();
      Nav("/dashboard");
   };
  const [showPassword, setShowPassword] = useState();
  return (
    <div className="authincation ">
      <div className="container ">
        <div className="row justify-content-center  align-items-center">
          <div className="col-md-8 col-lg-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <Link to="/dashboard">
                        <img src={logo} alt="" />
                      </Link>
                    </div>
                    <h4 className="text-center mb-4 ">Account Locked</h4>
                    <form onSubmit={(e) => submitHandler(e)}>
                      <div className="mb-sm-4 mb-3  position-relative">
                        <label className="form-label">
                          Password <span className="required">*</span>
                        </label>
                        <input
                            type={`${showPassword ? "text" : "password" }`} 
                            className="form-control"
                            placeholder="Password"
                        />
                        <span className={`show-pass eye ${ showPassword ? 'active' : ''}`}
                          onClick={()=>setShowPassword(!showPassword)}
                        >
                          <i className="fa fa-eye-slash" />
                          <i className="fa fa-eye" />
                        </span>
                      </div>
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                        >
                          Unlock
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
