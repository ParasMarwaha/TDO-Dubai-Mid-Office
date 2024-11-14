import {Fragment, useContext} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {Link} from "react-router-dom";

import {ThemeContext} from "../../../context/ThemeContext";
import {navtoggle} from "../../../store/actions/AuthActions";
// import logo2 from "../../assets/images/tdo-logo-white.png";
import logo from "../../../assets/images/tdo-logo-white-2.png";

const NavHader = () => {
    // const [toggle, setToggle] = useState(false);
    const {navigationHader, openMenuToggle, background} = useContext(ThemeContext);

    const dispatch = useDispatch();
    const sideMenu = useSelector(state => state.sideMenu);
    const handleToogle = () => {
        dispatch(navtoggle());
    };

    return (
        <div className="nav-header">
            <Link to="/dashboard" className="brand-logo">
                {background.value === "dark" || navigationHader !== "color_1" ? (
                    <Fragment>
                        <svg className="logo-abbr" width="54" height="54" viewBox="0 0 54 54" fill="none">
                            <rect className="svg-logo-rect" width="54" height="54" rx="14" fill="#0E8A74"/>
                            <path className="svg-logo-path"
                                  d="M13 17H24.016L31.802 34.544L38.33 17H40.948L31.972 40.8H23.54L13 17Z"
                                  fill="white"/>
                        </svg>

                        <svg className="brand-title" width="97" height="25" fill="none">
                            <path className="svg-logo-text"
                                  d="M20.88 3.06L13.2 24H8.1L.42 3.06h4.5l5.76 16.65 5.73-16.65h4.47zm17.968 12.27c0 .6-.04 1.14-.12 1.62h-12.15c.1 1.2.52 2.14 1.26 2.82s1.65 1.02 2.73 1.02c1.56 0 2.67-.67 3.33-2.01h4.53c-.48 1.6-1.4 2.92-2.76 3.96-1.36 1.02-3.03 1.53-5.01 1.53-1.6 0-3.04-.35-4.32-1.05-1.26-.72-2.25-1.73-2.97-3.03-.7-1.3-1.05-2.8-1.05-4.5 0-1.72.35-3.23 1.05-4.53s1.68-2.3 2.94-3 2.71-1.05 4.35-1.05c1.58 0 2.99.34 4.23 1.02 1.26.68 2.23 1.65 2.91 2.91.7 1.24 1.05 2.67 1.05 4.29zm-4.35-1.2c-.02-1.08-.41-1.94-1.17-2.58-.76-.66-1.69-.99-2.79-.99-1.04 0-1.92.32-2.64.96-.7.62-1.13 1.49-1.29 2.61h7.89zm16.626-6.99c1.98 0 3.58.63 4.8 1.89 1.22 1.24 1.83 2.98 1.83 5.22V24h-4.2v-9.18c0-1.32-.33-2.33-.99-3.03-.66-.72-1.56-1.08-2.7-1.08-1.16 0-2.08.36-2.76 1.08-.66.7-.99 1.71-.99 3.03V24h-4.2V7.38h4.2v2.07c.56-.72 1.27-1.28 2.13-1.68.88-.42 1.84-.63 2.88-.63zm15.514 3.69v8.04c0 .56.13.97.39 1.23.28.24.74.36 1.38.36h1.95V24h-2.64c-3.54 0-5.31-1.72-5.31-5.16v-8.01h-1.98V7.38h1.98V3.27h4.23v4.11h3.72v3.45h-3.72zm8.871-5.43c-.74 0-1.36-.23-1.86-.69-.48-.48-.72-1.07-.72-1.77s.24-1.28.72-1.74c.5-.48 1.12-.72 1.86-.72s1.35.24 1.83.72c.5.46.75 1.04.75 1.74s-.25 1.29-.75 1.77c-.48.46-1.09.69-1.83.69zm2.07 1.98V24h-4.2V7.38h4.2zm3.07 8.31c0-1.72.35-3.22 1.05-4.5.7-1.3 1.67-2.3 2.91-3 1.24-.72 2.66-1.08 4.26-1.08 2.06 0 3.76.52 5.1 1.56 1.36 1.02 2.27 2.46 2.73 4.32h-4.53c-.24-.72-.65-1.28-1.23-1.68-.56-.42-1.26-.63-2.1-.63-1.2 0-2.15.44-2.85 1.32-.7.86-1.05 2.09-1.05 3.69 0 1.58.35 2.81 1.05 3.69.7.86 1.65 1.29 2.85 1.29 1.7 0 2.81-.76 3.33-2.28h4.53c-.46 1.8-1.37 3.23-2.73 4.29s-3.06 1.59-5.1 1.59c-1.6 0-3.02-.35-4.26-1.05-1.24-.72-2.21-1.72-2.91-3-.7-1.3-1.05-2.81-1.05-4.53z"
                                  fill="#194039"/>
                        </svg>
                    </Fragment>
                ) : (
                    <Fragment>
                        {/*<img src="/src/assets/images/tdo-logo-white-2.png" alt="TDO DUBAI LOGO" style={{width: '140px'}}/>*/}
                        <img src={logo} alt="TDO DUBAI LOGO" style={{width: '100%'}}/>
                        {/*<img src="http://157.119.40.184/assets/img/TDO_DUBAI.png" alt="TDO DUBAI LOGO" style={{width: '100%'}}/>*/}

                        {/*<svg className="logo-abbr" width="54" height="54" viewBox="0 0 54 54" fill="none">*/}
                        {/*    <rect className="svg-logo-rect" width="54" height="54" rx="14" fill="#0E8A74"/>*/}
                        {/*    <path className="svg-logo-path"*/}
                        {/*          d="M13 17H24.016L31.802 34.544L38.33 17H40.948L31.972 40.8H23.54L13 17Z"*/}
                        {/*          fill="white"/>*/}
                        {/*</svg>*/}

                        {/*<svg className="brand-title" width="97" height="25" viewBox="0 0 100 100" fill="none">*/}
                        {/*    <path className="svg-logo-text"*/}
                        {/*          d="M0 0 C0.91004613 3.07140568 1.33694826 5.79899154 1 9 C0.01 9.66 -0.98 10.32 -2 11 C-2.28571429 3.57142857 -2.28571429 3.57142857 0 0 Z "*/}
                        {/*          fill="#583533" transform="translate(1026,432)"/>*/}
                        {/*    <path className="svg-logo-text"*/}
                        {/*          d="M0 0 C3.63094642 2.64960955 5.89851796 5.01824456 8 9 C6.68 8.34 5.36 7.68 4 7 C4 6.34 4 5.68 4 5 C2.68 4.67 1.36 4.34 0 4 C0 2.68 0 1.36 0 0 Z "*/}
                        {/*          fill="#F8C3BE" transform="translate(1008,376)"/>*/}
                        {/*</svg>*/}
                    </Fragment>
                )}
            </Link>

            <div className="nav-control"
                 onClick={() => {
                     handleToogle()
                     openMenuToggle();
                 }}
            >
                <div className={`hamburger ${sideMenu ? "is-active" : ""}`}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
            </div>
        </div>
    );
};

export default NavHader;
