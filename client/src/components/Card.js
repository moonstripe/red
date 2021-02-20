import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';


const useStyles = makeStyles({
    root: {
        height: "calc(100vh/3)"
    },
    media: {
        height: '100%',
        paddingTop: '10px',
        paddingLeft: '10px',
        backgroundPosition: "top",
        backgroundSize: 'contain',
    },
});

export const PlayingCard = (props) => {


    // console.log(props.suit, props.num, props.image)

    const classes = useStyles();

    return (

        <Card className={classes.root}>

            <CardMedia
                className={classes.media}
                image={props.image}
                title='Card'
            />
        </Card>
    );
}
