import React, {useEffect, useState, useRef} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {
    Button,
    Box,
} from '@mui/material';
import MyPlot from "./Plots/MyPlot";
import {
    START_FETCHING_JSON,
    STOP_FETCHING_JSON,
    START_ENGINE_JSON,
    STOP_ENGINE_JSON,
    POINT_VALUE,
    GET_MODE_JSON,
    ANGLE,
    darkTheme,
    transformPositionToRaw
} from './Util/AppHelper';
import './App.css';
import RadioForm from "./Form/RadioForm";
import {MODE_OPTIONS, UNIT_OPTIONS} from "./Util/FormHelper";
import PointInput from "./Form/PointInput";

function App() {
    const [dataA, setDataA] = useState([]);
    const [dataB, setDataB] = useState([]);
    const [dataErrorA, setDataErrorA] = useState([]);
    const [dataErrorB, setDataErrorB] = useState([]);
    const [fetchingInterval, setFetchingInterval] = useState(null);
    const [isEngineEnabled, setIsEngineEnabled] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(ANGLE);
    const [selectedMode, setSelectedMode] = useState(POINT_VALUE);
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
            setDataErrorA(prevState => [...prevState, ...response.dataErrorA]);
            setDataErrorB(prevState => [...prevState, ...response.dataErrorB]);
        };

        // socket.onerror = (error) => {
        //     // TODO Handle error (optional)
        // };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessagePosition = (positionA, positionB) => {
        if (webSocket.current) {
            const messageStruct = {
                positionA: transformPositionToRaw(selectedUnit, positionA),
                positionB: transformPositionToRaw(selectedUnit, positionB),
            };
            webSocket.current.send(JSON.stringify(messageStruct));
        }
    };

    const resetPlots = () => {
        setDataA([]);
        setDataB([]);
        setDataErrorA([]);
        setDataErrorB([]);
    };

    const startFetching = () => {
        if (webSocket.current) {
            setFetchingInterval(setInterval(() => {
                webSocket.current.send(START_FETCHING_JSON);
            }, 200));
        }
    };

    const stopFetching = () => {
        if (webSocket.current) {
            webSocket.current.send(STOP_FETCHING_JSON);
            clearInterval(fetchingInterval);
            setFetchingInterval(null);
        }
    };

    const startEngine = () => {
        if (webSocket.current) {
            webSocket.current.send(START_ENGINE_JSON);
            setIsEngineEnabled(true);
        }
    };

    const stopEngine = () => {
        if (webSocket.current) {
            webSocket.current.send(STOP_ENGINE_JSON);
            setIsEngineEnabled(false);
        }
    };

    const handleUnitChange = (event) => {
        setSelectedUnit(event.target.value);
    };

    const handleModeChange = (event) => {
        const value = parseInt(event.target.value);
        setSelectedMode(value);
        if (webSocket.current) {
            webSocket.current.send(GET_MODE_JSON(value));
        }
    };

    const downloadJsonFile = () => {
        const data = {
            dataA,
            dataB,
            dataErrorA,
            dataErrorB,
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
                <ThemeProvider theme={darkTheme}>
                    <RadioForm
                        name="unit"
                        description="Select Unit"
                        value={selectedUnit}
                        handler={handleUnitChange}
                        options={UNIT_OPTIONS}
                    />
                    <RadioForm
                        name="mode"
                        description="Select mode"
                        value={selectedMode}
                        handler={handleModeChange}
                        options={MODE_OPTIONS}
                    />
                    {selectedMode === POINT_VALUE &&
                        <PointInput sendMessagePosition={sendMessagePosition}/>
                    }
                    <Box marginTop={2} display="flex" justifyContent="space-between" gap={1}>
                        <Button
                            size="medium"
                            variant="outlined"
                            onClick={resetPlots}
                        >
                            Reset plots
                        </Button>
                        <Button
                            size="medium"
                            variant="outlined"
                            onClick={downloadJsonFile}
                        >
                            Download data
                        </Button>

                        <Button
                            size="small"
                            variant="outlined"
                            color={!fetchingInterval ? "primary" : "success"}
                            onClick={fetchingInterval === null ? startFetching : stopFetching}
                        >
                            {fetchingInterval === null ? "Start Fetching" : "Stop Fetching"}
                        </Button>
                        <Button
                            size="medium"
                            variant="outlined"
                            color={!isEngineEnabled ? "primary" : "success"}
                            onClick={!isEngineEnabled ? startEngine : stopEngine}
                        >
                            {!isEngineEnabled ? "Start engine" : "Stop engine"}
                        </Button>
                    </Box>
                </ThemeProvider>
                <div>
                    <div className="plot-container">
                        <MyPlot y={dataA} unit={selectedUnit}/>
                        <MyPlot y={dataErrorA} unit={selectedUnit}/>
                    </div>
                    <div className="plot-container">
                        <MyPlot y={dataB} unit={selectedUnit}/>
                        <MyPlot y={dataErrorB} unit={selectedUnit}/>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
