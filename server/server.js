const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const promMid = require('express-prometheus-middleware');
const { Client, KubeConfig } = require('kubernetes-client');
const Request = require('kubernetes-client/backends/request');
const packageJson = require('../package.json');
const { updateAppsAndWatch } = require('./appServices');
const { getServices } = require('./mobile-services');
const { addProtocolIfMissing } = require('./helpers');
const mobileClientCRD = require('./mobile-client-crd.json');
const pushApplicationCRD = require('./push-application-crd.json');
const androidVariantCRD = require('./android-variant-crd.json');
const iosVariantCRD = require('./ios-variant-crd.json');
const webPushVariantCRD = require('./web-variant-crd.json');
const mobileSecurityService = require('./mobile-security-crd.json');
const proxy = require('http-proxy-middleware');

const OPENSHIFT_PROXY_PATH = '/proxy/openshift';

process.on('uncaughtException', error => {
  console.log('uncaughtException', error);
});

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});

const app = express();

const httpProxyOptions = {
  target: addProtocolIfMissing(process.env.OPENSHIFT_HOST, 'https'),
  secure: false,
  logLevel: 'warn',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    [`^${OPENSHIFT_PROXY_PATH}`]: '' // remove base path
  },
  onProxyReq: (proxyReq, req) => {
    if (req.headers['x-forwarded-access-token']) {
      proxyReq.setHeader('authorization', `Bearer ${req.headers['x-forwarded-access-token']}`);
    }
  }
};

app.use(OPENSHIFT_PROXY_PATH, proxy(httpProxyOptions));

app.use(bodyParser.json());

// prometheus metrics endpoint
app.use(
  promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5]
  })
);

const port = process.env.PORT || 4000;
const configPath = process.env.MOBILE_SERVICES_CONFIG_FILE || '/etc/mdc/servicesConfig.json';

const DEFAULT_NAMESPACE = 'mobile-console';

// Dynamic configuration for openshift API calls
app.get('/api/server_config.js', (req, res) => {
  res.send(getConfigData(req));
});

app.get('/api/mobileservices', (req, res) => {
  getServices(configPath).then(servicesJson => {
    res.json({
      items: servicesJson
    });
  });
});

app.get('/about', (_, res) => {
  res.json({
    version: packageJson.version || 'Not Available'
  });
});

function getConfigData(req) {
  const {
    OPENSHIFT_USER_TOKEN,
    OPENSHIFT_USER_NAME,
    OPENSHIFT_USER_EMAIL,
    NAMESPACE,
    ENABLE_BUILD_TAB,
    DOCS_PREFIX
  } = process.env;
  let userToken = OPENSHIFT_USER_TOKEN;
  let userName = OPENSHIFT_USER_NAME || 'testuser';
  let userEmail = OPENSHIFT_USER_EMAIL || 'testuser@localhost';
  const mdcNamespace = NAMESPACE || DEFAULT_NAMESPACE;
  const docsPrefix = DOCS_PREFIX || 'https://docs.aerogear.org/aerogear/latest';
  let enableBuildTab = false;
  if (ENABLE_BUILD_TAB && ENABLE_BUILD_TAB === 'true') {
    enableBuildTab = true;
  }

  if (process.env.NODE_ENV === 'production') {
    userToken = req.get('X-Forwarded-Access-Token');
    userName = req.get('X-Forwarded-User');
    userEmail = req.get('X-Forwarded-Email');
  }

  return `window.OPENSHIFT_CONFIG = {
    mdcNamespace: '${mdcNamespace}',
    masterUri: '${OPENSHIFT_PROXY_PATH}',
    wssMasterUri: '${OPENSHIFT_PROXY_PATH}',
    user: {
      accessToken: '${userToken}',
      name: '${userName}',
      email: '${userEmail}'
    },
  }; window.SERVER_DATA= { ENABLE_BUILD_TAB: ${enableBuildTab}, DOCS_PREFIX: '${docsPrefix}' };`;
}

async function initKubeClient() {
  try {
    const kubeconfig = new KubeConfig();
    if (process.env.NODE_ENV === 'production') {
      kubeconfig.loadFromCluster();
    } else {
      kubeconfig.loadFromDefault();
    }
    const backend = new Request({ kubeconfig });

    if (process.env.INSECURE_SERVER) {
      backend.requestOptions.strictSSL = false;
    }

    const kubeclient = new Client({ backend });
    await kubeclient.loadSpec();
    kubeclient.addCustomResourceDefinition(mobileClientCRD);
    kubeclient.addCustomResourceDefinition(pushApplicationCRD);
    kubeclient.addCustomResourceDefinition(androidVariantCRD);
    kubeclient.addCustomResourceDefinition(iosVariantCRD);
    kubeclient.addCustomResourceDefinition(webPushVariantCRD);
    kubeclient.addCustomResourceDefinition(mobileSecurityService);
    return kubeclient;
  } catch (e) {
    console.error('Failed to init kube client', e);

    // Exiting the server. Waiting 5 seconds to avoid strict loops
    setTimeout(() => process.exit(1), 5000);
    return null;
  }
}

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '..', 'build')));
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

async function run() {
  const { OPENSHIFT_HOST, OPENSHIFT_USER_TOKEN, NAMESPACE } = process.env;
  if (!OPENSHIFT_HOST) {
    console.warn('OPENSHIFT_HOST environment variable is not set');
  }
  if (!NAMESPACE) {
    console.warn(`NAMESPACE environment variable is not set, will use the default namespace ${DEFAULT_NAMESPACE}`);
  }
  if (!OPENSHIFT_USER_TOKEN && process.env.NODE_ENV !== 'production') {
    console.warn('OPENSHIFT_USER_TOKEN environment variable is not set');
  }
  const kubeclient = await initKubeClient();

  updateAppsAndWatch(NAMESPACE || DEFAULT_NAMESPACE, kubeclient);

  app.listen(port, () => {
    console.log(`Listening on port ${port} - oc api proxy on ${OPENSHIFT_PROXY_PATH}`);
  });
}

run();
