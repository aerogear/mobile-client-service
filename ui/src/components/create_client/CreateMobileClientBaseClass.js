import React, { Component } from 'react';
import { Grid, Form } from 'patternfly-react';
import { CREATE_CLIENT_APP_ID, CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';
import { get as _get } from 'lodash-es';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateMobileClientBaseClass extends Component {

  constructor() {
    super();
    this.state = {
      valid: false,
      validationState: {}
    }
  }

  config = {
    platform: 'unknown',
    appName: {
      label: '* App Name',
      help: 'Enter application name (like <em>myapp</em>)',
      example_content: ''
    },
    appIdentifier: {
      label: '* Package Name',
      help: 'Enter package name (like <em>org.aerogear.myapp</em>)',
      example_content: ''
    }
  }
  
  validate(controlId, value) {
    switch(controlId) {
      case CREATE_CLIENT_NAME: return value !== undefined && value.length > 0 ? 'success' : 'error';
      case CREATE_CLIENT_APP_ID: return value !== undefined && value.length > 0 ? 'success' : 'error';
      default: return 'success';
    }
  }

  _validate(controlId, value) {
    var newState = {...this.state, validationState: {...this.state.validationState, [controlId]: this.validate(controlId, value)}}

    var dataIsValid = true;

    for(var control in newState.validationState) {
      if (newState.validationState[control] != 'success') {
        dataIsValid = false;
        break;
      }
    }
    newState.valid = dataIsValid;
    newState.newApp = {
      ...newState.newApp,
      clientType: this.config.platform,
      [controlId]: value
    }
    this.setState(newState);
    this.props.configureClient(newState);
  }


  getFormFields() {
    
    return [
      {
        controlId: CREATE_CLIENT_NAME,
        label: this.config.appName.label,
        useFieldLevelHelp: true,
        defaultValue: this.config.appName.example_content,
        content: this.config.appName.help,
        tabIndex: -1,
        formControl: ({ validationState, ...props }) => (
          <Form.FormControl type="text" {...props} tabIndex="1" autoFocus={true} />
        ),
        validationState: _get(this.state.validationState, CREATE_CLIENT_NAME),
        onChange: e => this._validate(CREATE_CLIENT_NAME, e.target.value),
      },
      {
        controlId: CREATE_CLIENT_APP_ID,
        label: this.config.appIdentifier.label,
        useFieldLevelHelp: true,
        defaultValue: this.config.appIdentifier.example_content,
        content: this.config.appIdentifier.help,
        tabIndex: -1,
        formControl: ({ validationState, ...props }) => (
          <Form.FormControl type="text" {...props} tabIndex="2" />
        ),
        validationState: null,
        onChange: e => this._validate(CREATE_CLIENT_APP_ID, e.target.value),
      },
    ];
  }

  _getFormFields() {
    var fields = this.getFormFields();

    if (!this.state.initialized) {
      var newState = {...this.state};
      for (var field in fields) {
        newState.validationState[fields[field].controlId] = null;
      }
      newState.initialized = true;
      this.setState(newState);  
    }
    return fields;
  }

  renderFormFields(formFields) {
    const generatedFields = formFields.map(formField => VerticalFormField({ ...formField }));
    return (<div>
      <Grid bsClass="create-client-form">
        <Form vertical="true">
          {generatedFields}
        </Form>
      </Grid>
    </div>
    )
  }

  render() {
    return this.renderFormFields(this._getFormFields());
  }
}

export default CreateMobileClientBaseClass;
