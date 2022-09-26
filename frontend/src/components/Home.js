import React from "react";

// MUI IMports
import { Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

// Components


// Assests
import city from "./Assets/city.jpg";

const useStyles = makeStyles({
    cityImg: {
        width: "100%",
        height: "92vh",
    },

    overlayText: {
        position: "absolute",
        zIndex: "100",
        top: "200px",
        left: "20px",
        textAlign: "center",
    },

    homeText: {
        color: "white",
        fontWeight: "bolder",
    },

    homeBTN: {
        fontSize: "3.5rem",
        borderRadius: "15px",
        backgroundColor: "green",
        marginTop: "2rem",
        boxShadow: "3px 3px 3px white",
    },
});

function Home() {
    const classes = useStyles();
    return (
        <>
            <div style={{ postion: "relative" }}>
                <img src={city} className={classes.cityImg} alt="Homepage"/>
                <div className={classes.overlayText}>
                    <Typography variant="h1" className={classes.homeText}>
                        FIND YOUR{" "}
                        <span style={{ color: "green" }}>NEXT PROPERTY</span> ON
                        THE LBREP WEBSITE
                    </Typography>
                    <Button variant="contained" className={classes.homeBTN}>
                        SEE ALL PROPERTIES
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Home;
