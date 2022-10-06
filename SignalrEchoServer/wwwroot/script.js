"use strict";

// Elements
const form = document.querySelector("form");
const payloadInput = document.getElementById("payload");
const addTopicButton = document.getElementById("add-topic");
const topicInput = document.getElementById("topic");
const topicReceived = document.getElementById("topic-received");
const preview = document.getElementById("preview");
const acitveSubscriptionsList = document.getElementById(
  "active-subscriptions-list"
);

const state = {
  subscriptions: [],
  initialScrollHeight: payloadInput.scrollHeight,
};
const renderSubscriptions = () => {
  acitveSubscriptionsList.innerHTML = "";
  state.subscriptions.forEach((topic) => {
    const li = document.createElement("li");
    li.onclick = () => unsubscribe(topic);
    const code = document.createElement("code");
    code.textContent = topic;
    li.appendChild(code);
    acitveSubscriptionsList.appendChild(li);
  });
};

// Add auto rezise
function reziseTextarea() {
  if (this.scrollHeight === state.initialScrollHeight) return;
  if (this.scrollHeight < state.initialScrollHeight) {
    this.style.height = 0;
    this.style.height = state.initialScrollHeight + "px";
  } else {
    this.style.height = 0;
    this.style.height = this.scrollHeight + "px";
  }
}
payloadInput.setAttribute(
  "style",
  `height:${state.initialScrollHeight}px;` + "overflow-y:hidden;"
);
payloadInput.addEventListener("input", reziseTextarea, false);

const formatResponseToOutput = (response) => {
  try {
    return JSON.stringify(JSON.parse(response), null, 2);
  } catch (e) {
    return response;
  }
};

async function unsubscribe(topic) {
  if (!state.subscriptions.includes(topic)) return;
  state.subscriptions.splice(state.subscriptions.indexOf(topic), 1);
  await connection.off(topic);
  renderSubscriptions();
}

const subscribe = async (topic) => {
  if (!topic?.length) return;
  if (state.subscriptions.includes(topic)) return;

  state.subscriptions.push(topic);
  connection.on(topic, (payload) => {
    preview.textContent = formatResponseToOutput(payload);
    topicReceived.textContent = topic;
  });

  renderSubscriptions();
};

const connection = new signalR.HubConnectionBuilder().withUrl("/echo").build();
subscribe("ReceiveMessage");

connection
  .start()
  /* .then(function () {
    submitButton.disabled = false; // TODO: Implement
  }) */
  .catch((err) => console.error(err.toString()));

const handleSubmit = async () => {
  const topic = topicInput.value;
  if (!topic.length) return;
  await subscribe(topic);

  let payload = payloadInput.value;
  try {
    payload = JSON.stringify(JSON.parse(payload)).replace(/\\/g, "");
  } catch (e) {}
  connection.invoke("SendMessage", topic, payload).catch(console.error);
};

const handleSetTopic = async () => {
  await subscribe(topicInput.value);
};

const submitOnKeyStroke = (callback) => (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) callback();
};

// Event handlers
payloadInput.onkeydown = submitOnKeyStroke(handleSubmit);
topicInput.onkeydown = submitOnKeyStroke(handleSetTopic);
addTopicButton.onclick = (e) => {
  e.preventDefault();
  if (topicInput.value.length) subscribe(topicInput.value);
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});
