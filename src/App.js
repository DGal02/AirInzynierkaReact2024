import React, {useEffect, useState, useRef} from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, CssBaseline} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MyPlot from "./Plots/MyPlot";
import {START_FETCHING_JSON, STOP_FETCHING_JSON, ANGLE, RAW, RAD} from './Util/AppHelper';
import './App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
    },
    typography: {
        button: {
            textTransform: 'none',
        },
    },
});

function App() {
    const [amplitudeA, setAmplitudeA] = useState(undefined);
    const [amplitudeB, setAmplitudeB] = useState(undefined);
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
                <h1>App interface</h1>
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
                <ThemeProvider theme={darkTheme}>
                    <div>
                        <Button size="small" variant="outlined" onClick={sendMessageChange} endIcon={<SendIcon/>}>
                            Send message
                        </Button>
                    </div>
                </ThemeProvider>
                <ThemeProvider theme={darkTheme}>
                    <div className="button-container">
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={resetPlots}
                        >
                            Reset plots
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={downloadJsonFile}
                        >
                            Download data
                        </Button>
                    </div>
                </ThemeProvider>
                <ThemeProvider theme={darkTheme}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={fetchingInterval === null ? startFetching : stopFetching}
                        >
                            {fetchingInterval === null ? "Start Fetching" : "Stop Fetching"}
                        </Button>
                    </div>
                </ThemeProvider>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline/>
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
