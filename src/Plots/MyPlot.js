import React, {useEffect, useMemo, useState} from 'react';
import Plot from 'react-plotly.js';
import {
    INITIAL_LAYOUT_OPTIONS,
    ANGLE,
    RAD,
    RAW,
    transformRawToAngle,
    transformRawToRad,
    transformUnitLabelToUnit,
} from '../Util/AppHelper';

const MyPlot = ({y, unit}) => {
    const [plotLayout, setPlotLayout] = useState(structuredClone(INITIAL_LAYOUT_OPTIONS));

    const yData = useMemo(() => {
        switch (unit) {
            case ANGLE:
                return transformRawToAngle(y);
            case RAD:
                return transformRawToRad(y);
            case RAW:
            default:
                return y;
        }
    }, [y.length, plotLayout.yaxis.title.text]);
    const plotData = [
            {
                // x: Array.from({length: y.length}, (_, index) => index / 1), // Oś X
                y: yData,
                type: 'scattergl',
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

    useEffect(() => {
        setPlotLayout((prevState) => {
            let yAxisData = structuredClone(prevState.yaxis);
            yAxisData.title = {
                ...yAxisData.title,
                text: `Position [${transformUnitLabelToUnit(unit)}]`,
            }

            return {
                ...prevState,
                yaxis: yAxisData,
            };
        });
    }, [unit]);

    return (
        <Plot
            data={plotData}
            layout={plotLayout}
            onUpdate={handleUpdate}
        />
    );
};

export default MyPlot;
