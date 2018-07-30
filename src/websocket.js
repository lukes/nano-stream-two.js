import ReconnectingWebSocket from 'reconnectingwebsocket';

const socket = new ReconnectingWebSocket('ws://128.199.228.52:8080', 'protocolOne');
socket.onopen = () => {
  console.log('Connected');
};

export default socket;
