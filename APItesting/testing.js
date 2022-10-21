function setup() {
  print("test 1 go");
  test1();
  print("test 1 passed");
}

async function test1() {
  return true;
  const options = {
	   authProvider,
  };

  const client = Client.init(options);

  let user = await client.api('/me').get();

  print(user);
}

function test2() {

}

function authenticate() {
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/drive.readonly"})
      .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}

function loadClient() {
  gapi.client.setApiKey("API_KEY");
  return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v3/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.drive.files.list({})
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}

gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "CLIENT_ID"});
});
