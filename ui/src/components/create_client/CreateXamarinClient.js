import React, { Component } from 'react';
import { Form  } from 'patternfly-react';
import { renderForm } from './CreateClientFormUtils';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateXamarinClient extends Component {
    render() {
        const formFields = [
            {
                controlId:'appName',
                label:'* Application Name',
                useFieldLevelHelp: true,
                content:'Enter application name (like <em>myapp</em>)',
                formControl: ({ validationState, ...props }) => (
                    <Form.FormControl type="text" {...props} />
                  )
            },
            {
                controlId:'appIdentifier',
                label:'* Package Name',
                useFieldLevelHelp: true,
                content:'Enter package name (like <em>AeroGear.Xamarin.MyApp</em>)',
                formControl: ({ validationState, ...props }) => (
                    <Form.FormControl type="text" {...props} />
                  )
            },
        ] 
        const formButtons = [
            {
              text: 'Create app',
              bsStyle: 'primary',
              onClick: (e)=> { 
                  //TODO
                  alert('create')
              }
            },
            {
              text: 'Cancel',
              bsStyle: 'default',
              onClick: (e)=>{
                  //TODO
                  alert('cancel')
              }
            }
          ];
                 
        return renderForm(formFields,formButtons);
    }

}

export default CreateXamarinClient