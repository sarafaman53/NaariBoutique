import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Row , HelpBlock} from "react-bootstrap";

function FieldGroup({ label,validationState, help, ...props }) {
  return (
    <FormGroup validationState = {validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      <FormControl.Feedback />
      <HelpBlock>{help}</HelpBlock>
    </FormGroup>
  );
}

export class FormInputs extends Component {
  render() {
    var row = [];
    for (var i = 0; i < this.props.ncols.length; i++) {
      row.push(
        <div key={i} className={this.props.ncols[i]}>
          <FieldGroup {...this.props.proprieties[i]} />
        </div>
      );
    }
    return <Row>{row}</Row>;
  }
}

export default FormInputs;
