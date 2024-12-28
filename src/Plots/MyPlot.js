import React, {useEffect, useMemo, useState} from 'react';
import Plot from 'react-plotly.js';
import {
    ANGLE,
    RAD,
    RAW,
    timeStep,
    transformRawToAngle,
    transformRawToRad,
    transformUnitLabelToUnit,
} from '../Util/AppHelper';

const MyPlot = ({y, unit, initialPlotLayout}) => {
    const [plotLayout, setPlotLayout] = useState(structuredClone(initialPlotLayout));
    const [xData, setXData] = useState([]);

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
                x: xData,
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

    useEffect(() => {
        const newXData = [...xData];
        const startIndex = xData.length;
        for (let i = startIndex; i < y.length; i++) {
            newXData.push(i * timeStep);
        }

        setXData(newXData);
    }, [y.length]);

    return (
        <Plot
            data={plotData}
            layout={plotLayout}
            onUpdate={handleUpdate}
        />
    );
};

export default MyPlot;
