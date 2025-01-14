import React, {useMemo} from 'react';
import {Box, Button, Stack, TextField} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {isNumber} from "../Util/AppHelper";

const PointInput = ({sendMessagePosition, positionX, positionY, handlePositionXChange, handlePositionYChange}) => {
    const isPositionXValid = useMemo(() => {
        return !isNumber(positionX);
    }, [positionX]);

    const isPositionYValid = useMemo(() => {
        return !isNumber(positionY);
    }, [positionY]);

    return <div>
        <Stack marginTop={1} direction="row" spacing={2}>
            <TextField
                error={isPositionXValid}
                value={positionX}
                onChange={handlePositionXChange}
                label="Position X"
                variant="outlined"
                size="small"
                slotProps={{
                    input: {
                        autoComplete: 'off',
                    },
                }}
            />
            <TextField
                error={isPositionYValid}
                value={positionY}
                onChange={handlePositionYChange}
                label="Position Y"
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
            <Button disabled={isPositionXValid || isPositionYValid} size="medium" variant="outlined"
                    onClick={() => {
                        sendMessagePosition(positionX, positionY);
                    }} endIcon={<SendIcon/>}>
                Send message
            </Button>
        </Box>
    </div>;
};

export default PointInput;
