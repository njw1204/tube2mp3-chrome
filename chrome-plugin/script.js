function friendlyHttpStatus(code) {
  var statusContent = {
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Unused',
    '307': 'Temporary Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Required',
    '413': 'Request Entry Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': 'I\'m a teapot',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported',
  };
  return statusContent[code];
}


function getQueryVariable(query, variable) {
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  throw new Error("Can't parse querystring.");
}


function menuOnClick(info, tab) {
  try {
    var video_id = getQueryVariable(info.pageUrl.split('?')[1], 'v');
  } catch (ex) {
    alert(ex + '\nUnable to interpret video URL.');
    return;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=' + video_id, true);

  xhr.onload = function(e) {
    if (xhr.readyState == 4) {
      try {
        if (xhr.status != 200)
          throw new Error(xhr.status + ' ' + friendlyHttpStatus(xhr.status));

        var videoInfo = JSON.parse(xhr.responseText);
        var notiOpt = {
          type: 'basic',
          title: videoInfo.title,
          message: 'Converting video to mp3...',
          iconUrl: 'icon.png'
        };
        var notiId = Math.random().toString(36).slice(2);

        chrome.notifications.getAll(function(notifications) {
          if (notifications) {
            for (var key in notifications) {
              chrome.notifications.clear(key);
            }
          }
        });
        chrome.notifications.create(notiId, notiOpt, function(id) {});

        chrome.downloads.download({
          url: 'http://54.180.51.110/mp3/' + video_id,
          filename: videoInfo.title.replace(/[/\\?<>:*|"]/g, ' ').trim() + '.mp3'
        }, function (downloadId) {
          chrome.notifications.clear(notiId, function(wasCleared) {});
        });
      } catch (ex) {
        alert(ex + "\nCan't connect to server.");
      }
    }
  };

  xhr.onerror = function(e) {
    alert('Error: Fail to load XMLHttpRequest');
  }

  xhr.send(null);
}


chrome.contextMenus.create({
  'title': 'Download MP3 from video',
  'contexts': ['page'],
  'documentUrlPatterns': ['*://*.youtube.com/watch*'],
  'onclick': menuOnClick
});
