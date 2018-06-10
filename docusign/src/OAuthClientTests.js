
const docusign = require('../src/index');
const apiClient = new docusign.ApiClient();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';



const integratorKeyImplicit = '3f5229d7-6d61-48be-b502-a2f2a60a1d25'; // An IK for a non-mobile docusign account

const clientSecret = '20027159-e58e-4928-ab02-c43fdf9d204e';
const redirectUri = 'http://localhost:3000/auth';
const basePath = 'https://demo.docusign.net/restapi';

const responseTypeCode = apiClient.OAuth.ResponseType.CODE; // Response type of code, to be used for the Auth code grant
const responseTypeToken = apiClient.OAuth.ResponseType.TOKEN; // Response type of token, to be used for implicit grant
const scopes = [apiClient.OAuth.Scope.EXTENDED];
const randomState = '*^.$DGj*)+}Jk'; // after successful login you should compare the value of URI decoded "state" query param with the one created here. They should match

apiClient.setBasePath(basePath);
/*
// Auth Code Grant
app.get('/', function (req, res) {
    const authUri = apiClient.getAuthorizationUri(integratorKey, scopes, redirectUri, responseTypeCode, randomState);//get DocuSign OAuth authorization url
     //Open DocuSign OAuth login in a browser, res being your node.js response object.
    res.redirect(authUri);
    console.log(authUri);
});

app.get('/auth', function (req, res) {
  // IMPORTANT: after the login, DocuSign will send back a fresh
  // authorization code as a query param of the redirect URI.
  // You should set up a route that handles the redirect call to get
  // that code and pass it to token endpoint as shown in the next
  // lines:
  console.log("x");
  apiClient.generateAccessToken(integratorKey, clientSecret, req.query.code, function (err, oAuthToken) {
console.log("y");
    console.log(oAuthToken);

    apiClient.getUserInfo(oAuthToken.accessToken, function (err, userInfo) {
      console.log("UserInfo: " + userInfo);
      // parse first account's baseUrl
      // below code required for production, no effect in demo (same
      // domain)
      apiClient.setBasePath(userInfo.accounts[0].baseUri + "/restapi");
      res.send(userInfo);
      createEnvelope(userInfo.accounts[0].accountId);
    });
  });
});
*/

// Implicit Grant

app.get('/', function (req, res) {
    const authUri = apiClient.getAuthorizationUri(integratorKeyImplicit, scopes, redirectUri, responseTypeToken, randomState);//get DocuSign OAuth authorization url
     //Open DocuSign OAuth login in a browser, res being your node.js response object.
    res.redirect(authUri);
    console.log("x");
});

app.get('/auth', function (req,res) {

  // IMPORTANT: after the login, DocuSign will send back a new
  // access token in the hash fragment of the redirect URI.
  // You should set up a client-side handler that handles window.location change to get
  // that token and pass it to the ApiClient object as shown in the next
  // lines:
  res.send();
});

app.get('/auth/:accessToken', function (req, res) {
  // This a sample endpoint to allow you to pass in the previously received accesstoken to log in via getUserInfo
  // ex: http://localhost:3000/auth#access_token=<token>&expires_in=<expiresIn>&token_type=<tokenType>&state=<randomState>
  // ex: http://localhost:3000/auth/<token>
  console.log("y");
  const accessToken = req.params.accessToken;

  apiClient.getUserInfo(accessToken, function (err, userInfo) {
    if (err)
      console.log(err)

    console.log("UserInfo: " + userInfo);
    // parse first account's baseUrl
    // below code required for production, no effect in demo (same
    // domain)
    apiClient.setBasePath(userInfo.accounts[0].baseUri + "/restapi");
    //res.send(userInfo);

  });
});


function createEnvelope(accountId) {
    var envDef = new docusign.EnvelopeDefinition();
    envDef.emailSubject = 'Please sign this document sent from Node SDK';
    envDef.templateId = 'bc284b7a-da00-4da8-ae79-1afa58631033';
    //bc284b7a-da00-4da8-ae79-1afa58631033
    //{TEMPLATE_ID}
    // create a template role with a valid templateId and roleName and assign signer info
    var tRole = new docusign.TemplateRole();
    tRole.roleName = 'Patient 1';
    tRole.name = 'Andre Nguyen';
    tRole.email = 'ahnguye@ucdavis.edu';

    // set the clientUserId on the recipient to mark them as embedded (ie we will generate their signing link)
    tRole.clientUserId = '1001';

    // create a list of template roles and add our newly created role
    var templateRolesList = [];
    templateRolesList.push(tRole);

    // assign template role(s) to the envelope
    envDef.templateRoles = templateRolesList;

    // send the envelope by setting |status| to 'sent'. To save as a draft set to 'created'
    envDef.status = 'sent';

    // use the |accountId| we retrieved through the Login API to create the Envelope
    //var accountId = accountId;

    // instantiate a new EnvelopesApi object
    var envelopesApi = new docusign.EnvelopesApi();

    // call the createEnvelope() API
    envelopesApi.createEnvelope(accountId, {'envelopeDefinition': envDef}, function (err, envelopeSummary, response) {
      if (err) {
        console.log(err);
      }
      console.log('EnvelopeSummary: ' + JSON.stringify(envelopeSummary));
    });
}


app.listen(port, host, function (err) {
  if (err) { throw err; }

  console.log('Your server is running on http://' + host + ':' + port + '.');
});
