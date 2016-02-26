export function initialize(app) {
  // inject explorer service into all routes
  app.inject('route', 'explorer', 'service:explorer');
  // inject the store into the explorer service
  app.inject('service:explorer', 'store', 'service:store');
}

export default {
  name: 'explorer',
  initialize: initialize
};
