import React,{useReducer} from 'react';
import {Link} from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import PageTitle from '../../layouts/PageTitle';
import { SvgDetail } from './DataSvg';

const svgBlogData = [
    {Iconname : 'bell.svg', svgtype : SvgDetail.Bell,},
    {Iconname : 'message.svg', svgtype : SvgDetail.Message},
    {Iconname : 'gift.svg', svgtype : SvgDetail.Gift},
    {Iconname : 'up.svg', svgtype : SvgDetail.Up},
    {Iconname : 'down.svg', svgtype : SvgDetail.Down},
    {Iconname : 'graph.svg', svgtype : SvgDetail.Graph},
    {Iconname : 'progress.svg', svgtype : SvgDetail.Progress},
    {Iconname : 'circle.svg', svgtype : SvgDetail.Circle},
    {Iconname : 'movie.svg', svgtype : SvgDetail.Movie},
    {Iconname : 'doller.svg', svgtype : SvgDetail.Doller},
    {Iconname : 'calendar.svg', svgtype : SvgDetail.Calendar},
    {Iconname : 'location.svg', svgtype : SvgDetail.Location},
    {Iconname : 'user.svg', svgtype : SvgDetail.User},
    {Iconname : 'edit.svg', svgtype : SvgDetail.Edit},
];

const SvgIcons = () => {
    const initialState = false;
    const reducer = (state, action) =>{   
        switch (action.type){
            case 'imageModal':
                return { ...state, imageModal: !state.imageModal, content : action.content}
            case 'svgModal':
                return { ...state, svgModal: !state.svgModal, content : action.content, title: action.title}			
            default:
                return state
        }	
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <>
            <PageTitle activeMenu={"SVG Icons"} motherMenu={"Icons"} />
                <div className="row">
					<div className="col-xl-12">
						<div className="card p-0">
							<div className="card-header"><h4 className="text-black mb-0">SVG Icons</h4></div>
                            <div className="card-body svg-area px-3">
                                <div className="row">							
                                    {svgBlogData.map((item, ind)=>(
                                        <div className="col-xl-2 col-lg-3 col-xxl-3 col-md-4 col-sm-6 col-12" key={ind}>	
                                            <div className="svg-icons-ov">
                                                <div className="svg-icons-prev">
                                                    <div dangerouslySetInnerHTML={{ __html: item.svgtype }} />                                                    
                                                </div>
                                                <div className="svg-classname">{item.Iconname}</div>
                                                <div className="svg-icon-popup">
                                                    <Link to={"#"}  onClick={() => dispatch({type:'imageModal', content: item.Iconname })} className="btn btn-sm btn-brand"><i className="fa-solid fa-image"></i></Link>
                                                    <Link to={"#"} onClick={() => dispatch({type:'svgModal', content: item.Iconname, title : item.svgtype })} className="btn btn-sm btn-brand"><i className="fa fa-code"></i></Link>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>    
                    <Modal className="modal fade" show={state.imageModal} onHide={()=>dispatch({type:'imageModal'})} centered>                                
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="svg_img_label_Brassieresvg">{state.content}</h5>
                                <button type="button" className="btn-close" onClick={() => dispatch({type:'imageModal'})}></button>
                            </div>
                            <div className="modal-body">                               
                                <pre>                           
    {`import MyImage from "../assets/images/iconly/${state.content}";
    export default function Imageblog() {   
    return  
        <div>
        <img src={MyImage} alt="Example" />   
        </div>
    }`}
    ;
                                </pre>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => dispatch({type:'imageModal'})}>Close</button>
                            </div>
                        </div>
                    
                    </Modal>
                    <Modal className="modal fade" show={state.svgModal} onHide={()=>dispatch({type:'svgModal'})} centered >                    
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="svg_inline_label_Brassieresvg">{state.content}</h5>
                                <button type="button" className="btn-close"   onClick={() => dispatch({type:'svgModal'})}>
                                </button>
                            </div>
                            <div className="modal-body">
<pre>   
   {state.title}    
</pre>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => dispatch({type:'svgModal'})}>Close</button>
                            </div>
                        </div>
                        
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default SvgIcons;