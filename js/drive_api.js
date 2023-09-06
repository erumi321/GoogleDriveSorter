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

// function loadDrivePages(pageToken) {
//     var xhr = new XMLHttpRequest();
//     requestURLParameters = [
//         'orderBy', 'modifiedTime%20desc',
//         'fields', 'nextPageToken,files(id,name,mimeType)',
//         'trashed', false,
//         'key', API_KEY
//     ]

//     if (pageToken != null) {
//         requestURLParameters.splice(0, 0, pageToken);
//         requestURLParameters.splice(0, 0, 'pageToken');
//     }

//     requestURL = 'https://www.googleapis.com/drive/v3/files?'
//     for(var i = 0; i < requestURLParameters.length; i+=2) {
//         requestURL += requestURLParameters[i] + "=" + requestURLParameters[i + 1] + "&";
//     }

//     xhr.open('GET', requestURL);
//     xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
//     xhr.setRequestHeader('Accept', 'json');

//     xhr.onreadystatechange = () => {
//         if (xhr.status === 401 && xhr.readyState == 4) {
//             alert("You need a new token. After the pop-up closes press the refresh button.");
//             getToken();
//             return;
//         }
//         if (xhr.readyState === 4 && xhr.status != 401) {
//             var xhrJson = JSON.parse(xhr.response);
            
//             cardContainer = document.getElementById("context-bar").children[1];
            
//             for(var i = 0; i < xhrJson.files.length; i++){
//                 var file = xhrJson.files[i];
                
//                 //only allow google doc files
//                 if (file.mimeType != "application/vnd.google-apps.document") {
//                     continue;
//                 }

//                 var container = document.createElement('div');
//                 container.classList.add('context-card');
//                 container.setAttribute('onclick', 'selectDoc(this, "' + file.id + '")');

//                 var text = document.createElement('p');
//                 text.innerText = xhrJson.files[i].name;

//                 container.appendChild(text);
//                 cardContainer.appendChild(container);
//             }

//             if (xhrJson.nextPageToken) {
//                 console.log(xhrJson.nextPageToken);
//                 loadDrivePages(xhrJson.nextPageToken);
//             }
//         }
//     }

//     xhr.send();
// } 

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

// function clearDriveDoc(id, callback) {
//     //test doc id: 1EqWilimO1NDqgoJ3zzUxW4c5NcATWxVNX4y2_jlz8uM

//     var getXhr = new XMLHttpRequest();

//     getXhr.open('GET', 'https://docs.googleapis.com/v1/documents/' + id + '?fields=body.content(startIndex%2CendIndex)&key=' + API_KEY);
//     getXhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
//     getXhr.setRequestHeader('Accept', 'application/json');
//     getXhr.onreadystatechange = () => {
//         if (getXhr.readyState === 4) {
//             var xhrJSON = JSON.parse(getXhr.response);

//             var content = xhrJSON.body.content;

//             var startIndex = content[1].startIndex;
//             var endIndex = content[content.length - 1].endIndex - 1;

//             if (endIndex == 1) {
//                 callback();
//                 return;
//             }

//             var requestData = {
//                 "requests": [
//                   {
//                     "deleteContentRange": {
//                       "range": {
//                         "startIndex": startIndex,
//                         "endIndex": endIndex
//                       }
//                     }
//                   }
//                 ]
//               }

//             sendBatchUpdate(id, JSON.stringify(requestData).replace(/\\"/g, '"'), callback);
//         }
//     }

//     getXhr.send();
// }

// function writeDriveDoc(id, startLocation = 1, content, callback) {
//     var requestData = {
//         "requests": [
//           {
//             "insertText": {
//               "location": {
//                 "index": startLocation
//               },
//               "text": content
//             }
//           }
//         ]
//       }
//     sendBatchUpdate(id, JSON.stringify(requestData).replace(/\\"/g, '"'), callback);
// }

// function getDriveDocText(id, callback) {
//     var getXhr = new XMLHttpRequest();

//     getXhr.open('GET', 'https://docs.googleapis.com/v1/documents/' + id + '?fields=title,body.content&key=' + API_KEY);
//     getXhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
//     getXhr.setRequestHeader('Accept', 'application/json');
//     getXhr.onreadystatechange = () => {
//         if (getXhr.readyState === 4) {
//             console.log(getXhr.response)

//             var xhrJSON = JSON.parse(getXhr.response);

//             var text = "";

//             xhrJSON.body.content.forEach((item) => {
//                 if (item.hasOwnProperty('paragraph')) {
//                     item.paragraph.elements.forEach((element) => {
//                         if (element.hasOwnProperty('textRun') && element.textRun.hasOwnProperty('content')) {
//                             text += element.textRun.content;
//                         }
//                     })
//                 }
//             });

//             callback(text);
//         }
//     }

//     getXhr.send();
// }

function uploadFile(id, callback) {
    var getXhr = new XMLHttpRequest();

    getXhr.open('POST', "https://www.googleapis.com/drive/v3/files?key=" + API_KEY);
    getXhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    getXhr.setRequestHeader('Accept', 'application/json');
    getXhr.setRequestHeader('Content-Type', 'application/json');
    let requestData = {
        "mimeType": "application/vnd.google-apps.document",
        "name": "test"
    }
    getXhr.onreadystatechange = () => {
        console.log("AHHHHHHHHH")
    }

    getXhr.send(JSON.stringify(requestData).replace(/\\"/g, '"'));
}