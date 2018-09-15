import React , { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  Table,
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { thArray } from "variables/Variables.jsx";
import axios from 'axios';
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";


class ClientSearch extends Component {
 
  constructor() {
    super();
    this.fetchListOfClients = this.fetchListOfClients.bind(this);
    this.state = {
      'firstName' : null,
      'lastName' : null,
      'mobileNumber' : null,
      'clientData' : [],
      _notificationSystem: null
    };
  } 

  displayPopup(notificationStatus) {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    var _notificationSystem = this.refs.notificationSystem;
   
    if (notificationStatus === "success") {
        _notificationSystem.addNotification({
            title: <span data-notify="icon" className="pe-7s-gift" />,
            message: (
              <div>
                  <strong> Clients SuccessFully Fetched !!! </strong>
              </div>
            ),
            level: notificationStatus,
            position: "tr",
            autoDismiss: 5
          });
    }
    else if (notificationStatus === 'info') {
      _notificationSystem.addNotification({
        title: <span data-notify="icon" className="pe-7s-gift" />,
        message: (
          <div>
              <strong> No Result Found For the Given Search Criteria </strong>
          </div>
        ),
        level: notificationStatus,
        position: "tr",
        autoDismiss: 5
      });
    }
    else  {
        _notificationSystem.addNotification({
            title: <span data-notify="icon" className="pe-7s-gift" />,
            message: (
              <div>
                  Some Error Occured While Fetching. <strong>Please Try Again Later .</strong>
              </div>
            ),
            level: notificationStatus,
            position: "tr",
            autoDismiss: 5
          });
    }
 
  }

  handleClientSearchListResponse(response) {
    let fetchedClientList = [];

    if (response.data.length > 0) {
      response.data.map((prop) => {
      
        let fetchedClientInformation= [];
        fetchedClientInformation.push(prop.firstName);
        fetchedClientInformation.push(prop.lastName);
        fetchedClientInformation.push(prop.mobileNumber);
        fetchedClientInformation.push(prop.email);
        fetchedClientList.push(fetchedClientInformation);
      })
      this.displayPopup("success");
    }
    else {
        this.displayPopup("info");
    }

    this.setState( {'clientData' : fetchedClientList, 
                'firstName' : null,
                'lastName' : null,
                'mobileNumber' : null,
  });
  }

  fetchListOfClients() {
    
    axios.post('http://naari-boutique-api.herokuapp.com/client/searchClient', this.state
    ).then((response) => {
      this.handleClientSearchListResponse(response);
      this.setState({_notificationSystem: null})
    } )
    .catch((error) => {
      this.displayPopup("error");
      this.setState({_notificationSystem: null});
    })
  }

 
  setValue(field, event) {
    const object = {};
      object[field] = event.target.value;  
    this.setState(object);
  }

  render() {
    return(
      <div className="content">
      <NotificationSystem ref="notificationSystem" style={style} />
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title="Search Client"
              content={
                <form onSubmit = {this.fetchListOfClients}>
                  <FormInputs
                    ncols={["col-md-4", "col-md-4", "col-md-4"]}
                    proprieties={[
                      {
                        label: "First Name",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "First name",
                        onChange : this.setValue.bind(this, 'firstName'),
                        value : this.state.firstName || '',
                      },
                      {
                        label: "Last name",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "Last name",
                        onChange : this.setValue.bind(this, 'lastName'),
                        value : this.state.lastName || '',
                      },
                      {
                          label: "Mobile Number",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Mobile Number",
                          onChange : this.setValue.bind(this, 'mobileNumber'),
                          value : this.state.mobileNumber || '',
                        }
                    ]}
                  />
                  <Button bsStyle="info" pullRight fill type="submit">
                    Search Client
                  </Button>
                  <div className="clearfix" />
                </form>
              }
            />
          </Col>
              { this.state.clientData.length !==0 && 
                  <Col md={12}>
                  <Card
                    title="Client Result"
                    category="Client List Based on Search Criteria"
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <Table striped hover>
                        <thead>
                          <tr>
                            {thArray.map((prop, key) => {
                              return <th key={key}>{prop}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.clientData.map((prop, key) => {
                            return (
                              <tr key={key}>
                                {prop.map((prop, key) => {
                                  return <td key={key}>{prop}</td>;
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    }
                  />
                </Col>    
              }
        </Row>
      </Grid>
    </div>
   )
  }
}
    

export default ClientSearch;