import React, {useEffect, useState} from 'react';
import MyPlot from "./Plots/MyPlot";
import './App.css';

function App() {
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            setWs(socket);
        };

        socket.onmessage = (event) => {
            console.log('Received from server:', event.data);
            setResponse(event.data);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws) {
            const messageStruct = {
                power: parseInt(message)
            };
            console.log('Sending message:', JSON.stringify(messageStruct));
            ws.send(JSON.stringify(messageStruct));
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>WebSocket Client</h1>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
                <button onClick={sendMessage}>Send Message</button>
                {response && <MyPlot y={JSON.parse(response)}/>}
            </header>
        </div>
    );
}

export default App;
