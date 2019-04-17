import { get } from 'lodash-es';
import Metadata from '../k8s/metadata';
import AppSpec from './mobileappspec';
import AppStatus from './mobileappstatus';

export const PROPERTIES = {
  NAME: 'name'
};

export default class MobileApp {
  constructor(json) {
    this.app = json || {};
    this.spec = new AppSpec(this.app.spec);
    this.metadata = new Metadata(this.app.metadata);
    this.status = new AppStatus(this.app.status);
    this.isNew = !this.metadata.getUID();
  }

  getID() {
    return this.metadata.getName();
  }

  getName() {
    return this.getSpec().getName();
  }

  getStatus() {
    return this.status;
  }

  setProperty(propertyName, propertyValue) {
    this.getSpec().set(propertyName, propertyValue);
  }

  getProperty(propertyName) {
    // the get/set property methods only supports get/set fields on the spec object for now.
    // but it can be extended to support accessing more fields on more objects (like status).
    return this.getSpec().get(propertyName);
  }

  _validateProperty(propertyName) {
    const value = this.getProperty(propertyName);
    if (value) {
      switch (propertyName) {
        case PROPERTIES.NAME:
          return value.match('^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$');
        default:
          return 'success';
      }
    }

    return undefined;
  }

  isValid(propertyName) {
    if (propertyName) {
      return this._validateProperty(propertyName);
    }
    return this._validateProperty(PROPERTIES.NAME);
  }

  getSpec() {
    return this.spec;
  }

  toJSON() {
    const spec = this.spec.toJSON();
    const metadata = this.metadata.toJSON();
    if (this.isNew) {
      metadata.name = spec.name;
    }
    return { ...this.app, spec, metadata, status: this.status.toJSON() };
  }

  /**
   * Finds an app into an array of raw json apps and returns an instance of MobileApp if found or null otherwise
   * @param ary the array of json apps data
   * @param appID the id of the app to be found
   * @returns {*}
   */
  static find(ary, appID) {
    const mobileAppJson = ary.find(app => get(app, 'metadata.name') === appID);
    if (mobileAppJson) {
      return new MobileApp(mobileAppJson);
    }
    return null;
  }
}
