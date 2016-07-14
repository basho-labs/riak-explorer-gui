// recursive function that formats a raw js object into a map object for the explorer service
export function formatNewMap(map) {
  let formatted = { "update": {} };

  Object.keys(map).forEach(function(key) {
    switch(true) {
      case key.endsWith('_counter'):
      case key.endsWith('_register'):
        formatted.update[key] = map[key];
        break;
      case key.endsWith('_flag'):
        formatted.update[key] = map[key] ? "enable" : "disable";
        break;
      case key.endsWith('_set'):
        formatted.update[key] = { "add_all": map[key] };
        break;
      case key.endsWith('_map'):
        formatted.update[key] =  formatNewMap(map[key]);
        break;
      default:
        break;
    }
  });

  return formatted;
}
