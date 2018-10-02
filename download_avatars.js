var request = require('request');
var secrets = require('./secrets.js');

// console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token' + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    if (err) {
      cb(err);
    } else {
      var formattedData = JSON.parse(body);
      cb(null, getAvatarUrls(formattedData));
    }
  });
}


function getAvatarUrls(formattedData) {
  return formattedData.map(function(element) {
    return element.avatar_url;
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Results:", result);
});