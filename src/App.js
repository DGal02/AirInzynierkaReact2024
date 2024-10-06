import React, {useEffect, useState, useRef} from 'react';
import MyPlot from "./Plots/MyPlot";
import './App.css';

const START_FETCHING_JSON = JSON.stringify({
    isFetching: 1
});

const STOP_FETCHING_JSON = JSON.stringify({
    isFetching: 0
});

function App() {
    const [amplitudeA, setAmplitudeA] = useState(1.0);
    const [amplitudeB, setAmplitudeB] = useState(1.0);
    const [dataA, setDataA] = useState([]);
    const [dataB, setDataB] = useState([]);
    const [fetchingInterval, setFetchingInterval] = useState(null);
    const webSocket = useRef(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            webSocket.current = socket;
        };

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            const dataA = response.dataA;
            const dataB = response.dataB;
            let fixedDataA = dataA.map(value => value / 1000);
            let fixedDataB = dataB.map(value => value / 1000);
            setDataA(prevState => [...prevState, ...fixedDataA]);
            setDataB(prevState => [...prevState, ...fixedDataB]);
        };

        // socket.onerror = (error) => {
        //     // TODO Handle error (optional)
        // };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessageChange = () => {
        if (webSocket.current) {
            const messageStruct = {
                amplitudeA: amplitudeA ? parseFloat(amplitudeA) : 1.0,
                amplitudeB: amplitudeB ? parseFloat(amplitudeB) : 1.0,
            };
            webSocket.current.send(JSON.stringify(messageStruct));
        }
    };

    const resetPlots = () => {
        setDataA([]);
        setDataB([]);
    };

    const startFetching = () => {
        if (webSocket.current) {
            setFetchingInterval(setInterval(() => {
                webSocket.current.send(START_FETCHING_JSON);
            }, 100));
        }
    };

    const stopFetching = () => {
        if (webSocket.current) {
            webSocket.current.send(STOP_FETCHING_JSON);
            clearInterval(fetchingInterval);
            setFetchingInterval(null);
        }
    };

    const downloadJsonFile = () => {
        const data = {
            dataA,
            dataB,
        };
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>WebSocket Client</h1>
                <input
                    type="number"
                    value={amplitudeA}
                    onChange={(e) => setAmplitudeA(e.target.value)}
                    placeholder="amplitude A"
                />
                <input
                    type="number"
                    value={amplitudeB}
                    onChange={(e) => setAmplitudeB(e.target.value)}
                    placeholder="amplitude B"
                />
                <button onClick={sendMessageChange}>Send Message</button>
                <button onClick={resetPlots}>Reset plots</button>
                <button onClick={downloadJsonFile}>Download data</button>
                {fetchingInterval === null && <button onClick={startFetching}>Start Fetching</button>}
                {fetchingInterval && <button onClick={stopFetching}>Stop Fetching</button>}
                <div id="plot-container">
                    <MyPlot y={dataA}/>
                    <MyPlot y={dataB}/>
                </div>
            </header>
        </div>
    );
}

export default App;
