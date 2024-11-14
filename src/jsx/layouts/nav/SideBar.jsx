// import React, {useContext, useEffect, useReducer, useState} from "react";
// import {Collapse} from 'react-bootstrap';
//
// /// Link
// import {Link} from "react-router-dom";
// import {MenuList} from './Menu';
// import {ThemeContext} from "../../../context/ThemeContext";
// import {useScrollPosition} from "@n8tb1t/use-scroll-position";
//
// const reducer = (previousState, updatedState) => ({
//     ...previousState,
//     ...updatedState,
// });
//
// const initialState = {
//     active: "",
//     activeSubmenu: "",
// }
//
// const SideBar = () => {
//     const {
//         iconHover,
//         sidebarposition,
//         headerposition,
//         sidebarLayout,
//         ChangeIconSidebar,
//     } = useContext(ThemeContext);
//
//     const date = new Date();
//
//     const [state, setState] = useReducer(reducer, initialState);
//
//     const handleMenuActive = status => {
//         setState({active: status});
//         if (state.active === status) {
//             setState({active: ""});
//         }
//     }
//
//     const handleSubmenuActive = (status) => {
//         setState({activeSubmenu: status})
//         if (state.activeSubmenu === status) {
//             setState({activeSubmenu: ""})
//         }
//     }
//
//     // For scroll
//     const [hideOnScroll, setHideOnScroll] = useState(true)
//     useScrollPosition(
//         ({prevPos, currPos}) => {
//             const isShow = currPos.y > prevPos.y
//             if (isShow !== hideOnScroll) setHideOnScroll(isShow)
//         },
//         [hideOnScroll]
//     )
//
//     // ForAction Menu
//     let path = window.location.pathname;
//     path = path.split("/");
//     path = path[path.length - 1];
//
//     useEffect(() => {
//         MenuList.forEach((data) => {
//             data.content?.forEach((item) => {
//                 if (path === item.to) {
//                     setState({active: data.title})
//                 }
//                 item.content?.forEach(ele => {
//                     if (path === ele.to) {
//                         setState({activeSubmenu: item.title, active: data.title})
//                     }
//                 })
//             })
//         })
//     }, [path]);
//
//     return (
//         <div
//             onMouseEnter={() => ChangeIconSidebar(true)}
//             onMouseLeave={() => ChangeIconSidebar(false)}
//             className={`deznav ${iconHover} ${
//                 sidebarposition.value === "fixed" &&
//                 sidebarLayout.value === "horizontal" &&
//                 headerposition.value === "static"
//                     ? hideOnScroll > 120
//                         ? "fixed"
//                         : ""
//                     : ""
//             }`}
//         >
//
//             <div className="deznav-scroll">
//                 <ul className="metismenu" id="menu">
//                     {MenuList.map((data, index) => {
//                         let menuClass = data.classsChange;
//
//                         if (menuClass === "menu-title") {
//                             return (
//                                 <li className={menuClass} key={index}>
//                                     {data.title}
//                                 </li>
//                             )
//                         } else {
//                             return (
//                                 <li className={`has-menu ${state.active === data.title ? 'mm-active' : ''}${data.to === path ? 'mm-active' : ''}`}
//                                     key={index}
//                                 >
//                                     {data.content && data.content.length > 0 ?
//                                         <>
//                                             <Link to={"#"}
//                                                   className="has-arrow ai-icon"
//                                                   onClick={() => {
//                                                       handleMenuActive(data.title)
//                                                   }}
//                                             >
//                                                 {data.iconStyle}{" "}
//                                                 <span className="nav-text">{data.title}
//                                                     <span className="badge badge-xs style-1 badge-danger ms-2">
//                                                         {data.update}
//                                                     </span>
//                                                 </span>
//                                             </Link>
//
//                                             <Collapse in={state.active === data.title ? true : false}>
//                                                 <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
//                                                     {data.content && data.content.map((data, index) => {
//                                                         return (
//                                                             <li key={index}
//                                                                 className={`${state.activeSubmenu === data.title ? "mm-active" : ""}${data.to === path ? 'mm-active' : ''}`}
//                                                             >
//                                                                 {data.content && data.content.length > 0 ?
//                                                                     <>
//                                                                         <Link to={data.to}
//                                                                               className={data.hasMenu ? 'has-arrow' : ''}
//                                                                               onClick={() => {
//                                                                                   handleSubmenuActive(data.title)
//                                                                               }}
//                                                                         >
//                                                                             {data.title}
//                                                                         </Link>
//                                                                         <Collapse
//                                                                             in={state.activeSubmenu === data.title ? true : false}>
//                                                                             <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
//                                                                                 {data.content && data.content.map((data, index) => {
//                                                                                     return (
//                                                                                         <li key={index}>
//                                                                                             <Link
//                                                                                                 className={`${path === data.to ? "mm-active" : ""}`}
//                                                                                                 to={data.to}>{data.title}</Link>
//                                                                                         </li>
//                                                                                     )
//                                                                                 })}
//                                                                             </ul>
//                                                                         </Collapse>
//                                                                     </>
//                                                                     :
//                                                                     <Link to={data.to}
//                                                                           className={`${data.to === path ? 'mm-active' : ''}`}
//                                                                     >
//                                                                         {data.title}
//                                                                     </Link>
//                                                                 }
//
//                                                             </li>
//
//                                                         )
//                                                     })}
//                                                 </ul>
//                                             </Collapse>
//                                         </>
//                                         :
//                                         <Link to={data.to} className={`${data.to === path ? 'mm-active' : ''}`}>
//                                             {data.iconStyle}{" "}
//                                             <span className="nav-text">{data.title}
//                                                 <span className="badge badge-xs style-1 badge-danger ms-2">
//                                                     {data.update}
//                                                 </span>
//                                             </span>
//                                         </Link>
//                                     }
//                                 </li>
//                             )
//                         }
//                     })}
//                 </ul>
//
//                 {/*<div className="plus-box">*/}
//                 {/*    <p className="fs-16 font-w500 mb-3">Ticket Sales Weekly Report</p>*/}
//                 {/*    <Link className="text-white fs-14" to="/analytics">Learn more</Link>*/}
//                 {/*</div>*/}
//
//                 <div className="copyright">
//                     <p>
//                         <strong>Travel Deals Online</strong> © {date.getFullYear()} All Rights Reserved
//                     </p>
//
//                     {/*<p>Made with <span className="heart"*/}
//                     {/*                   onClick={(e) => e.target.classList.toggle('heart-blast')}></span> by VMM</p>*/}
//                 </div>
//             </div>
//         </div>
//     );
//
// }
//
// export default SideBar;


