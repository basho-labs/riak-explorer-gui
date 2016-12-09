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
        // recursively call this function again
        formatted.update[key] =  formatNewMap(map[key]);
        break;
      default:
        break;
    }
  });

  return formatted;
}

export function formatRiakObject(type, value) {
  let formatted = {};

  switch(type) {
    case 'Counter':
      formatted["increment"] = value;
      break;
    case 'Set':
    case 'HyperLogLog':
      formatted["add_all"] = value;
      break;
    case 'Map':
      formatted = formatNewMap(value);
      break;
  }

  return formatted;
}
