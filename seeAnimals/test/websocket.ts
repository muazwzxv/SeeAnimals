import { w3cwebsocket as W3CWebSocket } from "websocket";

var client = new W3CWebSocket("ws://localhost:8080/ws/3");

client.onopen = () => console.log("Connected");
client.onerror = (err) => console.log("Error ", err.message);
