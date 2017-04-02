function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var tokens = query.split('&');
  for (var i=0; i<tokens.length; i++) {
    var pair = tokens[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return undefined;
}
