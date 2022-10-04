"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/echo").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (payload) {
    document.getElementById("messagesList").innerText = `raw payload: ${payload}`;
    console.log(JSON.parse(payload));
});

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var topic = document.getElementById("userInput").value;
    var payload = document.getElementById("messageInput").value;
    try {
        payload = JSON.stringify(JSON.parse(payload))
    } catch (e) {

    }
    console.log("input payload: ", payload);
    connection.invoke("SendMessage", topic, payload).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});