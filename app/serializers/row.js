import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalize(modelClass, resourceHash, prop) {
    resourceHash.value = resourceHash.value.split(',').join(', ');

    return this._super(modelClass, resourceHash, prop);
  }
});
