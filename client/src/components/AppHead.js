import React from 'react';

import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';

import MenuIcon from '@material-ui/icons/Menu';


export const AppHead = () => {

    return (
            <AppBar position="static" sx={{height: '10vh'}}>
                <Toolbar sx={{backgroundColor:'brown', height: 'inherit'}}>
                    <IconButton edge="start" sx={{mr:2}} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow:1 }}>
                        Red
                    </Typography>
                    <Button color="inherit">Start A Game</Button>
                </Toolbar>
            </AppBar>
    );
}
