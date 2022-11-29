import {createTheme} from "@material-ui/core/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#3f51b5",
        },
        secondary: {
            main: "#424242",
        },
    },

    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    margin: "165px 500px",
                    padding: "50px",
                    backgroundColor: "#9f51b5",
                    minWidth: "50%",
                    '&.cardLogin': {
                        backgroundColor: "#ffffff",
                        width: "100%",
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    backgroundColor: "#232324"
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: "20px",
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#232324"
                        },


                    }
                }
            }
        }
    },
});

export default theme;
