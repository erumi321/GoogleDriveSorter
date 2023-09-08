/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '660437883218-87b4c7jvt14pljlhj7gdmiul60bf0m30.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDB1AoCJ9l5IYIKTx8brHhbl9IffaAylUg';

var client;
var access_token;
function initClient() {
    client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        callback: (tokenResponse) => {
            access_token = tokenResponse.access_token;
            refresh_token = tokenResponse.refresh_token;
        },
        prompt: '',
        scope: 'https://www.googleapis.com/auth/drive'
    });
    getToken();
}
function getToken() {
    client.requestAccessToken();
}
function revokeToken() {
    google.accounts.oauth2.revoke(access_token, () => {console.log('access token revoked')});
}

function sendBatchUpdate(id, requestData, callback){
    var postXhr = new XMLHttpRequest();

    postXhr.open('POST', "https://docs.googleapis.com/v1/documents/" + id + ":batchUpdate?key=" + API_KEY);

    postXhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    postXhr.setRequestHeader('Accept', 'application/json');
    postXhr.setRequestHeader('Content-Type', 'application/json');
    postXhr.onreadystatechange = () => {
        if (postXhr.readyState === 4) {
            callback(postXhr.response);
        }
    }

    postXhr.send(requestData);
}

function API_GETWORKINGDRIVE(callback) {
    var xhr = new XMLHttpRequest();
    let base_id = "1igXZvObAF2c-hN2ScbfCTGwq2_vne22r"
    let url = "https://www.googleapis.com/drive/v3/files?corpora=user&orderBy=folder&q=mimeType%20%3D%20%27application%2Fvnd.google-apps.folder%27%20and%20%27" + base_id + "%27%20in%20parents&key="
    xhr.open('GET', url + API_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = (response) => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            console.log(response)
            let responseJSON = JSON.parse(response.target.response)
            console.log(responseJSON)
            callback(responseJSON)
        }
    }

    xhr.send();
}

function API_CREATEDOC(name, parents, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', "https://www.googleapis.com/drive/v3/files?key=" + API_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');
    let requestData = {
        "mimeType": "application/vnd.google-apps.document",
        "name": name,
        "parents": parents,
    }
    xhr.onreadystatechange = (response) => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            let responseJSON = JSON.parse(response.target.response)
            console.log(responseJSON)
            callback(responseJSON)
        }
    }

    xhr.send(JSON.stringify(requestData).replace(/\\"/g, '"'));
}