/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const DRIVE_API_KEY = 'AIzaSyDB1AoCJ9l5IYIKTx8brHhbl9IffaAylUg';
const SCOPES = 'https://www.googleapis.com/auth/drive'
var DRIVE_BASE_FOLDER = ''

function sendBatchUpdate(id, requestData, callback){
    var postXhr = new XMLHttpRequest();

    postXhr.open('POST', "https://docs.googleapis.com/v1/documents/" + id + ":batchUpdate?key=" + DRIVE_API_KEY);

    postXhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
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
    let url = "https://www.googleapis.com/drive/v3/files?corpora=user&orderBy=folder&q=mimeType%20%3D%20%27application%2Fvnd.google-apps.folder%27%20and%20%27" + DRIVE_BASE_FOLDER + "%27%20in%20parents&key="
    xhr.open('GET', url + DRIVE_API_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = (response) => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            let responseJSON = JSON.parse(response.target.response)
            callback(responseJSON)
        }
    }

    xhr.send();
}

function API_CREATEDOC(name, parents, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', "https://www.googleapis.com/drive/v3/files?key=" + DRIVE_API_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
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
            callback(responseJSON)
        }
    }

    xhr.send(JSON.stringify(requestData).replace(/\\"/g, '"'));
}

function API_GETRECENTFILES(callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', "https://www.googleapis.com/drive/v3/files?orderBy=createdTime&q=mimeType%20%3D%20%27application%2Fvnd.google-apps.document%27%20or%20mimeType%20%3D%20%27application%2Fvnd.google-apps.spreadsheet%27%20or%20mimeType%20%3D%20%27application%2Fvnd.google-apps.form%27&key=" + DRIVE_API_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onreadystatechange = (response) => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            let responseJSON = JSON.parse(response.target.response)
            callback(responseJSON.files)
        }
    }

    xhr.send();
}

function API_ADDPARENT(id, parentId, name, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', "https://www.googleapis.com/drive/v2/files/" + id + "?addParents=" + parentId + "&key=" + DRIVE_API_KEY);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');

    let requestData = {
        "title": name,
    }

    xhr.onreadystatechange = (response) => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            let responseJSON = JSON.parse(response.target.response)
            callback(responseJSON)
        }
    }

    xhr.send(JSON.stringify(requestData).replace(/\\"/g, '"'))
}