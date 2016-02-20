import config from '../config/environment';

export default function clusterProxyUrl(clusterName) {
  return `${config.baseURL}riak/clusters/${clusterName}`;
}
