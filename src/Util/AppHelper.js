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

export const POINT_LABEL = 'Point';

export const POINT_VALUE = 0;

export const SIN_LABEL = 'Sinus';

export const SIN_VALUE = 1;

export const SQUARE_LABEL = 'Square';

export const SQUARE_VALUE = 2;

export const RAW_TO_ANGLE = "3.428374026619764e-7";

export const RAW_TO_RAD = "5.98364147543706e-9";

export const sampleRate = 1000;

export const timeStep = 1 / sampleRate;

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

export const transformPositionToRaw = (unit, position) => {
    switch (unit) {
        case ANGLE:
            return parseInt(parseFloat(position) / RAW_TO_ANGLE);
        case RAD:
            return parseInt(parseFloat(position) / RAW_TO_RAD);
        case RAW:
        default:
            return parseInt(position);
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

export const GET_MODE_JSON = (value) => {
    return JSON.stringify({
        mode: value
    });
}
