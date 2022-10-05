"use strict";

const form = document.querySelector("form");
const payloadInput = document.getElementById("payload");
const topicInput = document.getElementById("topic");
const preview = document.getElementById("preview");

// Add auto rezise
const initialScrollHeight = payload.scrollHeight;
payload.setAttribute(
  "style",
  `height:${payload.scrollHeight}px;` + "overflow-y:hidden;"
);
payload.addEventListener("input", reziseTextarea, false);

function reziseTextarea() {
  if (this.scrollHeight === initialScrollHeight) return;
  if (this.scrollHeight < initialScrollHeight) {
    this.style.height = 0;
    this.style.height = initialScrollHeight + "px";
  } else {
    this.style.height = 0;
    this.style.height = this.scrollHeight + "px";
  }
}

const formatResponseToOutput = (response) => {
  try {
    return JSON.stringify(JSON.parse(response), null, 2);
  } catch (e) {
    return response;
  }
};

const handleSubmit = () => {
  const topic = topicInput.value;
  let payload = payloadInput.value;
  try {
    payload = JSON.stringify(JSON.parse(payload));
  } catch (e) {}
  connection
    .invoke("SendMessage", topic, payload)
    .catch((err) => console.error(err.toString()));
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});

payloadInput.onkeydown = (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
};

topicInput.onkeydown = (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
};

const connection = new signalR.HubConnectionBuilder().withUrl("/echo").build();

connection.on("ReceiveMessage", (payload) => {
  preview.textContent = formatResponseToOutput(payload);
});

connection
  .start()
  /* .then(function () {
    submitButton.disabled = false; // TODO: Implement
  }) */
  .catch((err) => console.error(err.toString()));
