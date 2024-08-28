import React, { useEffect, useState, useRef } from 'react';
import MyPlot from "./Plots/MyPlot";
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [dataA, setDataA] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            ws.current = socket;
        };

        socket.onmessage = (event) => {
            console.log('Received from server:', event.data);
            setDataA(prevState => [...prevState, ...JSON.parse(event.data)]);
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
        if (ws.current) {
            const messageStruct = {
                power: 10
            };
            ws.current.send(JSON.stringify(messageStruct));
        }
    };

    useEffect(() => {
        const intervalId = setInterval(sendMessage, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

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
                <MyPlot y={dataA}/>
            </header>
        </div>
    );
}

export default App;
