import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import axios from "axios";

// MUI imports
import {
    Grid,
    Snackbar,
    Typography,
    Button,
    Alert,
    CardHeader,
    CardMedia,
    CardContent,
    CircularProgress,
    TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

// Contexts
import DispatchContext from "../contexts/DispatchContext";
import StateContext from "../contexts/StateContext";

const useStyles = makeStyles({
    formContainer: {
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border: "5px solid black",
        padding: "3rem",
    },
    loginBtn: {
        backgroundColor: "green",
        color: "white",
        fontSize: "1.1rem",
        marginLeft: "1rem",
        "&:hover": {
            backgroundColor: "blue",
        },
    },
});

function Login() {
    const classes = useStyles();
    const navigate = useNavigate();
    const GlobalDispatch = useContext(DispatchContext);
    const GlobalState = useContext(StateContext);

    const initialState = {
        usernameValue: "",
        passwordValue: "",
        sendRequest: 0,
        token: "",
        openSnack: false,
        disabledBtn: false,
        serverError: false,
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchUsernameChange":
                draft.usernameValue = action.usernameChosen;
                draft.serverError = false;
                break;
            case "catchPasswordChange":
                draft.passwordValue = action.passwordChosen;
                draft.serverError = false;
                break;
            case "changeSendRequest":
                draft.sendRequest = draft.sendRequest + 1;
                break;
            case "catchToken":
                draft.token = action.tokenValue;
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

            case "carchServerError":
                draft.serverError = true;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    function FormSubmit(e) {
        e.preventDefault();
        console.log("the form has been submitted");
        dispatch({ type: "changeSendRequest" });
        dispatch({ type: "disabledTheBtn" });
    }

    // Sign In request
    useEffect(() => {
        if (state.sendRequest) {
            const source = axios.CancelToken.source();
            async function SignIn() {
                try {
                    const response = await axios.post(
                        "http://localhost:8000/api-auth-djoser/token/login/",
                        {
                            username: state.usernameValue,
                            password: state.passwordValue,
                        },
                        {
                            cancelToken: source.token,
                        }
                    );
                    console.log(response);
                    dispatch({
                        type: "catchToken",
                        tokenValue: response.data.auth_token,
                    });
                    GlobalDispatch({
                        type: "catchToken",
                        tokenValue: response.data.auth_token,
                    });
                    // navigate("/");
                } catch (error) {
                    console.log(error.response);
                    dispatch({ type: "enabledTheBtn" });
                    dispatch({ type: "carchServerError" });
                }
            }
            SignIn();
            return () => {
                source.cancel();
            };
        }
    }, [state.sendRequest]);

    // Getting user info for log in state
    useEffect(() => {
        if (state.token !== "") {
            const source = axios.CancelToken.source();
            async function GetUserInfo() {
                try {
                    const response = await axios.get(
                        "http://localhost:8000/api-auth-djoser/users/me/",
                        {
                            headers: {
                                Authorization: "Token ".concat(state.token),
                            },
                        },
                        {
                            cancelToken: source.token,
                        }
                    );
                    console.log(response);
                    GlobalDispatch({
                        type: "userSignsIn",
                        usernameInfo: response.data.username,
                        emailInfo: response.data.email,
                        IdInfo: response.data.id,
                    });
                    dispatch({ type: "openTheSnack" });
                } catch (error) {
                    console.log(error.response);
                }
            }
            GetUserInfo();
            return () => {
                source.cancel();
            };
        }
    }, [state.token]);

    // SnackBar timeout then allowing the redirect
    useEffect(() => {
        if (state.openSnack) {
            setTimeout(() => {
                navigate("/");
            }, 1500);
        }
    }, [state.openSnack]);

    return (
        <div className={classes.formContainer}>
            <form onSubmit={FormSubmit}>
                <Grid item container justifyContent="center">
                    <Typography variant="h4">SIGN IN</Typography>
                </Grid>

                {state.serverError ? (
                    <Alert severity="error">
                        Incorrect Username or Password!
                    </Alert>
                ) : (
                    ""
                )}

                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={state.usernameValue}
                        onChange={(e) =>
                            dispatch({
                                type: "catchUsernameChange",
                                usernameChosen: e.target.value,
                            })
                        }
                        error={state.serverError ? true : false}
                    />
                </Grid>
                <Grid item container style={{ marginTop: "1rem" }}>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        type="password"
                        value={state.passwordValue}
                        onChange={(e) =>
                            dispatch({
                                type: "catchPasswordChange",
                                passwordChosen: e.target.value,
                            })
                        }
                        error={state.serverError ? true : false}
                    />
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
                        disabled={state.disabledBtn}
                    >
                        SIGN IN
                    </Button>
                </Grid>
            </form>
            <Grid
                item
                container
                justifyContent="center"
                style={{ marginTop: "1rem" }}
            >
                <Typography variant="small">
                    Don't have an account yet?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        style={{ cursor: "pointer", color: "green" }}
                    >
                        SIGN UP
                    </span>
                </Typography>
            </Grid>
            <Snackbar
                open={state.openSnack}
                message="You have successfully logged in!"
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            />
        </div>
    );
}

export default Login;
