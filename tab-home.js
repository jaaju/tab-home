var default_config = {
  'url': 'chrome://apps'
};

var config = null;

function set_config()
{
    console.log(location.href);
    console.log(config);
    var configure = (location.search || '').indexOf('options');
    if (-1 == configure) {
      chrome.tabs.getCurrent(function (tab) {
        if (tab) {
          chrome.tabs.update(tab.id, {'url': config.url});
        }
      });
      return true;
    }

    var option = document.getElementById('newTabUrl');
    if (!option) return true;

    document.getElementById('options').style.opacity = 1;
    option.value = config.url;

    save.addEventListener('click',
      function () {
        config.url = option.value;

        chrome.storage.sync.set(config,
          function () {
            var status = document.getElementById('status');
            status.textContent = 'New tab homepage saved!';
            setTimeout(function () {
              status.textContent = '';
              window.close();
              }, 750);
          });

      });
}

function fetch_config()
{
  chrome.storage.sync.get(default_config,
    function (loaded) {
      config = loaded;
      set_config();
    });
  return true;
}

document.addEventListener('DOMContentLoaded', fetch_config);
chrome.tabs.onCreated.addListener(function(tab) {
  if (tab.url == 'chrome://newtab/') {
    chrome.tabs.update(tab.id, {'url': 'tab-home.html'});
  }
});
