import React from 'react'
import Button from '@material-ui/core/Button';

const CustomButton = (props) => {

    return(
        <Button variant="outlined" color="primary" {...props}>{props.children}</Button>
    );
};

export default CustomButton;