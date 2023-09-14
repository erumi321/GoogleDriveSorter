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

function submitTimeRelativeDocument(schoolDay) {
    document.getElementById("DaySelector").classList.add("hidden")
    let d = new Date()
    let hours = d.getHours()
    let minutes = d.getMinutes()
    let time = hours * 60 + minutes
    let schoolDayType = "N" //TODO: Implement chooser
    for (const [key, value] of Object.entries(timeBlock[schoolDay][schoolDayType])) {
        let t = time - key
        if (t <= 0) {
            API_GETWORKINGDRIVE((drive) => {
                drive.files.forEach((file) => {
                    if (file.name == value) {
                        let parentId = file.id
                        API_CREATEDOC("New Doc", [parentId], (doc) => {
                            window.open("https://docs.google.com/document/d/" + doc.id + "/edit", "_blank")
                        })
                    }
                })
            })

            break;
        }
    }
}

function createTimeRelativeDocument() {
    document.getElementById("DaySelector").classList.remove("hidden")
    document.getElementById("ADayButton").setAttribute("onclick", "submitTimeRelativeDocument('A')")
    document.getElementById("EDayButton").setAttribute("onclick", "submitTimeRelativeDocument('E')")
}

function getParentFolder() {
    handleAuthClick((id) => {
        DRIVE_BASE_FOLDER = id
    })
}