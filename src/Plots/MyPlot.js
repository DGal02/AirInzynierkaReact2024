import React, {useState} from 'react';
import Plot from 'react-plotly.js';

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

const MyPlot = ({y}) => {
    const [plotLayout, setPlotLayout] = useState(structuredClone(layout));
    const plotData =
        [
            {
                x: Array.from({length: y.length}, (_, index) => index / 1), // Oś X
                y,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
            }
        ];

    const handleUpdate = (figure) => {
        if (
            figure.layout.xaxis.range[0] === plotLayout.xaxis.range[0]
            && figure.layout.xaxis.range[1] === plotLayout.xaxis.range[1]
            && figure.layout.yaxis.range[0] === plotLayout.yaxis.range[0]
            && figure.layout.yaxis.range[1] === plotLayout.yaxis.range[1]
        ) {
            return;
        }

        setPlotLayout((prevState) => {
           return {
               ...prevState,
               ...figure,
           };
        });
    };

    return (
        <Plot
            data={plotData}
            layout={plotLayout}
            onUpdate={handleUpdate}
        />
    );
};

export default MyPlot;
