import React from 'react';
import { Card, CardMedia } from '@mui/material';

export const PlayingCard = ({image, onClick, selected}) => {

    return (

        <Card elevation={0} sx={ selected ? {
            maxHeight: '100%',
            backgroundColor: 'transparent',
            alignItems: 'center',
            borderRadius: '3px',
            borderStyle: 'solid',
            borderColor: 'black'
        } : {
            maxHeight: '100%',
            backgroundColor: 'transparent',
            alignItems: 'center'
        }}>
            {
                image ? <CardMedia
                    component='img'
                    // rachet
                    sx={{ width: '100%' }}
                    src={image}
                    onClick={onClick}
                    alt={'nvm'}
                /> : <div sx={{
                    backgroundColor: 'transparent',
                }}></div>
            }
        </Card>
    );
}
