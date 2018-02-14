$.urlParam = function (name) {
  var url_string = window.location.href;
  url_string[0] = "?";
  var url = new URL(url_string.replace("#","?"));
  var c = url.searchParams.get(name);
  return c;
}