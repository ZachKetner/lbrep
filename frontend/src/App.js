import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useImmerReducer } from "use-immer";

// MUI
import { StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

//Components
import Home from "./components/Home";
import Login from "./components/Login";
import Listings from "./components/Listings";
import Header from "./components/Header";
import Register from "./components/Register";
import AddProperty from "./components/AddProperty";
import Profile from "./components/Profile";
import Agencies from "./components/Agencies";
import AgencyDetail from "./components/AgencyDetail";
import ListingDetail from "./components/ListingDetail";

// Context
import DispatchContext from "./contexts/DispatchContext";
import StateContext from "./contexts/StateContext";

function App() {
    const initialState = {
        userUsername: localStorage.getItem('theUserUsername'),
        userEmail: localStorage.getItem('theUserEmail'),
        userId: localStorage.getItem('theUserId'),
        userToken: localStorage.getItem('theUserToken'),
        userIsLogged: localStorage.getItem('theUserUsername') ? true : false,
    };

    function ReducerFunction(draft, action) {
        switch (action.type) {
            case "catchToken":
                draft.userToken = action.tokenValue;
                break;
            case "userSignsIn":
                draft.userUsername = action.usernameInfo;
                draft.userEmail = action.emailInfo;
                draft.userId = action.IdInfo;
                draft.userIsLogged = true;
                break;
            case 'logout':
                draft.userIsLogged = false;
                break;
        }
    }

    const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

    useEffect(()=>{
        if (state.userIsLogged){
            localStorage.setItem('theUserUsername', state.userUsername)
            localStorage.setItem('theUserEmail', state.userEmail)
            localStorage.setItem('theUserId', state.userId)
            localStorage.setItem('theUserToken', state.userToken)
        } else {
            localStorage.removeItem('theUserUsername')
            localStorage.removeItem('theUserEmail')
            localStorage.removeItem('theUserId')
            localStorage.removeItem('theUserToken')
        }
    }, [state.userIsLogged])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <StyledEngineProvider injectFirst>
                    <BrowserRouter>
                        <CssBaseline />
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/addproperty" element={<AddProperty />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/agencies" element={<Agencies />} />
                            <Route path="/agencies/:id" element={<AgencyDetail />} />
                            <Route path="/listings/:id" element={<ListingDetail />} />
                            <Route path="/listings" element={<Listings />} />
                        </Routes>
                    </BrowserRouter>
                </StyledEngineProvider>
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
}

export default App;
