import React from 'react'
import strings from '../utils/strings'
import "../index.css";

export default class Empty extends React.Component {
    static defaultProps = {
        information : strings.emptyAlert.information
      }
    render(){
        return(
        <h3 className='emty-text margin-top'>{this.props.information} {strings.emptyAlert.notExist}</h3>
        )
    }
}