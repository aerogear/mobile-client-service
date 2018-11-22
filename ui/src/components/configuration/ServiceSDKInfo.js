import React from 'react';
import { Col, OverlayTrigger, Tooltip } from 'patternfly-react';

import './ServiceSDKInfo.css';

// TODO Cordova is hard-coded now, remove in future
const sdkConfigDocs = require('./sdk-config-docs/cordova.json');

export const ServiceSDKInfo = ({ mobileApp }) => {
  if (mobileApp) {
    const status = mobileApp.getStatus();
    const { services = [] } = { services: status.getServices() };
    return (
      <React.Fragment>
        {services.map(({ type }) => {
          const { serviceDescription, serviceLogoUrl, serviceName, setupText, docsLink } = sdkConfigDocs.services[type];
          const tooltip = <Tooltip id={serviceName}>{serviceDescription}</Tooltip>;
          return (
            <Col md={6} className="service-sdk-info">
              <OverlayTrigger placement="top" overlay={tooltip}>
                <Col md={12}>
                  <img src={serviceLogoUrl} alt="" />
                  <div className="service-name">
                    <h4>
                      <div>{serviceName}</div>
                    </h4>
                  </div>
                </Col>
              </OverlayTrigger>
              <Col md={12}>
                <div className="service-details">
                  <h5>
                    <a href={docsLink} target="_blank" rel="noopener noreferrer">
                      {setupText}
                    </a>
                  </h5>
                </div>
              </Col>
            </Col>
          );
        })}
      </React.Fragment>
    );
  }
  return <React.Fragment />;
};

export default ServiceSDKInfo;
