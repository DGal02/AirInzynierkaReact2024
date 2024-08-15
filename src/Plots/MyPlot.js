import React from 'react';
import Plot from 'react-plotly.js';

const MyPlot = ({y}) => {
    const plotData =
        [
            {
                x: Array.from({length: y.length}, (_, index) => index + 1), // Oś X
                y,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
            }
        ];

    const layout = {
        paper_bgcolor: '#282c34',
        plot_bgcolor: '#282c34',
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

    return (
        <Plot
            data={plotData}
            layout={layout}
        />
    );
};

export default MyPlot;
