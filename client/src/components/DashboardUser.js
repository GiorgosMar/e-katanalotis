import React, {Fragment, useContext} from "react";
import {UserContext} from "./UserContext";
import {Button} from "@mui/material";
import {Box} from "@material-ui/core";

const DashboardUser = () => {
    const {setIsAuthenticated} = useContext(UserContext);
    return (
        <Fragment>
            <Box>

                <h1>User's Dashboard</h1>

                <Button variant="contained" onClick={() => setIsAuthenticated(false)}>
                    Logout
                </Button>
            </Box>
        </Fragment>
    );
};

export default DashboardUser;
