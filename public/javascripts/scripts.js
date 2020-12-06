function filterMoviesByTitle() {
    const port = window.location.port ? ":" + window.location.port : ""
    const address = window.location.protocol + "//" + window.location.hostname + port + '/movies'
    let url = new URL(address);
    const title = document.getElementById("search_input").value
    const category = document.getElementById("category").value
    const minrating = document.getElementById("minrating").value

    if (category !== '') {
        url.searchParams.set('Genre', category);
    } else {
        url.searchParams.delete("Genre");
    }
    if (minrating !== '') {
        url.searchParams.set("minrating", minrating);
    } else {
        url.searchParams.delete("minrating");
    }
    if (title !== "") {
        url.searchParams.set('Title', title);
    } else {
        url.searchParams.delete('Title');
    }

    window.location = url
}

function addReview() {
    const value = parseInt(document.getElementById("review_value").value)
    const port = window.location.port ? ":" + window.location.port : ""
    const address = window.location.protocol + "//" + window.location.hostname + port + window.location.pathname + '/reviews'
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            window.location.reload();
        }
    }
    xmlHttp.open("POST", address, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json")
    xmlHttp.withCredentials = true;
    xmlHttp.send(JSON.stringify({value: value}));
}

function changeRole(currentRole, userID) {
    let newRole = 'contributing'
    if (currentRole === 'contributing')
        newRole = 'regular'
    const port = window.location.port ? ":" + window.location.port : ""
    const address = window.location.protocol + "//" + window.location.hostname + port + "/users/" + userID
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            window.location.reload();
        }
    }
    xmlHttp.open("PUT", address, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json")
    xmlHttp.withCredentials = true;
    xmlHttp.send(JSON.stringify({Id: userID, Role: newRole}));
}

function subscribe(userId) {
    const port = window.location.port ? ":" + window.location.port : ""
    const address = window.location.protocol + "//" + window.location.hostname + port + "/people/" + userId + '/subscribe'
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            window.location.reload();
        }
    }
    xmlHttp.open("POST", address, true);
    xmlHttp.setRequestHeader("Content-Type", "application/json")
    xmlHttp.withCredentials = true;
    xmlHttp.send(null);
}
