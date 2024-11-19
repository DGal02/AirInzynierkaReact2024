import {createTheme} from "@mui/material/styles";

export const START_FETCHING_JSON = JSON.stringify({
    isFetching: 1
});

export const STOP_FETCHING_JSON = JSON.stringify({
    isFetching: 0
});

export const START_ENGINE_JSON = JSON.stringify({
    isEngineEnabled: 1
});

export const STOP_ENGINE_JSON = JSON.stringify({
    isEngineEnabled: 0
});

export const RAW = "Raw";

export const ANGLE = "Angle";

export const RAD = "Rad";

export const RAW_TO_ANGLE = "3.428374026619764e-7";

export const RAW_TO_RAD = "5.98364147543706e-9";

export const INITIAL_LAYOUT_OPTIONS = {
    paper_bgcolor: '#0F1214',
    plot_bgcolor: '#0F1214',
    xaxis: {
        title: 'Time [s]',
        color: 'white',
        gridcolor: '#444',
    },
    yaxis: {
        title: 'Position [cm]',
        color: 'white',
        gridcolor: '#444',
    },
    title: {
        text: 'Position of the rotor',
        font: {
            size: 20,
            color: 'white'
        }
    }
};

export const transformRawToAngle = (y) => {
    return y.map((sample) => {
        return (sample * RAW_TO_ANGLE);
    });
};

export const transformRawToRad = (y) => {
    return y.map((sample) => {
        return (sample * RAW_TO_RAD);
    });
};

export const transformUnitLabelToUnit = (unit) => {
    switch (unit) {
        case ANGLE:
            return "°";
        case RAD:
            return "Rad";
        case RAW:
        default:
            return "j";
    }
};

export const isNumber = (number) => {
    const numberParsed = parseFloat(number);

    return !isNaN(numberParsed) && typeof numberParsed === "number";
};

export const darkTheme = createTheme({
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