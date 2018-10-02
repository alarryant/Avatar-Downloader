var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');
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


function getAvatarUrls(formattedData) {
  console.log("This is formatted data: ", formattedData);
  return formattedData.forEach(function(contributor) {
    downloadImageByURL(contributor.avatar_url, "avatars/" + contributor.login + ".jpeg");
  });
}

function downloadImageByURL(url, filePath) {
  // filepath is avatars/login ID
  // url is my avatar_url
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


getRepoContributors(process.argv[2], process.argv[3], function(err, result) {
  console.log("Errors:", err);
  console.log("Results:", result);
});
