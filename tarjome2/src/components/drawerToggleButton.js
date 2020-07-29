import React from "react";
import "../index.css";

export default class DrawerToggleButton extends React.Component {
    render(){
        return(
            <button className='toggle-btn' onClick={this.props.click}>
                <div className='toggle-btn-line'/>
                <div className='toggle-btn-line'/>
                <div className='toggle-btn-line'/>
            </button>
        )
    }
}