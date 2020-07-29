import React from "react";
import "../index.css";

export default class BackDrop extends React.Component{
    render(){
        return(
            <div className='backdrop' onClick={this.props.backDropClickHandler}/>
        )
    }
}