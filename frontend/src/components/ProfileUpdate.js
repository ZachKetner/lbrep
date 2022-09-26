import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useImmerReducer } from "use-immer";

// Context
import StateContext from "../contexts/StateContext";

// MUI imports
import {
    Grid,
    FormControlLabel,
    Typography,
    Button,
    Snackbar,
    MenuItem,
    CardMedia,
    CardContent,
    CircularProgress,
    TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    formContainer: {
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border: "5px solid black",
        padding: "3rem",
    },
    updateBtn: {
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

function ProfileUpdate(props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);

    console.log(props.userProfile);

    const initialState = {
        agencyNameValue: props.userProfile.agencyName,
        phoneNumberValue: props.userProfile.phoneNumber,
        bioValue: props.userProfile.bio,
        uploadedPicture: [],
        profilePictureValue: props.userProfile.profilePic,
        sendRequest: 0,
        openSnack: false,
        disabledBtn: false,
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchAgencyNameChange":
                draft.agencyNameValue = action.agencyNameChosen;
                break;

            case "catchPhoneNumberChange":
                draft.phoneNumberValue = action.phoneNumberChosen;
                break;

            case "catchBioChange":
                draft.bioValue = action.bioChosen;
                break;

            case "catchUploadedPicture":
                draft.uploadedPicture = action.pictureChosen;
                break;

            case "catchProfilePictureChange":
                draft.profilePictureValue = action.profilePictureChosen;
                break;
            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
                break;

            case "openTheSnack":
                draft.openSnack = true;
                break;

            case "disabledTheBtn":
                draft.disabledBtn = true;
                break;

            case "enabledTheBtn":
                draft.disabledBtn = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    // Use Effect to catch uploaded picture

    useEffect(() => {
        if (state.uploadedPicture[0]) {
            dispatch({
                type: "catchProfilePictureChange",
                profilePictureChosen: state.uploadedPicture[0],
            });
        }
    }, [state.uploadedPicture[0]]);

    // Use Effect to send the request to the backend to update the profile

    useEffect(() => {
        if (state.sendRequest) {
            async function UpdateProfile() {
                const formData = new FormData();

                if (
                    typeof state.profilePictureValue === "string" ||
                    state.profilePictureValue === null
                ) {
                    formData.append("agency_name", state.agencyNameValue);
                    formData.append("phone_number", state.phoneNumberValue);
                    formData.append("bio", state.bioValue);
                    formData.append("seller", GlobalState.userId);
                } else {
                    formData.append("agency_name", state.agencyNameValue);
                    formData.append("phone_number", state.phoneNumberValue);
                    formData.append("bio", state.bioValue);
                    formData.append(
                        "profile_picture",
                        state.profilePictureValue
                    );
                    formData.append("seller", GlobalState.userId);
                }

                try {
                    const response = await axios.patch(
                        `http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
                        formData
                    );
                    console.log(response.data);
                    dispatch({ type: "openTheSnack" });
                } catch (e) {
                    console.log(e.response);
                    dispatch({ type: "enabledTheBtn" });
                }
            }
            UpdateProfile();
        }
    }, [state.sendRequest]);

    // SnackBar timeout then allowing the redirect
    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate(0);
            }, 1500);
        }
    }, [state.openSnack]);

    function FormSubmit(e) {
        e.preventDefault();
        dispatch({ type: "changeSendRequest" });
        dispatch({ type: "disabledTheBtn" });
    }

    function ProfilePictureDisplay() {
        if (typeof state.profilePictureValue !== "string") {
            return (
                <ul>
                    {state.profilePictureValue ? (
                        <li>{state.profilePictureValue.name} uploaded!</li>
                    ) : (
                        ""
                    )}
                </ul>
            );
        } else if (typeof state.profilePictureValue === "string") {
            return (
                <Grid
                    item
                    style={{
                        marginTop: "0.5rem",
                        marginRight: "auto",
                        marginLeft: "auto",
                    }}
                >
                    <img
                        src={props.userProfile.profilePic}
                        style={{ height: "5rem", width: "5rem" }}
                    />
                </Grid>
            );
        }
    }

    return (
        <>
            {/* Profile Form */}
            <div className={classes.formContainer}>
                <form onSubmit={FormSubmit}>
                    <Grid item container justifyContent="center">
                        <Typography variant="h4">MY PROFILE</Typography>
                    </Grid>
                    <Grid item container style={{ marginTop: "1rem" }}>
                        <TextField
                            id="agencyName"
                            label="Agency Name*"
                            variant="outlined"
                            fullWidth
                            value={state.agencyNameValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchAgencyNameChange",
                                    agencyNameChosen: e.target.value,
                                })
                            }
                        />
                    </Grid>
                    <Grid item container style={{ marginTop: "1rem" }}>
                        <TextField
                            id="phoneNumber"
                            label="Phone Number*"
                            variant="outlined"
                            fullWidth
                            value={state.phoneNumberValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchPhoneNumberChange",
                                    phoneNumberChosen: e.target.value,
                                })
                            }
                        />
                    </Grid>

                    <Grid item container style={{ marginTop: "1rem" }}>
                        <TextField
                            id="bio"
                            label="Bio"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            value={state.bioValue}
                            onChange={(e) =>
                                dispatch({
                                    type: "catchBioChange",
                                    bioChosen: e.target.value,
                                })
                            }
                        />
                    </Grid>

                    {/* Feedback on uplaoded profile pic */}
                    <Grid item container style={{ marginTop: "1rem" }}>
                        {ProfilePictureDisplay()}
                    </Grid>
                    {/* Profile pic upload button */}
                    <Grid
                        item
                        container
                        xs={6}
                        style={{
                            marginTop: "1rem",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            className={classes.pictureBtn}
                        >
                            PROFILE PICTURE
                            <input
                                type="file"
                                accept="image/png. image/gif, image/jpeg"
                                hidden
                                onChange={(e) =>
                                    dispatch({
                                        type: "catchUploadedPicture",
                                        pictureChosen: e.target.files,
                                    })
                                }
                            />
                        </Button>
                    </Grid>

                    {/* Updating submit button for profile form */}
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
                            className={classes.updateBtn}
                            disabled={state.disabledBtn}
                        >
                            UPDATE
                        </Button>
                    </Grid>
                </form>
                <Snackbar
                    open={state.openSnack}
                    message="You have successfully updated your Profile!"
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                />
            </div>
        </>
    );
}

export default ProfileUpdate;
