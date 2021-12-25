import React from 'react';

import { AppBar, Toolbar } from '@mui/material';

export const AppHead = () => {

    return (
            <AppBar position="static" sx={{height: '10vh', boxShadow: 'none'}}>
                <Toolbar sx={{backgroundColor:'brown',boxShadow: 'none', height: 'inherit'}}>
                    {/* <IconButton edge="start" sx={{mr:2}} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow:1 }}>
                        Red
                    </Typography>
                    <Button color="inherit">Start A Game</Button> */}
                </Toolbar>
            </AppBar>
    );
}
