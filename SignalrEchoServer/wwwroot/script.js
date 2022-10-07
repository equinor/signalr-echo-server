"use strict";

// Elements
const form = document.querySelector("form");
const addTopicButton = document.getElementById("add-topic");
const topicInput = document.getElementById("topic");
const topicReceived = document.getElementById("topic-received");
const preview = document.getElementById("preview");
const acitveSubscriptionsList = document.getElementById(
  "active-subscriptions-list"
);
const payloadInput = document.getElementById("payload");
autoReziseTextarea(payloadInput);

/* Rendering callbacks */
const renderSubscriptions = () => {
  acitveSubscriptionsList.innerHTML = "";
  subscriptions.forEach((topic) => {
    const li = document.createElement("li");
    li.onclick = () => unsubscribe(topic);
    const code = document.createElement("code");
    code.textContent = topic;
    li.appendChild(code);
    acitveSubscriptionsList.appendChild(li);
  });
};
const handlePayloadReceived = (topic) => (payload) => {
  topicReceived.textContent = topic;
  preview.textContent = formatPayload(payload);
};

/* Handle subscription on topics */
const subscriptions = [];
const unsubscribe = async (topic) => {
  // Not subscribed to topic
  if (!subscriptions.includes(topic)) return;

  await connection.off(topic);
  subscriptions.splice(subscriptions.indexOf(topic), 1);
  renderSubscriptions();
};

const subscribe = async (topic) => {
  // Undefined topic
  if (!topic) return;
  // Already subscribed
  if (subscriptions.includes(topic)) return;

  subscriptions.push(topic);
  connection.on(topic, handlePayloadReceived(topic));
  renderSubscriptions();
};

/* Start connection */
const connection = new signalR.HubConnectionBuilder().withUrl("/echo").build();
connection.start().catch(console.error);
subscribe("ReceiveMessage"); // Subscribe on default message

const handleSubmit = async () => {
  const topic = topicInput.value;
  if (!topic.length) return;
  await subscribe(topic);

  let payload = payloadInput.value;
  try {
    payload = JSON.stringify(JSON.parse(payload));
  } catch (e) {}
  connection.invoke("SendMessage", topic, payload).catch(console.error);
};

const handleSetTopic = async () => await subscribe(topicInput.value);

const handleKeyStroke = (callback) => (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) callback();
};

/* Event handlers */
payloadInput.onkeydown = handleKeyStroke(handleSubmit);
topicInput.onkeydown = handleKeyStroke(handleSetTopic);
addTopicButton.onclick = (e) => {
  e.preventDefault();
  if (topicInput.value.length) subscribe(topicInput.value);
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
});
