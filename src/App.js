import React, {useEffect, useState, useRef} from 'react';
import MyPlot from "./Plots/MyPlot";
import {START_FETCHING_JSON, STOP_FETCHING_JSON, ANGLE, RAW, RAD} from './Util/AppHelper';
import './App.css';

function App() {
    const [amplitudeA, setAmplitudeA] = useState(1.0);
    const [amplitudeB, setAmplitudeB] = useState(1.0);
    const [dataA, setDataA] = useState([]);
    const [dataB, setDataB] = useState([]);
    const [fetchingInterval, setFetchingInterval] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(ANGLE);
    const webSocket = useRef(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            webSocket.current = socket;
        };

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            setDataA(prevState => [...prevState, ...response.dataA]);
            setDataB(prevState => [...prevState, ...response.dataB]);
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
            }, 10));
        }
    };

    const stopFetching = () => {
        if (webSocket.current) {
            webSocket.current.send(STOP_FETCHING_JSON);
            clearInterval(fetchingInterval);
            setFetchingInterval(null);
        }
    };

    const handleUnitChange = (event) => {
        setSelectedUnit(event.target.value);
    };

    const downloadJsonFile = () => {
        const data = {
            dataA,
            dataB,
        };
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], {type: 'application/json'});
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
                <div>
                    <label>
                        <input
                            type="radio"
                            name="unit"
                            value={ANGLE}
                            checked={selectedUnit === ANGLE}
                            onChange={handleUnitChange}
                        />
                        {ANGLE}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="unit"
                            value={RAD}
                            checked={selectedUnit === RAD}
                            onChange={handleUnitChange}
                        />
                        {RAD}
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="unit"
                            value={RAW}
                            checked={selectedUnit === RAW}
                            onChange={handleUnitChange}
                        />
                        {RAW}
                    </label>
                </div>
                <div id="plot-container">
                    <MyPlot y={dataA} unit={selectedUnit}/>
                    <MyPlot y={dataB} unit={selectedUnit}/>
                </div>
            </header>
        </div>
    );
}

export default App;
