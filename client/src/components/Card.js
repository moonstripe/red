import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';


const useStyles = makeStyles({
    root: {
        height: "calc(100vh/4)",
        backgroundColor: 'transparent'
    },
    media: {
        height: '100%',
        width: 'inherit',
        backgroundSize: 'contain',
        backgroundColor: 'transparent'
    },
});

export const PlayingCard = (props) => {


    // console.log(props.suit, props.num, props.image)

    const classes = useStyles();

    return (

        <Card elevation={0} className={classes.root}>

            <img
                className={classes.media}
                src={props.image}
                onClick={props.onClick}
                alt={props.image}
            />
        </Card>
    );
}
