import { find } from 'lodash-es';
import Resource from '../k8s/resource';

export class MobileService {
  constructor(json = {}) {
    this.data = json;
    this.configuration = this.data.configuration || [];
    this.configurationExt = this.data.configurationExt || [];
    this.setupText = '';
    this.serviceInstance = new Resource(this.data.serviceInstance);
    this.serviceBinding = new Resource(this.data.serviceBinding);
    this.serviceClass = new Resource(this.data.serviceClass);
    this.servicePlan = new Resource(this.data.servicePlan);
  }

  getName() {
    return this.data.name;
  }

  getId() {
    return this.data.name;
  }

  getDescription() {
    return this.serviceClass.spec.get('description');
  }

  getLogoUrl() {
    return this.data.imageUrl;
  }

  getIconClass() {
    return this.data.iconClass;
  }

  isBound() {
    return this.data.isBound;
  }

  getBindingName() {
    return this.serviceBinding.metadata.get('name');
  }

  getServiceInstanceName() {
    return this.serviceInstance.metadata.get('name');
  }

  getSetupText() {
    return this.setupText;
  }

  getBindingSchema() {
    return this.servicePlan.spec.get('serviceBindingCreateParameterSchema');
  }

  isBindingOperationInProgress() {
    const conditions = this.serviceBinding.status.get('conditions');
    // the bind operation could be in-flight. In this case, the operation is neither ready, or failed.
    if (conditions && find(conditions, { type: 'Ready', status: 'False' }) && !this.isBindingOperationFailed()) {
      return true;
    }
    return false;
  }

  getBindingOperation() {
    return this.serviceBinding.status.get('currentOperation');
  }

  isBindingOperationFailed() {
    const conditions = this.serviceBinding.status.get('conditions');
    if (conditions && find(conditions, { type: 'Failed', status: 'True' })) {
      return true;
    }
    return false;
  }

  getFormDefinition() {
    const form = this.servicePlan.spec.get('externalMetadata.schemas.service_binding.create.openshift_form_definition');
    form.filterDisplayGroupBy = JSON.parse(
      this.servicePlan.spec.get('externalMetadata.mobileclient_bind_parameters_data[0]') || ''
    ).filterDisplayGroupBy;
    return form;
  }

  setBindingSchemaDefaultValues(name, value) {
    const bindingSchema = this.getBindingSchema();
    if (bindingSchema && bindingSchema.properties && bindingSchema.properties[name]) {
      bindingSchema.properties[name].default = value;
    }
  }

  getServiceClassExternalName() {
    return this.serviceClass.spec.get('externalMetadata.serviceName');
  }

  isUPSService() {
    return this.getServiceClassExternalName() === 'ups';
  }

  toJSON() {
    return {
      ...this.data,
      configuration: this.configuration,
      configurationExt: this.configurationExt,
      serviceInstance: this.serviceInstance.toJSON(),
      serviceBinding: this.serviceBinding.toJSON(),
      serviceClass: this.serviceClass.toJSON()
    };
  }
}

export class BoundMobileService extends MobileService {
  constructor(json = {}) {
    super(json);
  }

  getConfiguration() {
    return this.data.configuration;
  }

  getConfigurationExt() {
    return this.data.configurationExt;
  }

  getDocumentationUrl() {
    return this.serviceClass.spec.get('externalMetadata.documentationUrl');
  }

  /**
   * This method returns an instance of 'UnboundMobileService' with a state of 'Unbinding in progress'
   * @returns {UnboundMobileService}
   */
  unbind() {
    return new UnboundMobileService({
      ...this.data,
      isBound: false,
      serviceBinding: { status: { currentOperation: 'Unbinding', conditions: [{ type: 'Ready', status: 'False' }] } }
    });
  }
}

export class UnboundMobileService extends MobileService {
  constructor(json = {}) {
    super(json);
  }

  /**
   * This method returns a new instance of UnboundMobileService, with a status of 'Binding in progress'
   * @returns {UnboundMobileService}
   */
  bind() {
    return new UnboundMobileService({
      ...this.data,
      isBound: false,
      serviceBinding: { status: { currentOperation: 'Binding', conditions: [{ type: 'Ready', status: 'False' }] } }
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      servicePlan: this.servicePlan.toJSON()
    };
  }
}
