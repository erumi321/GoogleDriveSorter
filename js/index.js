let file_id ={
    "Math": null,
    "History": null,
    "Physics": null,
    "Computer Science": null,
    "English": null,
    "French": null,
}

let child_id = {
    "Math": null,
    "History": null,
    "Physics": null,
    "Computer Science": null,
    "English": null,
    "French": null,
}

let timeBlock = {
    "A": {
        "N": { //normal day
            528: "Math",
            627: null,
            736: "History",
            827: "Physics"
        },
        "S": { //Short Day
            //TODO: Implement me
        }
    },
    "E": {
        "N": { //normal day
            528: "Computer Science",
            627: "English",
            736: null,
            827: "French"
        },
        "S": { //short day
            //TODO: Implement me
        }
    }

}
loadSubjectFolders()
function loadSubjectFolders() {
    child_id["Math"] = localStorage.getItem("Math-folder")
    if (child_id["Math"] != null) {
        document.getElementById("MathFolder").value = child_id["Math"]
    }
    child_id["History"] = localStorage.getItem("History-folder")
    if (child_id["History"] != null) {
        document.getElementById("HistoryFolder").value = child_id["History"]
    }
    child_id["Physics"] = localStorage.getItem("Physics-folder")
    if (child_id["Physics"] != null) {
        document.getElementById("PhysicsFolder").value = child_id["Physics"]
    }
    child_id["Computer Science"] = localStorage.getItem("Computer Science-folder")
    if (child_id["Computer Science"] != null) {
        document.getElementById("CompSciFolder").value = child_id["Computer Science"]
    }
    child_id["English"] = localStorage.getItem("English-folder")
    if (child_id["English"] != null) {
        document.getElementById("EnglishFolder").value = child_id["English"]
    }
    child_id["French"] = localStorage.getItem("French-folder")
    if (child_id["French"] != null) {
        document.getElementById("FrenchFolder").value = child_id["French"]
    }
}

function submitTimeRelativeDocument(schoolDay) {
    closePopupWindow("day_background")
    let d = new Date()
    let hours = d.getHours()
    let minutes = d.getMinutes()
    let time = hours * 60 + minutes
    let schoolDayType = "N" //TODO: Implement chooser
    for (const [key, value] of Object.entries(timeBlock[schoolDay][schoolDayType])) {
        let t = time - key
        if (t <= 0) {
            if (value in file_id && file_id[value] != null) {
                let parentId = file_id[value]
                API_CREATEDOC("New Doc", [parentId], (doc) => {
                    window.open("https://docs.google.com/document/d/" + doc.id + "/edit", "_blank")
                })
            }
            break;
        }
    }
}

function getParentFolder() {
    handleAuthClick((id) => {
        DRIVE_BASE_FOLDER = id
        API_GETWORKINGDRIVE((drive) => {
            drive.files.forEach((folder) => {
                if (folder.name in file_id) {
                    if (child_id[folder.name] != null) {
                        console.log("go")
                        API_GETCHILDFOLDER(child_id[folder.name], folder.id, (child_folder) => {
                            file_id[folder.name] = child_folder.id
                        })
                    }else{
                        file_id[folder.name] = folder.id
                    }
                }
            })
            document.getElementById("timeDocBtn").classList.remove("hidden")
            document.getElementById("sortFileBtn").classList.remove("hidden")
        })
    })
}

function sortFiles() {
    API_GETRECENTFILES((files) => {
        var failed_files = []
        files.forEach((file) => {
            let sName = file.name.split("/")
            if (sName.length > 1) {
                let cleanName = sName[0].trim()
                if(cleanName in file_id && file_id[cleanName] != null) {
                    let newName = sName.slice(1).join('')
                    API_ADDPARENT(file.id, file_id[cleanName], newName, (response) => {
                        // console.log(response)
                    })
                }else{
                    failed_files.push(file.name)
                }
            }
        })
        if (failed_files.length > 0) {
            var parent = document.getElementById("fail-container");
            while (parent.firstChild) {
                parent.removeChild(parent.lastChild);
            }
            for(var i = 0; i < failed_files.length; i++) {
                var p = document.createElement("p");
                p.classList.add("fail-card");
                p.innerText = failed_files[i];
                parent.appendChild(p);
            }
            
            openPopupWindow("failWindow");

        }else{
            openPopupWindow("successWindow")
        }
    })   
}

function openPopupWindow(id) {
    var w = document.getElementById(id);
    w.classList.remove("hidden")
    w.classList.add("popup-window-fadein");
}

function closePopupWindow(id) {
    var w = document.getElementById(id);
    w.classList.add("popup-window-fadeout");
    w.classList.remove("popup-window-fadein");
    setTimeout(() => {
        w.classList.remove("popup-window-fadeout");
        w.classList.add("hidden");
    }, 475);
}

function extendedSettings() {
    var bar = document.getElementById('settings-bar');
    if(bar.classList.contains('extended')){
        document.getElementById('settings-cog').classList.add('settings-cog-rotate-inv');
        setTimeout(() => {
            document.getElementById('settings-cog').classList.remove("settings-cog-rotate-inv");
        }, 1195);
        document.getElementById('settings-cog').classList.remove('material-symbols-outlined-fill');
        bar.classList.remove('extended');
    }else{
        document.getElementById('settings-cog').classList.add('settings-cog-rotate');
        setTimeout(() => {
            document.getElementById('settings-cog').classList.remove("settings-cog-rotate");
        }, 1195);
        document.getElementById('settings-cog').classList.add('material-symbols-outlined-fill');
        bar.classList.add('extended');
    }
}

function setSubjectFolder(subject, field) {
    console.log("ok")
    localStorage.setItem(subject + "-folder", field.value)
}