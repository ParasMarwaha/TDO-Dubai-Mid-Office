import {useEffect} from "react";
import {useLocation} from "react-router-dom";

function SearchBookingDetails() {

    let location = useLocation();
    useEffect(()=>{
        console.log(location.state.id)
    },[])
    return (
        <>Details</>
    )
}

export default SearchBookingDetails;