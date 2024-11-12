const WebSocket = require('ws');
const net = require('net');

const wss = new WebSocket.Server({port: 8080});
const STM32_HOST = '192.168.1.10';
const STM32_PORT = 5002;

const DEBUG = 'debug';
const NONE = 'none';
const logLevel = DEBUG;

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    const client = new net.Socket();
    client.connect(STM32_PORT, STM32_HOST, () => {
        console.log('Connected to STM32 server');
    });

    ws.on('message', (message) => {
        if (logLevel === DEBUG) {
            console.log('Received from browser:', message);
        }
        client.write(message);
    });

    client.on('data', (data) => {
        if (logLevel === DEBUG) {
            console.log('Received from STM32:', data.toString());
        }
        ws.send(data.toString());
    });

    client.on('close', () => {
        console.log('Connection to STM32 server closed');
    });

    client.on('error', (err) => {
        console.error('Error with STM32 server:', err);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        client.destroy();
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        client.destroy();
    });
});

console.log('WebSocket server running on ws://localhost:8080');
