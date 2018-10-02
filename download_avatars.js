var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');
// throw error if no command line input for arguments
var commandLine = require(process.argv.slice(2));

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
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

// take formatted JSON data (array of objects) and passes avatar_url and login as arguments for downloadImageByURL
function getAvatarUrls(formattedData) {
  return formattedData.forEach(function(contributor) {
    // precede contributor.login with avatars/ to direct downloads into the right directory
    downloadImageByURL(contributor.avatar_url, "avatars/" + contributor.login + ".jpeg");
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })

       .on('response', function (response) {
         console.log('Downloading image...');
       })

       .on('end', function () {
         console.log('Download complete.');
       })

      .pipe(fs.createWriteStream(filePath));
}

// repoOwner is process.argv[2] and repoName is process.argv[3]
getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  console.log("Errors:", err);
  console.log("Results:", result);
});
