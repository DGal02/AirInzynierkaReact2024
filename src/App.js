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
import {
    INITIAL_LAYOUT_OPTIONS_ROTOR_X,
    INITIAL_LAYOUT_OPTIONS_ROTOR_X_ERROR,
    INITIAL_LAYOUT_OPTIONS_ROTOR_Y, INITIAL_LAYOUT_OPTIONS_ROTOR_Y_ERROR
} from "./Util/PlotHelper";

function App() {
    const [dataX, setDataX] = useState([]);
    const [dataY, setDataY] = useState([]);
    const [dataErrorX, setDataErrorX] = useState([]);
    const [dataErrorY, setDataErrorY] = useState([]);
    const [positionX, setPositionX] = useState('');
    const [positionY, setPositionY] = useState('');
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
            setDataX(prevState => [...prevState, ...response.dataX]);
            setDataY(prevState => [...prevState, ...response.dataY]);
            setDataErrorX(prevState => [...prevState, ...response.dataErrorX]);
            setDataErrorY(prevState => [...prevState, ...response.dataErrorY]);
        };

        // socket.onerror = (error) => {
        //     // TODO Handle error (optional)
        // };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessagePosition = (positionX, positionY) => {
        if (webSocket.current) {
            const messageStruct = {
                positionX: transformPositionToRaw(selectedUnit, positionX),
                positionY: transformPositionToRaw(selectedUnit, positionY),
            };
            webSocket.current.send(JSON.stringify(messageStruct));
        }
    };

    const resetPlots = () => {
        setDataX([]);
        setDataY([]);
        setDataErrorX([]);
        setDataErrorY([]);
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

    const handlePositionXChange = (e) => {
        setPositionX(e.target.value);
    };

    const handlePositionYChange = (e) => {
        setPositionY(e.target.value);
    };

    const downloadJsonFile = () => {
        const data = {
            dataX,
            dataY,
            dataErrorX,
            dataErrorY,
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
                        <PointInput positionX={positionX} positionY={positionY}
                                    handlePositionXChange={handlePositionXChange}
                                    handlePositionYChange={handlePositionYChange}
                                    sendMessagePosition={sendMessagePosition}/>
                    }
                    <Box display="flex"
                         flexDirection="row"
                         gap={2}
                         alignItems="stretch"
                         flexWrap="wrap"
                         justifyContent="center"
                         marginTop={2}>
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
                        <MyPlot y={dataX} unit={selectedUnit} initialPlotLayout={INITIAL_LAYOUT_OPTIONS_ROTOR_X}/>
                        <MyPlot y={dataErrorX} unit={selectedUnit}
                                initialPlotLayout={INITIAL_LAYOUT_OPTIONS_ROTOR_X_ERROR}/>
                    </div>
                    <div className="plot-container">
                        <MyPlot y={dataY} unit={selectedUnit} initialPlotLayout={INITIAL_LAYOUT_OPTIONS_ROTOR_Y}/>
                        <MyPlot y={dataErrorY} unit={selectedUnit}
                                initialPlotLayout={INITIAL_LAYOUT_OPTIONS_ROTOR_Y_ERROR}/>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
