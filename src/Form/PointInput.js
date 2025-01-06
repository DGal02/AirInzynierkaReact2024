import React, {useMemo, useState} from 'react';
import {Box, Button, Stack, TextField} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {isNumber} from "../Util/AppHelper";

const PointInput = ({sendMessagePosition}) => {
    const [positionA, setPositionA] = useState('');
    const [positionB, setPositionB] = useState('');

    const handlePositionAChange = (e) => {
        setPositionA(e.target.value);
    };

    const handlePositionBChange = (e) => {
        setPositionB(e.target.value);
    };

    const isPositionAValid = useMemo(() => {
        return !isNumber(positionA);
    }, [positionA]);

    const isPositionBValid = useMemo(() => {
        return !isNumber(positionB);
    }, [positionB]);

    return <div>
        <Stack marginTop={1} direction="row" spacing={2}>
            <TextField
                error={isPositionAValid}
                value={positionA}
                onChange={handlePositionAChange}
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
                onChange={handlePositionBChange}
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
                    onClick={() => {
                        sendMessagePosition(positionA, positionB);
                    }} endIcon={<SendIcon/>}>
                Send message
            </Button>
        </Box>
    </div>;
};

export default PointInput;
