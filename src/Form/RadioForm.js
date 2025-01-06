import React, {useMemo} from 'react';
import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

const RadioForm = ({description, value, handler, options, name}) => {
    const radioOptions = useMemo(() => {
        return options.map((option) => {
            return <FormControlLabel
                value={option.value}
                control={<Radio/>}
                label={option.label}
                key={option.label}
            />;
        });
    }, [options]);

    return <Box display="flex"
                flexDirection="row"
                gap={2}
                alignItems="stretch"
                flexWrap="wrap"
                justifyContent="center"
                marginTop={3}>
        <FormControl component="fieldset">
            <FormLabel
                component="legend"
                sx={{
                    color: '#90CAF9',
                }}
            >
                {description}
            </FormLabel>
            <RadioGroup
                aria-label={name}
                name={name}
                value={value}
                onChange={handler}
                row
            >
                {radioOptions}
            </RadioGroup>
        </FormControl>
    </Box>
};

export default RadioForm;
