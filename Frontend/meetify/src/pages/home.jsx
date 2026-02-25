import withAuth from "../utils/withAuth";
import React from "react";
function HomeComponent(){
    return(
        <div>

            Home Component
        </div>
    )
}


export default withAuth(HomeComponent);