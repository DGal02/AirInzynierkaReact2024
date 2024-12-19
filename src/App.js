import React, {useEffect, useState, useRef} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField, Box, Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MyPlot from "./Plots/MyPlot";
import {
    START_FETCHING_JSON,
    STOP_FETCHING_JSON,
    START_ENGINE_JSON,
    STOP_ENGINE_JSON,
    POINT_LABEL,
    POINT_VALUE,
    SIN_LABEL,
    SIN_VALUE,
    SQUARE_LABEL,
    SQUARE_VALUE,
    GET_MODE_JSON,
    ANGLE,
    RAW,
    RAD,
    isNumber,
    darkTheme,
    transformPositionToRaw
} from './Util/AppHelper';
import './App.css';

function App() {
    const [positionA, setPositionA] = useState('');
    const [positionB, setPositionB] = useState('');
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
            try {
                const response = JSON.parse(event.data);
                setDataA(prevState => [...prevState, ...response.dataA]);
                setDataB(prevState => [...prevState, ...response.dataB]);
                setDataErrorA(prevState => [...prevState, ...response.dataErrorA]);
                setDataErrorB(prevState => [...prevState, ...response.dataErrorB]);
            } catch (e) {
                console.log(event.data);
            }
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
                positionA: transformPositionToRaw(selectedUnit, positionA),
                positionB: positionB ? parseFloat(positionB) : 1.0,
            };
            webSocket.current.send(JSON.stringify(messageStruct));
        }
    };

    const resetPlots = () => {
        setDataA([]);
        setDataB([]);
        setDataErrorA([]);
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

    const isPositionAValid = !isNumber(positionA);
    const isPositionBValid = !isNumber(positionB);

    return (
        <div className="App">
            <header className="App-header">
                <ThemeProvider theme={darkTheme}>
                    <Box marginTop={3}>
                        <FormControl component="fieldset">
                            <FormLabel
                                component="legend"
                                sx={{
                                    color: '#90CAF9',
                                }}
                            >
                                Select Unit
                            </FormLabel>
                            <RadioGroup
                                aria-label="unit"
                                name="unit"
                                value={selectedUnit}
                                onChange={handleUnitChange}
                                row
                            >
                                <FormControlLabel
                                    value={ANGLE}
                                    control={<Radio/>}
                                    label={ANGLE}
                                />
                                <FormControlLabel
                                    value={RAD}
                                    control={<Radio/>}
                                    label={RAD}
                                />
                                <FormControlLabel
                                    value={RAW}
                                    control={<Radio/>}
                                    label={RAW}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    <Box marginTop={3}>
                        <FormControl component="fieldset">
                            <FormLabel
                                component="legend"
                                sx={{
                                    color: '#90CAF9',
                                }}
                            >
                                Select mode
                            </FormLabel>
                            <RadioGroup
                                aria-label="unit"
                                name="unit"
                                value={selectedMode}
                                onChange={handleModeChange}
                                row
                            >
                                <FormControlLabel
                                    value={POINT_VALUE}
                                    control={<Radio/>}
                                    label={POINT_LABEL}
                                />
                                <FormControlLabel
                                    value={SIN_VALUE}
                                    control={<Radio/>}
                                    label={SIN_LABEL}
                                />
                                <FormControlLabel
                                    value={SQUARE_VALUE}
                                    control={<Radio/>}
                                    label={SQUARE_LABEL}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    {selectedMode === POINT_VALUE &&
                        <div>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    error={isPositionAValid}
                                    value={positionA}
                                    onChange={(e) => setPositionA(e.target.value)}
                                    label="Position A"
                                    variant="outlined"
                                    size="small"
                                    slotProps={{
                                        input: {
                                            autoComplete: 'off',
                                        },
                                    }}
                                />
                                <TextField
                                    error={isPositionBValid}
                                    value={positionB}
                                    onChange={(e) => setPositionB(e.target.value)}
                                    label="Position B"
                                    variant="outlined"
                                    size="small"
                                    slotProps={{
                                        input: {
                                            autoComplete: 'off',
                                        },
                                    }}
                                />
                            </Stack>
                            <Box marginTop={1}>
                                <Button disabled={isPositionAValid || isPositionBValid} size="medium" variant="outlined"
                                        onClick={sendMessageChange} endIcon={<SendIcon/>}>
                                    Send message
                                </Button>
                            </Box>
                        </div>}
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
