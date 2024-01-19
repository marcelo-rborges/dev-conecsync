/*
  // example:
  var url = "http://example.com/";

  var parameters = {
    name: "George Washington",
    dob: "17320222"
  };

  console.log(buildUrl(url, parameters));
  // => http://www.example.com/?name=George%20Washington&dob=17320222 
*/

export function buildUrl(url, parameters) {
  var qs = "";
  for (var key in parameters) {
    var value = parameters[key];
    qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
  } // for
  if (!!qs.length) {
    qs = qs.substring(0, qs.length - 1); //chop off last "&"
    url = url + "?" + qs;
  } // if
  return url;
}