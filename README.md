# SignalR Echo Server

SignalR dynamic echo server for testing SignalR WebSocket functionality.

This server is made to be a test tool for testing SignalR socket functionalities in responsive clients.

## Usage

Download and run the docker image to host your own SignalR echo server

    docker pull ghcr.io/equinor/signalr-echo-server

    docker run --rm -p 5000:5000 ghcr.io/equinor/signalr-echo-server

This will host a webserver on port `5000`

The backend SignalR server can host the WebSocket URL on any endpoint, but defaults to `/echo`.

### Test SignalR Reactive Clients

By connecting your SignalR application to the WebSocket endpoint (default `/echo`),
you can test functionality by sending custom topics and payloads to the echo server, either by using the hosted web client,
or by using Postman, or any other HTTP Tool.

This will then be published on SignalR with the desired data.

**NB**

Dynamic input body functionality (bring your own JSON), in combination with limitations in controlling the SignalR Serializer,
means the payload of the WebSocket message is returned as a string.

If your client code treats the SignalR payload as a `json` document directly, the payload must be parsed to support testing:
```javascript
JSON.parse(payload)
```

Adding this step will increase the input validation of your client, and should not affect your production functionality.

### Using A Custom WebSocket Endpoint

To set something else that fits your client under test, set the environment variable `ECHO_WS_ENDPOINT` to the desired endpoint path for your WebSocket.

Example for setting a different ws endpoint:

```sh
docker run --rm -p 5000:5000 -e "ECHO_WS_ENDPOINT=/my-web-socket-endpoint" \
ghcr.io/equinor/signalr-echo-server
```

**NB**

Changing the default endpoint means that the Web UI hosted will not work.

### Test UI

Open your web browser on `http://localhost:5000`. 
This will show a test page for sending and receiving SignalR messages over WebSocket.

#### Add Topics

Topics can be subscribed to in the client by using the `Add` button. This will append the topic to the `Active subscriptions` list.
To remove an active subscription, just click on the item.

#### Send Payloads

When sending a `Topic` and a `Payload` from the client, that topic gets automatically added to the list of `Active subscriptions`, 
if it is not already part of the list.
The resulting SignalR message should return and display in the client.

#### Receive Messages

All messages posted on topics that the client currently subscribes to, will be displayed in the `Payload from WebSocket` section on the client.
The received message `Topic` will also show above the payload.

You can now subscribe to different topics in the client, post messages to the `/api/echo` endpoint,
and see these messages show up in the web client when received on the SignalR subscription.

**NB**

When running the backend on a different endpoint the web console will not receive or display these messages.

### HTTP Endpoint testing

It is possible to use `Postman`, or any other HTTP tool to append data for the SignalR server to send out.

The echo server understands the following POST Body

````json
{
  "topic": "TopicToUseOnPayload",
  "payload": "AnyJsonStructureDynamically"
}
````

If the topic and payload is received and parsed successfully, it will send a SignalR ws message on the configured endpoint, 
with the `topic` field as a topic, and the `payload` field as the body.

Below is an example of a HTTP Request syntax.

````http request
POST http://localhost:5000/api/echo HTTP/1.1
content-type: application/json

{
    "topic": "ReceiveMessage",
    "payload": {
        "ArrayOfThings": [
            {
                "MyThingToTest": {
                    "id": "e46159b3-3304-4a4a-b161-cf3c9a82ec2a",
                    "version": 1,
                    "from": "2022-10-03T00:00:00+00:00",
                    "to": "2022-10-04T00:00:00+00:00",
                    "lastUpdated": "2022-10-03T07:48:24.335+00:00"
                },
                "someNumber": 84708
            }
        ],
        "SomeOtherArrayOfThins": []
    }
}
````

## Example - Testing with the hosted web client

1. Start the echo server with default values:
```sh 
docker run --rm -p 5000:5000 ghcr.io/equinor/signalr-echo-server
```
2. Navigate to `http://localhost:5000` in you web browser
3. (Optional) Open the developer tools, and look in the `WS` part of the network tab.
4. (Optional) Reconnect if needed.
5. Paste the following payload in the `Payload` box, and press `Send`:

```json
{
    "ArrayOfThings": [
        {
            "MyThingToTest": {
                "id": "e46159b3-3304-4a4a-b161-cf3c9a82ec2a",
                "version": 1,
                "from": "2022-10-03T00:00:00+00:00",
                "to": "2022-10-04T00:00:00+00:00",
                "lastUpdated": "2022-10-03T07:48:24.335+00:00"
            },
            "someNumber": 84708
        }
    ],
    "SomeOtherArrayOfThins": []
}
```
6. The resulting WebSocket JSON object payload received should now be displayed in the web client

## Example - Testing with Postman

1. Start the echo server with default values:
```sh 
docker run --rm -p 5000:5000 ghcr.io/equinor/signalr-echo-server
```
2. Navigate to `http://localhost:5000` in you web browser
3. Add topics in the web client using the `Add` button. This example uses the `YourExpectedTopic` topic
3. Start postman and `POST` a request to `http://localhost:5000/api/echo` with the body you want to receive in the client. 

   Example Body:
```json
{
    "topic": "YourExpectedTopic",
    "payload": {"ExampleItems":  [
      {"Item":  {
         "Name": "Some Name"
      }},
      {"Item":  {
         "Name": "Some Other Name"
      }}
    ]}
}
````
4. Send the request and see the resulting SignalR message show up in the web client
5. The `Postman` Response will also contain the parsed payload for debugging
