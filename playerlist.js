var list = document.getElementById('users');

function addUser(){
    var username = document.getElementById('username').value;
    // var score = ('score').value;
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(username));
    // entry.appendChild(document.createTextNode(username + ' ' + score));
    list.appendChild(entry);

    return false;
}
