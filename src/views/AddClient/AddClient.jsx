import React , { Component } from 'react';
import {
    Grid,
    Row,
    Col,
  } from "react-bootstrap";

  import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";


class AddClient extends Component {

    constructor() {
        super();
        this.saveClient = this.saveClient.bind(this);
        this.state = {
            'firstName' : '',
            'lastName' :null,
            'mobileNumber' : '',
            'email' : null,
            'address' : {
                'streetAddress' : null,
                'city' : null,
                'state' : null,
                'pinCode' : null,
            },
            'validation' : {
                'firstNameValidationLog' : null,
                'mobileNumberValidationLog' : null,
                'pinCodeValidationLog' : null,
            },
            'alertStatus' : null,
            _notificationSystem: null
        }
    }

     mobileNumberRegex = /^(\d{10})$/;
     pinCodeRegex = /^(\d{6})$/;

    validateForm() {
        
        let firstName = this.state.firstName;
        let isFormValid = true;
        let validationState = {...this.state.validation};
        let addressState = {...this.state.address};

        if (!firstName.trim()) {
            isFormValid = false;
            validationState['firstNameValidationLog'] = 'error';
            this.setState({firstName : ''})
        }
        else {
            validationState['firstNameValidationLog'] = null;
        }

        if (!this.state.mobileNumber.trim() || !this.mobileNumberRegex.test(this.state.mobileNumber.trim()) ) {
            isFormValid = false;
            validationState['mobileNumberValidationLog'] = 'error';
            this.setState({mobileNumber : ''})
        }
        else {
            validationState['mobileNumberValidationLog'] = null;
        }

        if (this.state.address.pinCode !== null && (!this.state.address.pinCode.trim() 
                || !this.pinCodeRegex.test(this.state.address.pinCode.trim()))) {
            isFormValid = false;
            validationState['pinCodeValidationLog'] = 'error';
            addressState.pinCode = null;
        }
        else {
            validationState['pinCodeValidationLog'] = null;
        }

        this.setState({validation : validationState,
                       address : addressState });
        return isFormValid;
    }

    sanitizePayload(payloadValue) {

        if (payloadValue) {
             let newPayload = payloadValue.trim();
             if (newPayload) {
                return newPayload;
             }  
        }
       return null;

    }

    displayPopup(notificationStatus) {
        this.setState({ _notificationSystem: this.refs.notificationSystem });
        var _notificationSystem = this.refs.notificationSystem;
       
        if (notificationStatus === "success") {
            _notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift" />,
                message: (
                  <div>
                      <strong> Client SuccessFully Added !!! </strong>
                  </div>
                ),
                level: notificationStatus,
                position: "tr",
                autoDismiss: 5
              });
        }
        else {
            _notificationSystem.addNotification({
                title: <span data-notify="icon" className="pe-7s-gift" />,
                message: (
                  <div>
                      Some Error Occured While Saving. <strong>Please Try Again Later .</strong>
                  </div>
                ),
                level: notificationStatus,
                position: "tr",
                autoDismiss: 5
              });
        }
     
      }


    saveClient(e) {

        e.preventDefault();

        if (this.validateForm()) {
            axios.post("https://naari-boutique-api.herokuapp.com/client" , 
           {
            'firstName' : this.state.firstName.trim(),
            'lastName' : this.sanitizePayload(this.state.lastName),
            'mobileNumber' : this.state.mobileNumber.trim(),
            'email' : this.sanitizePayload(this.state.email),
            'address' : {
                'streetAddress' : this.sanitizePayload(this.state.address.streetAddress),
                'city' : this.sanitizePayload(this.state.address.city),
                'state' : this.sanitizePayload(this.state.address.state),
                'pinCode' : this.sanitizePayload(this.state.address.pinCode),
            },
           }
        ).then((response) => {this.displayPopup("success")})
        .catch((error) => {this.displayPopup("error")});

        this.setState( {

            'firstName' : '',
            'lastName' :null,
            'mobileNumber' : '',
            'email' : null,
            'address' : {
                'streetAddress' : null,
                'city' : null,
                'state' : null,
                'pinCode' : null,
            },
            'validation' : {
                'firstNameValidationLog' : null,
                'mobileNumberValidationLog' : null,
                'pinCodeValidationLog' : null
            },
            'alertStatus' : null,
            _notificationSystem: null
        })
        }
    }

    setValue(field, event) {
        const object = {};        
        if (field.split('.').length !== 1 ) {
            let values = field.split('.');
            object[values[0]] = {...this.state[values[0]]};
            object.address[values[1]] = event.target.value;    
        }     
        else {
            object[field] = event.target.value;
        }
        this.setState(object);
      }
      
    render() { 
       return(
        <div className="content">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Grid fluid>
        <Row>
          <Col md={10}>
          <Card
          title="Add Client"
          content={
            <form onSubmit = {this.saveClient}>
              <FormInputs
                ncols={["col-md-6", "col-md-6"]}
                proprieties={[
                  {
                    label: "First name",
                    type: "text",
                    bsClass: "form-control",
                    placeholder: "First Name",
                    onChange : this.setValue.bind(this, 'firstName'),
                    value : this.state.firstName || '',
                    validationState : this.state.validation.firstNameValidationLog,
                    help : 'First Name is Mandatory',
                  },
                  {
                    label: "Last name",
                    type: "text",
                    bsClass: "form-control",
                    placeholder: "Last Name",
                    onChange : this.setValue.bind(this, 'lastName'),
                    value : this.state.lastName || '',
                  }]}
                />
                <FormInputs
                ncols={["col-md-6", "col-md-6"]}
                proprieties={[                  
                    {
                        label: "Mobile Number",
                        type: "tel",
                        bsClass: "form-control",
                        placeholder: "Mobile Number",
                        onChange : this.setValue.bind(this, 'mobileNumber'),
                        value : this.state.mobileNumber || '',
                        validationState : this.state.validation.mobileNumberValidationLog,
                        help : '10 Digit Mobile Number is Mandatory',
                      },
                      {
                          label: "Email",
                          type: "email",
                          bsClass: "form-control",
                          placeholder: "Email",
                          onChange : this.setValue.bind(this, 'email'),
                          value : this.state.email || '',
                        }
                    ]}
                /> 

                <FormInputs
                ncols={["col-md-12"]}
                proprieties={[                  
                    {
                        label: "Street Address",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "Street Address",
                        onChange : this.setValue.bind(this, 'address.streetAddress'),
                        value : this.state.address.streetAddress || '',
                      }
                    ]}
                />   

                <FormInputs
                ncols={["col-md-4", "col-md-4", "col-md-4"]}
                proprieties={[                  
                    {
                        label: "City",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "City",
                        onChange : this.setValue.bind(this, 'address.city'),
                        value : this.state.address.city || '',
                      },
                      {
                        label: "State",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "State",
                        onChange : this.setValue.bind(this, 'address.state'),
                        value : this.state.address.state || '',
                      },
                      {
                        label: "Pin Code",
                        type: "text",
                        bsClass: "form-control",
                        placeholder: "Pin Code",                       
                        onChange : this.setValue.bind(this, 'address.pinCode'),
                        value : this.state.address.pinCode || '',
                        validationState : this.state.validation.pinCodeValidationLog,
                        help : 'Enter 6 Digit Pin Code (Optional)',
                      },
                    ]}
                />   

              <Button bsStyle="info" pullRight fill type="submit">
                Add Client
              </Button>
              <div className="clearfix" />
            </form>
          }
        />
          </Col>      
        </Row>
        </Grid>
   </div>
       );
    }

}

export default AddClient;