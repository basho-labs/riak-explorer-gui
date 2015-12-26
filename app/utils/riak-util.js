function objectToString(obj) {
  var propsStr = "{";
  var i = 0;
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (i > 0) {
        propsStr += ", ";
      }
      propsStr += prop + ': ' + obj[prop];
      i++;
    }
  }
  return propsStr + "}";
}

export default function objectToArray(obj, alphaSorted = true) {
  var propsArray = [];

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
        propsArray.push({key: prop, value: objectToString(obj[prop])});
      } else if (Object.prototype.toString.call(obj[prop]) === '[object Array]') {
        var arrStr = "[" + obj[prop].join(', ') + "]";
        propsArray.push({key: prop, value: arrStr});
      } else {
        propsArray.push({key: prop, value: obj[prop]});
      }
    }
  }

  if (alphaSorted) {
    propsArray.sort(function(a, b) {
      if (a.key < b.key) {
        return -1;
      } else if (a.key > b.key) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  return propsArray;
}
