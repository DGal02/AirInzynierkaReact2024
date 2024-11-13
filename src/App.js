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
import {START_FETCHING_JSON, STOP_FETCHING_JSON, ANGLE, RAW, RAD, isNumber, darkTheme} from './Util/AppHelper';
import './App.css';

function App() {
    const [positionA, setPositionA] = useState(undefined);
    const [positionB, setPositionB] = useState(undefined);
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
                amplitudeA: positionA ? parseFloat(positionA) : 1.0,
                amplitudeB: positionB ? parseFloat(positionB) : 1.0,
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

    const isPositionAValid = !isNumber(positionA);
    const isPositionBValid = !isNumber(positionB);

    return (
        <div className="App">
            <header className="App-header">
                <ThemeProvider theme={darkTheme}>
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
                </ThemeProvider>
                <ThemeProvider theme={darkTheme}>
                    <Box marginTop={1}>
                        <Button disabled={isPositionAValid || isPositionBValid} size="medium" variant="outlined"
                                onClick={sendMessageChange} endIcon={<SendIcon/>}>
                            Send message
                        </Button>
                    </Box>
                </ThemeProvider>
                <ThemeProvider theme={darkTheme}>
                    <Box marginTop={1} display="flex" justifyContent="space-between" gap={1}>
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
                            onClick={fetchingInterval === null ? startFetching : stopFetching}
                        >
                            {fetchingInterval === null ? "Start Fetching" : "Stop Fetching"}
                        </Button>
                        <Button
                            size="medium"
                            variant="outlined"
                            onClick={fetchingInterval === null ? startFetching : stopFetching}
                        >
                            {fetchingInterval === null ? "Start engine" : "Stop engine"}
                        </Button>
                    </Box>
                </ThemeProvider>
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
                </ThemeProvider>
                <div id="plot-container">
                    <MyPlot y={dataA} unit={selectedUnit}/>
                    <MyPlot y={dataB} unit={selectedUnit}/>
                </div>
            </header>
        </div>
    );
}

export default App;
