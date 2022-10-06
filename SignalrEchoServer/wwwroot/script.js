"use strict";

const form = document.querySelector("form");
const payloadInput = document.getElementById("payload");
const topicInput = document.getElementById("topic");
const topicReceived = document.getElementById("topic-received");
const preview = document.getElementById("preview")

const topics = []

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

const addListener = (topic) => {
  if (topics.includes(topic)) return;

  connection.on(topic, (payload) => {
    preview.textContent = formatResponseToOutput(payload);
    topicReceived.textContent = topic
  })
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addListener(topicInput.value);
  handleSubmit();
});

payloadInput.onkeydown = (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
};

topicInput.onkeydown = (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
};

const connection = new signalR.HubConnectionBuilder().withUrl("/echo").build();

addListener("ReceiveMessage");

connection
  .start()
  /* .then(function () {
    submitButton.disabled = false; // TODO: Implement
  }) */
  .catch((err) => console.error(err.toString()));
