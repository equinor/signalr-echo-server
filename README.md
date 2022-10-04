# SignalR Echo Server

SignalR dynamic echo server for testing SignalR WebSocket functionality.

This server is made to be an end 2 end test tool for testing SignalR socket functionalities in responsive clients.

## Usage

Download and run the docker image to host your own SignalR echo server

    docker pull ghcr.io/equinor/signalr-echo-server

    docker run --rm -p 5000:5000 ghcr.io/equinor/signalr-echo-server

This will host a webserver on port 5000

The backend SignalR server can host the WebSocket URL on any endpoint on the server, but defaults to `/echo`.
To set something else that fits you client under test, set the environment variable `ECHO_WS_ENDPOINT` to the desired endpoint path for your WebSocket.

Example for setting a different ws endpoint:

    docker run --rm -p 5000:5000 -e "ECHO_WS_ENDPOINT=/my-web-socket-endpoint" ghcr.io/equinor/signalr-echo-server

### Test UI

Open your web browser on `http://localhost:5000`. 
This will show a test page for trying out the server functionality

**NB**

The web console is only listening to the default endpoint `/echo`, and only receives topics on the `ReceiveMessage` topic.
This is for testing the echo server only.

### HTTP Endpoint testing

It is possible to use `Postman`, or any other HTTP tool to append data for the websocket to send out.

The echo server understands the following POST Body

````json
{
  "topic": "TopicToUseOnPayload",
  "payload": "AnyJsonStructureDynamically"
}
````

If the topic and payload is understood by the server, it will send a SignalR ws message on the configured endpoint, 
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

## Example - Testing with the debug view

1. Start the echo server with default values:
```sh 
docker run --rm -p 5000:5000 ghcr.io/equinor/signalr-echo-server
```
2. Navigate to `http://localhost:5000` in you web browser
3. Open the developer tools, and look in the `WS` part of the network tab.
4. Reconnect of needed.
5. Paste the following payload in the `Payload` box, and press `Send Message`:

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
6. Verify that you receive a message in the `WS` network stack with the correct topic (`ReceiveMessage`) and payload.
7. The resulting JSON object is printed to console in the browser for debugging

## Example - Testing with Postman

1. Start the echo server with custom values:
```sh 
docker run --rm -p 5000:5000 -e "ECHO_WS_ENDPOINT=/my-web-socket-endpoint" ghcr.io/equinor/signalr-echo-server
```
2. Start you web client, and connect to the websocket on `http://localhost:5000/my-web-socket-endpoint`
3. Start postman and `POST` a request to `http://localhost:5000/api/echo` with the body you want to receive in the client. 

    Example Body:
```json
{
    "topic": "YourExpectedTopic",
    "payload": {"ExampleItems":  [
      {"Item":  { }},
      {"Item":  { }}
    ]}
}
````
4. Send the request and watch for expected behaviour in the client
5. The `Postman` Response will contain the parsed payload for debugging
