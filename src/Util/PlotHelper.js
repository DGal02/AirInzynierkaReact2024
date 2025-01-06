const INITIAL_LAYOUT_OPTIONS = {
    paper_bgcolor: '#0F1214',
    plot_bgcolor: '#0F1214',
    xaxis: {
        title: 'Time [s]',
        color: 'white',
        gridcolor: '#444',
    },
    yaxis: {
        title: 'Position [°]',
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

const INITIAL_LAYOUT_OPTIONS_ROTOR_X = structuredClone(INITIAL_LAYOUT_OPTIONS);
INITIAL_LAYOUT_OPTIONS_ROTOR_X.title.text = 'Position of the rotor in X axis';

const INITIAL_LAYOUT_OPTIONS_ROTOR_Y = structuredClone(INITIAL_LAYOUT_OPTIONS);
INITIAL_LAYOUT_OPTIONS_ROTOR_Y.title.text = 'Position of the rotor in Y axis';

const INITIAL_LAYOUT_OPTIONS_ROTOR_X_ERROR = structuredClone(INITIAL_LAYOUT_OPTIONS);
INITIAL_LAYOUT_OPTIONS_ROTOR_X_ERROR.title.text = 'Error of the rotor in X axis';

const INITIAL_LAYOUT_OPTIONS_ROTOR_Y_ERROR = structuredClone(INITIAL_LAYOUT_OPTIONS);
INITIAL_LAYOUT_OPTIONS_ROTOR_Y_ERROR.title.text = 'Error of the rotor in Y axis';

export {
    INITIAL_LAYOUT_OPTIONS_ROTOR_X,
    INITIAL_LAYOUT_OPTIONS_ROTOR_Y,
    INITIAL_LAYOUT_OPTIONS_ROTOR_X_ERROR,
    INITIAL_LAYOUT_OPTIONS_ROTOR_Y_ERROR,
}