import React, { useContext, useEffect, useReducer, useState } from "react";
import { Collapse } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { MenuList } from './Menu';
import { ThemeContext } from "../../../context/ThemeContext";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

const reducer = (previousState, updatedState) => ({
    ...previousState,
    ...updatedState,
});

const initialState = {
    activeMenu: "",  // Only one menu active at a time
    activeSubmenu: "", // Only one submenu active at a time
};

const SideBar = () => {
    const { iconHover, sidebarposition, headerposition, sidebarLayout, ChangeIconSidebar } = useContext(ThemeContext);
    const date = new Date();

    const [state, setState] = useReducer(reducer, initialState);

    const handleMenuActive = (menuTitle) => {
        setState({
            activeMenu: state.activeMenu === menuTitle ? "" : menuTitle,  // Toggle active menu
            activeSubmenu: "",  // Reset submenu when switching menus
        });
    };

    const handleSubmenuActive = (submenuTitle) => {
        setState({
            activeSubmenu: state.activeSubmenu === submenuTitle ? "" : submenuTitle,  // Toggle active submenu
        });
    };

    // For scroll handling
    const [hideOnScroll, setHideOnScroll] = useState(true);
    useScrollPosition(({ prevPos, currPos }) => {
        const isShow = currPos.y > prevPos.y;
        if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    }, [hideOnScroll]);

    // To check the current path for active items
    let path = window.location.pathname;
    path = path.split("/");
    path = path[path.length - 1];

    // UseEffect to set active menus based on current path
    useEffect(() => {
        MenuList.forEach((data) => {
            data.content?.forEach((item) => {
                if (path === item.to) {
                    setState({ activeMenu: data.title });
                }
                item.content?.forEach(ele => {
                    if (path === ele.to) {
                        setState({ activeMenu: data.title, activeSubmenu: item.title });
                    }
                });
            });
        });
    }, [path]);

    return (
        <div
            onMouseEnter={() => ChangeIconSidebar(true)}
            onMouseLeave={() => ChangeIconSidebar(false)}
            className={`deznav ${iconHover} ${
                sidebarposition.value === "fixed" &&
                sidebarLayout.value === "horizontal" &&
                headerposition.value === "static"
                    ? hideOnScroll > 120 ? "fixed" : ""
                    : ""
            }`}
        >
            <div className="deznav-scroll">
                <ul className="metismenu" id="menu">
                    {MenuList.map((data, index) => {
                        let menuClass = data.classsChange;

                        if (menuClass === "menu-title") {
                            return (
                                <li className={menuClass} key={index}>
                                    {data.title}
                                </li>
                            );
                        } else {
                            return (
                                <li className={`has-menu ${state.activeMenu === data.title ? 'mm-active' : ''}${data.to === path ? 'mm-active' : ''}`} key={index}>
                                    {data.content && data.content.length > 0 ? (
                                        <>
                                            <Link to={"#"} className="has-arrow ai-icon" onClick={() => handleMenuActive(data.title)}>
                                                {data.iconStyle}{" "}
                                                <span className="nav-text">{data.title}
                                                    {data.update && <span className="badge badge-xs style-1 badge-danger ms-2">{data.update}</span>}
                                                </span>
                                            </Link>

                                            <Collapse in={state.activeMenu === data.title}>
                                                <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                                    {data.content.map((subMenu, index) => {
                                                        return (
                                                            <li key={index} className={`${state.activeSubmenu === subMenu.title ? "mm-active" : ""}${subMenu.to === path ? 'mm-active' : ''}`}>
                                                                {subMenu.content && subMenu.content.length > 0 ? (
                                                                    <>
                                                                        <Link to={subMenu.to || "#"} className={subMenu.hasMenu ? 'has-arrow' : ''} onClick={() => handleSubmenuActive(subMenu.title)}>
                                                                            {subMenu.title}
                                                                        </Link>
                                                                        <Collapse in={state.activeSubmenu === subMenu.title}>
                                                                            <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                                                                {subMenu.content.map((subSubMenu, index) => (
                                                                                    <li key={index}>
                                                                                        <Link to={subSubMenu.to} className={`${path === subSubMenu.to ? "mm-active" : ""}`}>
                                                                                            {subSubMenu.title}
                                                                                        </Link>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </Collapse>
                                                                    </>
                                                                ) : (
                                                                    <Link to={subMenu.to} className={`${subMenu.to === path ? 'mm-active' : ''}`}>
                                                                        {subMenu.title}
                                                                    </Link>
                                                                )}
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </Collapse>
                                        </>
                                    ) : (
                                        <Link to={data.to} className={`${data.to === path ? 'mm-active' : ''}`}>
                                            {data.iconStyle}{" "}
                                            <span className="nav-text">{data.title}
                                                {data.update && <span className="badge badge-xs style-1 badge-danger ms-2">{data.update}</span>}
                                            </span>
                                        </Link>
                                    )}
                                </li>
                            );
                        }
                    })}
                </ul>

                <div className="copyright">
                    <p>
                        <strong>Travel Deals Online</strong> © {date.getFullYear()} All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
