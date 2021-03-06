"use strict"

function parseUrl() {
  var url_queries = {
    collection: window.location.href.indexOf('collection='),
    product: window.location.href.indexOf('product='),
    filter: window.location.href.indexOf('filter='),
    option: window.location.href.indexOf('option='),
    query: window.location.href.indexOf('query='),
  }

  var url_params = { path: window.location.pathname }

  var parsedUrl = ''
  var startOfParams = window.location.href.indexOf('?') + 1

  if (startOfParams >= 0) {
    parsedUrl = window.location.href.slice(startOfParams)
    parsedUrl = parsedUrl.split('&')
    for (var i = 0; i < parsedUrl.length; i++) {
      var data = parsedUrl[i].split('=')
      if (data[1]) {
        url_params[data[0]] = data[1].replace(/%20/g, ' ').replace(/%26/g, '&')
      } else {
        url_params[data[0]] = null
      }
    }
  }
  console.log('url_params: ', url_params)
  return url_params
}
