import {lazy, Suspense, useEffect,} from 'react';

/// Components
import Index from "./jsx";
import {connect, useDispatch} from 'react-redux';
import {Route, Routes, useLocation, useNavigate, useParams} from 'react-router-dom';
import timer from "./jsx/components/Timer/timer.jsx";

// action
import {checkAutoLogin} from './services/AuthService';
import {isAuthenticated} from './store/selectors/AuthSelectors';

/// Style
import "./assets/css/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Logout} from "./store/actions/AuthActions.js";

// const SignUp = lazy(() => import('./jsx/pages/Registration'));
const Login = lazy(() => import('./jsx/pages/Login'));
// const Login = lazy(() => {
//     return new Promise(resolve => {
//         setTimeout(() => resolve(import('./jsx/pages/Login')), 500);
//     });
// });

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        return (
            <Component
                {...props}
                router={{location, navigate, params}}
            />
        );
    }

    return ComponentWithRouterProp;
}

function App(props) {
    // console.log(props);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle user idle state
    const handleIdle = () => {
        dispatch(Logout(navigate));
    };

    const { isIdle } = timer(6000000, handleIdle); // 15 minutes timeout

    /* ------------------------------------------------------------------ */
    useEffect(() => {
        const autoLogin = async () => {
            const token = localStorage.getItem('adminAuthToken');
            if (token) {
                checkAutoLogin(dispatch, navigate);  // Validate token and ensure it’s not expired
            } else {
                navigate('/login');
            }
        };

        autoLogin();
    }, [dispatch, navigate]);

    // useEffect(() => {
    //     checkAutoLogin(dispatch, navigate);
    // }, []);
    /* ------------------------------------------------------------------ */


    let routeblog = (
        <Routes>
            <Route path='/login' element={<Login/>}/>
            {/*<Route path='/page-register' element={<SignUp/>}/>*/}
        </Routes>
    );

    if (props.isAuthenticated) {
        return (
            <>
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >
                    <Index/>
                </Suspense>
            </>
        );
    } else {
        return (
            <div className="vh-100">
                <Suspense fallback={
                    <div id="preloader">
                        <div className="sk-three-bounce">
                            <div className="sk-child sk-bounce1"></div>
                            <div className="sk-child sk-bounce2"></div>
                            <div className="sk-child sk-bounce3"></div>
                        </div>
                    </div>
                }
                >
                    {routeblog}
                </Suspense>
            </div>
        );
    }
};


const mapStateToProps = (state) => {
    // console.log(isAuthenticated(state));
    return {isAuthenticated: isAuthenticated(state)};
};

//export default connect((mapStateToProps)(App));
export default withRouter(connect(mapStateToProps)(App));

