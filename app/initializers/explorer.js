export function initialize(container, app) {
  // inject explorer service into all routes
  app.inject('route', 'explorer', 'service:explorer');
  // inject the store into the explorer service
  app.inject('service:explorer', 'store', 'store:main');
}

export default {
  name: 'explorer',
  initialize: initialize
};
