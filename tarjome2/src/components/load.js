import React from "react";
import "../index.css";
import {Spinner} from 'react-bootstrap'

export default class Load extends React.Component {
 
  render() {
   return (
     <div>
        <Spinner
                as="span"
                animation="grow"
                size="xl"
                role="status"
                aria-hidden="true"
                className = 'purple-txt load-spinner'
          />
     </div>
   )
 
  }
}
