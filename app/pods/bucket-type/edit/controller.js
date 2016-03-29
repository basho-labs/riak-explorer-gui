import Ember from 'ember';
import _ from 'lodash/lodash';
import ScrollReset from '../../../mixins/controller/scroll-reset';

export default Ember.Controller.extend(ScrollReset, {
  initialProps: {},

  updatedProps: {},

  editableProps: [],

  errors: [],

  nonEditableProps: [],

  convertStringToType(string, type) {
    let methodName = `is${_.capitalize(type)}`; // Converts to proper underscore method name (_.isArray, _.isBoolean, etc.)
    let isValid = true;
    let convertedValue = null;

    // Set empty arrays
    if (type === 'array' && Ember.isBlank(string)) {
      string = '[]';
    }

    switch(type) {
      // TODO: Once lodash upgrades, use _.isInteger
      case 'integer':
        convertedValue = parseInt(string);
        if (isNaN(convertedValue)) {
          isValid = false;
        }
        break;
      case 'array':
      case 'object':
      case 'boolean':
        try {
          convertedValue = JSON.parse(string);
          if (!_[methodName](convertedValue)) {
            isValid = false;
          }
        } catch(e) {
          isValid = false;
        }
        break;
      case 'integer|string':
        let possibleInt = parseInt(string);

        convertedValue = isNaN(possibleInt) ? string : possibleInt;
        break;
      default:
        convertedValue = string;
        break;
    }

    return {valid: isValid, value: convertedValue};
  },

  getErrorObject(propKey) {
    return this.get('errors').findBy('id', propKey);
  },

  errorExists(propKey) {
    return !!this.getErrorObject(propKey);
  },

  removeError(propKey) {
    let errors = this.get('errors');

    return errors.removeAt(errors.indexOf(this.getErrorObject(propKey)));
  },

  addError(prop) {
    let message = null;

    switch(prop.json_schema_type) {
      case 'integer':
        message = 'must be an integer';
        break;
      case 'array':
        message = 'must be an array';
        break;
      case 'object':
        message = 'must be an object';
        break;
      case 'string':
        message = 'must be a string';
        break;
      case 'boolean':
        message = 'must be a boolean';
        break;
      case 'integer|string':
        message = 'must be an integer or string';
        break;
      default:
        break;
    }

    this.scrollToTop();

    return this.get('errors').pushObject({
      id: prop.key,
      message: `${prop.name} ${message}`
    });
  },

  actions: {
    changedValue: function(prop) {
      let converted = this.convertStringToType(prop.value, prop.json_schema_type);

      if (converted.valid) {
        if (this.errorExists(prop.key)) {
          this.removeError(prop.key);
        }

        if (this.get('initialProps')[prop.key] !== converted.value) {
          this.updatedProps[prop.key] = converted.value;
        }
      } else {
        if (!this.errorExists(prop.key)) {
          this.addError(prop);
        }
      }
    }
  }
});
