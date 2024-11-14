import React,{useReducer} from 'react';
import {Link} from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import PageTitle from '../../layouts/PageTitle';
import { SvgDetail } from './DataSvg';


const svgBlogData = [
    {Iconname : 'activity.svg', svgtype : SvgDetail.Activity,},
    {Iconname : 'airplay.svg', svgtype : SvgDetail.Airplay,},
    {Iconname : 'alert-circle.svg', svgtype : SvgDetail.AlertCircle,},
    {Iconname : 'alert-octagon..svg', svgtype : SvgDetail.AlertOctagon,},
    {Iconname : 'alert-triangle.svg', svgtype : SvgDetail.AlertTriangle,},
    {Iconname : 'align-center.svg', svgtype : SvgDetail.AlignCenter,},
    {Iconname : 'align-justify.svg', svgtype : SvgDetail.AlignJustify,},
    {Iconname : 'align-left.svg', svgtype : SvgDetail.AlignLeft,},
    {Iconname : 'align-right.svg', svgtype : SvgDetail.AlignRight,},
    {Iconname : 'anchor.svg', svgtype : SvgDetail.Anchor,},
    {Iconname : 'aperture.svg', svgtype : SvgDetail.Aperture,},
    {Iconname : 'archive.svg', svgtype : SvgDetail.Archive,},
    {Iconname : 'arrow-down.svg', svgtype : SvgDetail.ArrowDown,},
    {Iconname : 'arrow-down-circle.svg', svgtype : SvgDetail.ArrowDownCircle,},
    {Iconname : 'arrow-down-left.svg', svgtype : SvgDetail.ArrowDownLeft,},
    {Iconname : 'arrow-down-right.svg', svgtype : SvgDetail.ArrowDownRight,},
    {Iconname : 'arrow-left.svg', svgtype : SvgDetail.ArrowLeft,},
    {Iconname : 'arrow-left-circle.svg', svgtype : SvgDetail.ArrowLeftCircle,},
    {Iconname : 'arrow-right.svg', svgtype : SvgDetail.ArrowRight,},
    {Iconname : 'arrow-right-circle.svg', svgtype : SvgDetail.ArrowRightCircle,},
    {Iconname : 'arrow-up.svg', svgtype : SvgDetail.ArrowUp,},
    {Iconname : 'arrow-up-circle.svg', svgtype : SvgDetail.ArrowUpCircle,},
    {Iconname : 'arrow-up-left.svg', svgtype : SvgDetail.ArrowUpLeft,},
    {Iconname : 'arrow-up-right.svg', svgtype : SvgDetail.ArrowUpRight,},

    {Iconname : 'at-sign.svg', svgtype : SvgDetail.AtSign,},
    {Iconname : 'award.svg', svgtype : SvgDetail.Award,},
    {Iconname : 'bar-chart.svg', svgtype : SvgDetail.BarChart,},
    {Iconname : 'bar-chart-2.svg', svgtype : SvgDetail.BarChart2,},
    {Iconname : 'battery.svg', svgtype : SvgDetail.Battery,},
    {Iconname : 'battery-charging.svg', svgtype : SvgDetail.BatteryCharging,},
    {Iconname : 'bell.svg', svgtype : SvgDetail.Bell,},
    {Iconname : 'bell-off.svg', svgtype : SvgDetail.BellOff,},
    {Iconname : 'bluetooth.svg', svgtype : SvgDetail.Bluetooth,},
    {Iconname : 'bold.svg', svgtype : SvgDetail.Bold,},
    {Iconname : 'book.svg', svgtype : SvgDetail.Book,},
    {Iconname : 'bookmark.svg', svgtype : SvgDetail.Bookmark,},
    {Iconname : 'book-open.svg', svgtype : SvgDetail.BookOpen,},
    {Iconname : 'box.svg', svgtype : SvgDetail.Box,},
    {Iconname : 'briefcase.svg', svgtype : SvgDetail.Briefcase,},
    {Iconname : 'calendar.svg', svgtype : SvgDetail.FeCalendar,},
    {Iconname : 'camera.svg', svgtype : SvgDetail.Camera,},
    {Iconname : 'camera-off.svg', svgtype : SvgDetail.CameraOff,},

    {Iconname : 'cast.svg', svgtype : SvgDetail.Cast,},
    {Iconname : 'check.svg', svgtype : SvgDetail.Check,},
    {Iconname : 'check-circle.svg', svgtype : SvgDetail.CheckCircle,},
    {Iconname : 'check-square.svg', svgtype : SvgDetail.CheckSquare,},
    {Iconname : 'chevron-down.svg', svgtype : SvgDetail.ChevronDown,},
    {Iconname : 'chevron-right.svg', svgtype : SvgDetail.ChevronRight,},
    {Iconname : 'chevrons-down.svg', svgtype : SvgDetail.ChevronsDown,},
    {Iconname : 'chevrons-left.svg', svgtype : SvgDetail.ChevronsLeft,},
    {Iconname : 'chevrons-right.svg', svgtype : SvgDetail.ChevronsRight,},
    {Iconname : 'chevrons-up.svg', svgtype : SvgDetail.ChevronsUp,},
    {Iconname : 'chevron-up.svg', svgtype : SvgDetail.ChevronUp,},
    {Iconname : 'chrome.svg', svgtype : SvgDetail.Chrome,},
    {Iconname : 'circle.svg', svgtype : SvgDetail.FetherCircle,},
    {Iconname : 'clipboard.svg', svgtype : SvgDetail.Clipboard,},
    {Iconname : 'clock.svg', svgtype : SvgDetail.Clock,},
    {Iconname : 'cloud.svg', svgtype : SvgDetail.Cloud,},
    {Iconname : 'cloud-drizzle.svg', svgtype : SvgDetail.CloudDrizzle,},
    {Iconname : 'cloud-lightning.svg', svgtype : SvgDetail.CloudLightning,},
    {Iconname : 'cloud-off.svg', svgtype : SvgDetail.CloudOff,},
    {Iconname : 'cloud-rain.svg', svgtype : SvgDetail.CloudRain,},
    {Iconname : 'cloud-snow.svg', svgtype : SvgDetail.CloudSnow,},
    {Iconname : 'code.svg', svgtype : SvgDetail.Code,},
    {Iconname : 'codepen.svg', svgtype : SvgDetail.Codepen,},
    {Iconname : 'codesandbox.svg', svgtype : SvgDetail.Codesandbox,},

    {Iconname : 'coffee.svg', svgtype : SvgDetail.Coffee,},
    {Iconname : 'columns.svg', svgtype : SvgDetail.Columns,},
    {Iconname : 'command.svg', svgtype : SvgDetail.Command,},
    {Iconname : 'compass.svg', svgtype : SvgDetail.Compass,},
    {Iconname : 'copy.svg', svgtype : SvgDetail.Copy,},
    {Iconname : 'corner-down-left.svg', svgtype : SvgDetail.CornerDownLeft,},
    {Iconname : 'corner-down-right.svg', svgtype : SvgDetail.CornerDownRight,},
    {Iconname : 'corner-left-down.svg', svgtype : SvgDetail.CornerLeftDown,},
    {Iconname : 'corner-left-up.svg', svgtype : SvgDetail.CornerLeftUp,},
    {Iconname : 'corner-right-down.svg', svgtype : SvgDetail.CornerRightDown,},
    {Iconname : 'corner-right-up.svg', svgtype : SvgDetail.CornerRightUp,},
    {Iconname : 'corner-up-left.svg', svgtype : SvgDetail.CornerUpLeft,},
    {Iconname : 'corner-up-right.svg', svgtype : SvgDetail.CornerUpRight,},
    {Iconname : 'cpu.svg', svgtype : SvgDetail.Cpu,},
    {Iconname : 'credit-card.svg', svgtype : SvgDetail.CreditCard,},
    {Iconname : 'crop.svg', svgtype : SvgDetail.Crop,},
    {Iconname : 'crosshair.svg', svgtype : SvgDetail.Crosshair,},
    {Iconname : 'database.svg', svgtype : SvgDetail.Database,},
    {Iconname : 'delete.svg', svgtype : SvgDetail.Delete,},
    {Iconname : 'disc.svg', svgtype : SvgDetail.Disc,},
    {Iconname : 'dollar-sign.svg', svgtype : SvgDetail.DollarSign,},
    {Iconname : 'download.svg', svgtype : SvgDetail.Download,},
    {Iconname : 'download-cloud.svg', svgtype : SvgDetail.DownloadCloud,},
    {Iconname : 'droplet.svg', svgtype : SvgDetail.Droplet,},
    {Iconname : 'edit.svg', svgtype : SvgDetail.FetherEdit,},
    {Iconname : 'edit-2.svg', svgtype : SvgDetail.Edit2,},
    {Iconname : 'edit-3.svg', svgtype : SvgDetail.Edit3,},
    {Iconname : 'external-link.svg', svgtype : SvgDetail.ExternalLink,},
    {Iconname : 'eye.svg', svgtype : SvgDetail.Eye,},
    {Iconname : 'eye-off.svg', svgtype : SvgDetail.EyeOff,},
    {Iconname : 'facebook.svg', svgtype : SvgDetail.Facebook,},
    {Iconname : 'feather.svg', svgtype : SvgDetail.Feather,},
    {Iconname : 'fast-forward.svg', svgtype : SvgDetail.FastForward,},
    
];

const FeatherIcons = () => {
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
            <PageTitle activeMenu={"Feather icons"}   motherMenu={"Icons"} />
                <div className="row">
					<div className="col-xl-12">
						<div className="card p-0">
							<div className="card-header"><h4 className="text-black mb-0">Feather Icons</h4></div>
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
                                                    <Link to={"#"}  onClick={() => dispatch({type:'imageModal', content: item.Iconname })} className="btn btn-sm btn-brand">
                                                        <i className="fa-solid fa-image"/>
                                                    </Link>
                                                    <Link to={"#"} onClick={() => dispatch({type:'svgModal', content: item.Iconname, title : item.svgtype })} className="btn btn-sm btn-brand">
                                                        <i className="fa fa-code" />
                                                    </Link>
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
    {`import MyImage from "../icons/feather/${state.content}";
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
                                <h5 className="modal-title" >{state.content}</h5>
                                <button type="button" className="btn-close"   onClick={() => dispatch({type:'svgModal'})}></button>
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

export default FeatherIcons;