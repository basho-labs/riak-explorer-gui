import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL(modelName, id, snapshot, requestType, query) {
        return `/explore/clusters/${query.clusterId}/nodes`;
    }
});
