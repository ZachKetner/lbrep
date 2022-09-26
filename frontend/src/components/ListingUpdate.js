import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useImmerReducer } from "use-immer";

// MUI imports
import {
    Grid,
    FormControlLabel,
    Typography,
    Button,
    Checkbox,
    MenuItem,
    CardMedia,
    CardContent,
    CircularProgress,
    TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

// Context
import StateContext from "../contexts/StateContext";

const useStyles = makeStyles({
    formContainer: {
        width: "75%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border: "5px solid black",
        padding: "3rem",
    },
    registerBtn: {
        backgroundColor: "green",
        color: "white",
        fontSize: "1.1rem",
        marginLeft: "1rem",
        "&:hover": {
            backgroundColor: "blue",
        },
    },
    pictureBtn: {
        backgroundColor: "blue",
        color: "white",
        fontSize: "0.8rem",
        border: "1px solid black",
        marginLeft: "1rem",
    },
});

// Textfield choice options

const listingTypeOptions = [
    {
        value: "",
        label: "",
    },
    {
        value: "House",
        label: "House",
    },
    {
        value: "Apartment",
        label: "Apartment",
    },
    {
        value: "Office",
        label: "Office",
    },
];

const propertyStatusOptions = [
    {
        value: "",
        label: "",
    },
    {
        value: "Sale",
        label: "Sale",
    },
    {
        value: "Rent",
        label: "Rent",
    },
];

const rentalFrequencyOptions = [
    {
        value: "",
        label: "",
    },
    {
        value: "Month",
        label: "Month",
    },
    {
        value: "Week",
        label: "Week",
    },
    {
        value: "Day",
        label: "Day",
    },
];

function ListingUpdate(props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    const initialState = {
        titleValue: props.listingData.title,
        listingTypeValue: props.listingData.listing_type,
        descriptionValue: props.listingData.description,
        propertyStatusValue: props.listingData.property_status,
        priceValue: props.listingData.price,
        rentalFrequencyValue: props.listingData.rental_frequency,
        roomsValue: props.listingData.rooms,
        furnishedValue: props.listingData.furnished,
        poolValue: props.listingData.pool,
        elevatorValue: props.listingData.elevator,
        cctvValue: props.listingData.cctv,
        parkingValue: props.listingData.parking,
        sendRequest: 0,
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchTitleChange":
                draft.titleValue = action.titleChosen;
                break;

            case "catchListingTypeChange":
                draft.listingTypeValue = action.listingTypeChosen;
                break;

            case "catchDescriptionChange":
                draft.descriptionValue = action.descriptionChosen;
                break;


            case "catchPropertyStatusChange":
                draft.propertyStatusValue = action.propertyStatusChosen;
                break;

            case "catchPriceChange":
                draft.priceValue = action.priceChosen;
                break;

            case "catchRentalFrequencyChange":
                draft.rentalFrequencyValue = action.rentalFrequencyChosen;
                break;

            case "catchRoomsChange":
                draft.roomsValue = action.roomsChosen;
                break;

            case "catchFurnishedChange":
                draft.furnishedValue = action.furnishedChosen;
                break;

            case "catchPoolChange":
                draft.poolValue = action.poolChosen;
                break;

            case "catchElevatorChange":
                draft.elevatorValue = action.elevatorChosen;
                break;

            case "catchCctvChange":
                draft.cctvValue = action.cctvChosen;
                break;

            case "catchParkingChange":
                draft.parkingValue = action.parkingChosen;
                break;

            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    function formSubmit(e) {
        e.preventDefault();
        console.log("the form has been submitted");
        dispatch({ type: "changeSendRequest" });
    }

    useEffect(() => {
        if (state.sendRequest) {
            async function UpdateProperty() {
                const formData = new FormData();
                formData.append("title", state.titleValue);
                formData.append("description", state.descriptionValue);
                formData.append("listing_type", state.listingTypeValue);
                formData.append("property_status", state.propertyStatusValue);
                formData.append("price", state.priceValue);
                formData.append("rental_frequency", state.rentalFrequencyValue);
                formData.append("rooms", state.roomsValue);
                formData.append("furnished", state.furnishedValue);
                formData.append("pool", state.poolValue);
                formData.append("elevator", state.elevatorValue);
                formData.append("cctv", state.cctvValue);
                formData.append("parking", state.parkingValue);
                formData.append("seller", GlobalState.userId);

                try {
                    const response = await axios.patch(
                        `http://localhost:8000/api/listings/${props.listingData.id}/update/`,
                        formData
                    );
                    console.log(response.data);
                    navigate(0);
                } catch (e) {
                    console.log(e.response);
                }
            }
            UpdateProperty();
        }
    }, [state.sendRequest]);

    function PriceDisplay() {
        if (
            state.propertyStatusValue === "Rent" &&
            state.rentalFrequencyValue === "Day"
        ) {
            return "Price per Day*";
        } else if (
            state.propertyStatusValue === "Rent" &&
            state.rentalFrequencyValue === "Week"
        ) {
            return "Price per Week*";
        } else if (
            state.propertyStatusValue === "Rent" &&
            state.rentalFrequencyValue === "Month"
        ) {
            return "Price per Month*";
        } else return "Price*";
    }

    return (
        <div className={classes.formContainer}>
            <form onSubmit={formSubmit}>
                <Grid item container justifyContent="center">
                    <Typography variant="h4">UPDATE LISTING</Typography>
                </Grid>
                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="title"
                        label="Title*"
                        variant="standard"
                        fullWidth
                        value={state.titleValue}
                        onChange={(e) =>
                            dispatch({
                                type: "catchTitleChange",
                                titleChosen: e.target.value,
                            })
                        }
                    />
                </Grid>
                {/* Listing Type and Property status fields */}
                <Grid item container justifyContent="space-between">
                    <Grid item xs={5} style={{ marginTop: "1rem" }}>
                        <TextField
                            id="listingType"
                            label="Listing Type*"
                            variant="standard"
                            fullWidth
                            value={state.listingTypeValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchListingTypeChange",
                                    listingTypeChosen: e.target.value,
                                })
                            }
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {listingTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={5} style={{ marginTop: "1rem" }}>
                        <TextField
                            id="propertyStatus"
                            label="Property Status*"
                            variant="standard"
                            fullWidth
                            value={state.propertyStatusValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchPropertyStatusChange",
                                    propertyStatusChosen: e.target.value,
                                })
                            }
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {propertyStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                {/* Price and Rental Frequency fields */}
                <Grid item container justifyContent="space-between">
                    <Grid item xs={5} style={{ marginTop: "1rem" }}>
                        <TextField
                            id="rentalFrequency"
                            label="Rental Frequency"
                            variant="standard"
                            disabled={
                                state.propertyStatusValue === "Sale"
                                    ? true
                                    : false
                            }
                            fullWidth
                            value={state.rentalFrequencyValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchRentalFrequencyChange",
                                    rentalFrequencyChosen: e.target.value,
                                })
                            }
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            {rentalFrequencyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={5} style={{ marginTop: "1rem" }}>
                        <TextField
                            id="price"
                            type="number"
                            label={PriceDisplay()}
                            variant="standard"
                            fullWidth
                            value={state.priceValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchPriceChange",
                                    priceChosen: e.target.value,
                                })
                            }
                        />
                    </Grid>
                </Grid>

                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="description"
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={6}
                        fullWidth
                        value={state.descriptionValue}
                        onChange={(e) =>
                            dispatch({
                                type: "catchDescriptionChange",
                                descriptionChosen: e.target.value,
                            })
                        }
                    />
                </Grid>

                {state.listingTypeValue === "Office" ? (
                    ""
                ) : (
                    <Grid item xs={3} container style={{ marginTop: "1rem" }}>
                        <TextField
                            id="rooms"
                            label="Rooms"
                            type="number"
                            variant="standard"
                            fullWidth
                            value={state.roomsValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchRoomsChange",
                                    roomsChosen: e.target.value,
                                })
                            }
                        />
                    </Grid>
                )}

                <Grid item container justifyContent="space-between">
                    <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.furnishedValue}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "catchFurnishedChange",
                                            furnishedChosen: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Furnished"
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.poolValue}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "catchPoolChange",
                                            poolChosen: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Pool"
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.elevatorValue}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "catchElevatorChange",
                                            elevatorChosen: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Elevator"
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.cctvValue}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "catchCctvChange",
                                            cctvChosen: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="CCTV"
                        />
                    </Grid>

                    <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.parkingValue}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "catchParkingChange",
                                            parkingChosen: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Parking"
                        />
                    </Grid>
                </Grid>

                <Grid
                    item
                    container
                    xs={8}
                    style={{
                        marginTop: "1rem",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    className={classes.registerBtn}
                >
                    UPDATE
                </Button>
                </Grid>
            </form>
            <Button variant="contained" onClick={props.closeDialog}>CANCEL</Button>
        </div>
    );
}

export default ListingUpdate;