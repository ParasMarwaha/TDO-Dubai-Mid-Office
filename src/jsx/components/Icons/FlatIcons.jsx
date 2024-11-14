import React,{useReducer} from 'react';
import { Modal } from 'react-bootstrap';

import PageTitle from '../../layouts/PageTitle';

const svgBlogData = [
    {Iconname : 'flaticon-025-dashboard'},
    {Iconname : 'flaticon-050-info'},
    {Iconname : 'flaticon-046-home'},
    {Iconname : 'flaticon-001-arrow-down'},
    {Iconname : 'flaticon-003-arrow-up'},
    {Iconname : 'flaticon-005-back-arrow'},
    {Iconname : 'flaticon-006-brightness'},
    {Iconname : 'flaticon-007-bulleye'},
    {Iconname : 'flaticon-008-check'},
    {Iconname : 'flaticon-009-check'},
    {Iconname : 'flaticon-015-chevron'},
    {Iconname : 'flaticon-016-double-chevron'},
    {Iconname : 'flaticon-017-clipboard'},
    {Iconname : 'flaticon-018-clock'},
    {Iconname : 'flaticon-020-close'},
    {Iconname : 'flaticon-021-command'},
    {Iconname : 'flaticon-023-cut'},
    {Iconname : 'flaticon-028-download'},
    {Iconname : 'flaticon-030-ellipsis'},
    {Iconname : 'flaticon-033-feather'},
    {Iconname : 'flaticon-034-filter'},
    {Iconname : 'flaticon-036-floppy-disk'},
    {Iconname : 'flaticon-038-gauge'},
    {Iconname : 'flaticon-039-goal'},
    {Iconname : 'flaticon-040-graph'},
    {Iconname : 'flaticon-043-menu'},
    {Iconname : 'flaticon-045-heart'},
    {Iconname : 'flaticon-046-home'},
    {Iconname : 'flaticon-050-info'},
    {Iconname : 'flaticon-052-inside'},
    {Iconname : 'flaticon-054-maximize'},
    {Iconname : 'flaticon-058-minus'},
    {Iconname : 'flaticon-062-pencil'},
    {Iconname : 'flaticon-063-pencil'},
    {Iconname : 'flaticon-064-pin'},
    {Iconname : 'flaticon-065-pin'},
    {Iconname : 'flaticon-070-power'},
    {Iconname : 'flaticon-071-print'},
    {Iconname : 'flaticon-073-question'},
    {Iconname : 'flaticon-075-reload'},
    {Iconname : 'flaticon-076-remove'},
    {Iconname : 'flaticon-082-share'},
    {Iconname : 'flaticon-083-share'},
    {Iconname : 'flaticon-084-share'},
    {Iconname : 'flaticon-085-signal'},
    {Iconname : 'flaticon-086-star'},
    {Iconname : 'flaticon-087-stop'},
    {Iconname : 'flaticon-088-time'},
    {Iconname : 'flaticon-089-trash'},
    {Iconname : 'flaticon-090-upload'},
    {Iconname : 'flaticon-024-dashboard'},
    {Iconname : 'flaticon-091-warning'},
    {Iconname : 'flaticon-091-warning'},
    {Iconname : 'flaticon-013-checkmark'},
    {Iconname : 'flaticon-381-gift'},
    {Iconname : 'flaticon-381-hourglass'},
    {Iconname : 'flaticon-381-id-card'},
    {Iconname : 'flaticon-381-hide'},
    {Iconname : 'flaticon-381-high-volume'},
    {Iconname : 'flaticon-381-idea'},
    {Iconname : 'flaticon-381-internet'},
    {Iconname : 'flaticon-381-magic-wand'},
    {Iconname : 'flaticon-381-settings-5'},
    {Iconname : 'flaticon-381-smartphone-4'},
    {Iconname : 'flaticon-381-sunglasses'},
    {Iconname : 'flaticon-381-umbrella'},
    {Iconname : 'flaticon-381-video-player'},
    {Iconname : 'flaticon-381-trash-1'},
    {Iconname : 'flaticon-381-switch-4'},
    {Iconname : 'flaticon-381-shuffle-1'},
    {Iconname : 'flaticon-381-quaver'},
    {Iconname : 'flaticon-381-route'},
    {Iconname : 'flaticon-381-search-2'},
    {Iconname : 'flaticon-381-panel'},
    {Iconname : 'flaticon-381-price-tag'},
    {Iconname : 'flaticon-381-photo'},
    {Iconname : 'flaticon-381-picture'},
    {Iconname : 'flaticon-381-percentage-1'},
];

const FlatIcons = () => {
    const initialState = false;
    const reducer = (state, action) =>{   
        switch (action.type){
            case 'iconModal':
                return { ...state, iconModal: !state.iconModal, content : action.content}            
            default:
                return state
        }	
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <>
            <PageTitle activeMenu={"Flat Icons"} motherMenu={"Icons"}  />
            <div className="card">
                <div className="card-body svg-area">
                    <div className="row">
                        {svgBlogData.map((item, ind)=>(
                            <div className="col-xl-2 col-lg-3 col-xxl-3 col-md-4 col-sm-6 col-12 m-b30" key={ind}>
                                <div className="svg-icons-ov style-1" onClick={() => dispatch({type:'iconModal', content: item.Iconname })} >
                                    <div className="svg-icons-prev">
                                        <i className={item.Iconname} />
                                    </div>
                                    <div className="svg-classname">{item.Iconname}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Modal className="modal fade" show={state.iconModal} onHide={()=>dispatch({type:'iconModal'})} centered>
                    <div className="modal-header">
                        <h5 className="modal-title" id="svg_img_label_Brassieresvg">{state.content}</h5>
                        <button type="button" className="btn-close" onClick={() => dispatch({type:'iconModal'})}></button>
                    </div>
                    <div className="modal-body">
                        <pre>&lt;i className={`"${state.content}"`}/&gt;</pre>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => dispatch({type:'iconModal'})}>Close</button>
                    </div>                    
                </Modal>
            </div>
        </>
    );
};

export default FlatIcons;