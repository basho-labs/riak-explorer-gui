import ApplicationAdapter from './application';
import config from '../config/environment';

export default ApplicationAdapter.extend({
    buildURL(modelName, id, snapshot, requestType, query) {
        return `${config.baseURL}explore/clusters/${query.clusterId}/nodes`;
    }
});
