import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    divStyle: {
        width: "100%",
        border: "2px solid red",
        padding: "15px",
    },
    btnStyle: {
        backgroundColor: "yellow",
    },
});

function CustomCard() {
    const [btnColor, setBtnColor] = useState("error");
    const classes = useStyles();
    return (
        <div className={classes.divStyle}>
            <Typography variant="h4">This is the Title</Typography>
            <Typography variant="body1">
                Lorem ipsum dolor sit amet. Est rerum autem et similique unde et
                quia earum est ullam enim aut velit dolor sed optio animi. Et
                minima nostrum sed saepe dolores aut nihil galisum aut autem
                saepe. Sit libero quam est facere sunt eum reprehenderit
                voluptas et atque rerum est asperiores cupiditate ab iusto porro
                in doloremque vero. Non quaerat quos nam recusandae dolorem sed
                molestias officia qui officiis nostrum et maxime dolor! Ut
                voluptatem quis qui repudiandae ipsam cum ullam enim quo
                veritatis magni cum pariatur fuga aut quibusdam ratione. Non
                quis modi non sunt autem sed fugiat exercitationem non tempora
                soluta. Et nisi rerum et consequuntur maxime et illum tempora
                aut similique molestias qui facere veniam eos necessitatibus
                excepturi.
            </Typography>
            <Button
                onClick={() => setBtnColor("success")}
                variant="contained"
                size="medium"
                className={classes.btnStyle}
            >
                GO
            </Button>
        </div>
    );
}

export default CustomCard;
