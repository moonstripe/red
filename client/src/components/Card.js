import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card, CardMedia } from '@mui/material';

export const PlayingCard = ({ anomalous, image, onClick, selected }) => {
    const variants = {
        start: {
            y: [0, -10, 0],
            opacity: [1, 0, 1],
            transition: { duration: 1 },
        },
        stop: { y: 0, opacity: 1 }
    };
    const controls = useAnimation()

    // animation
    useEffect(() => {

        anomalous ? controls.start('start') : controls.start('stop')

    }, [controls, anomalous])
    return (
        anomalous ?
            <Card
                component={motion.div}
                elevation={0}
                initial={false}
                variants={variants}
                animate={controls}
                whileHover={{
                    scale: 1.2,
                    transition: { duration: 0.3 }
                }}
                sx={selected ? {
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
            </Card> : <Card
                component={motion.div}
                elevation={0}
                initial={false}
                variants={variants}
                whileHover={{
                    scale: 1.2,
                    transition: { duration: 0.3 }
                }}
                sx={selected ? {
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
