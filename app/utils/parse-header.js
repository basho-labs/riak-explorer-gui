/**
 * Parses the raw AJAX headers string and returns it as a usable hash.
 *
 * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
 * headers according to the format described here:
 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
 *
 * Which we then have to parse. Like savages.
 *
 * @method parseHeaderString
 * @param {String} headerString
 * @return {Hash} headers
 */
export default function parseHeaderString(headerString) {
  var other_headers = {};
  var indexes = [];
  var custom = [];

  var headerLines = headerString.split("\r\n");

  for (var i = 0; i < headerLines.length; i++) {
    var headerLine = headerLines[i];

    // Can't use split() here because it does the wrong thing
    // if the header value has the string ": " in it.
    var index = headerLine.indexOf(': ');
    if (index > 0) {
      var key = headerLine.substring(0, index).toLowerCase();
      var val = headerLine.substring(index + 2);
      var header = {
        key: key,
        value: val
      };

      if (key.startsWith('x-riak-meta')) {
        custom.push(header);
      } else if (key.startsWith('x-riak-index')) {
        indexes.push(header);
      } else {
        other_headers[key] = val;
      }
    }
  }

  return {
    other: other_headers,
    indexes: indexes,
    custom: custom
  };
}
