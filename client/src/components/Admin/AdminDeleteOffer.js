import React, { Fragment, useContext } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { OpenDialog, OfferProducts } from "../UserContext";
import { useNavigate } from "react-router-dom";
import AdminDeleteButton from "./AdminDeleteButton";
import Box from "@mui/material/Box";

const AdminDeleteOffer = (store) => {
  //useNavigate
  const navigate = useNavigate();

  //useContext
  const { open, setOpen } = useContext(OpenDialog);
  const { offerProducts } = useContext(OfferProducts);

  //<------------- handlers ------------->

  //hanlder for open rating
  const handleClickOpen = () => {
    setOpen(true);
  };

  //hanlder for close rating
  const handleClose = () => {
    setOpen(false);
  };

  //format date //
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <Fragment>
      <Box sx={{ ml: 67 }}>
        <Button
          size="small"
          variant="outlined"
          sx={{ height: 35}}
          onClick={handleClickOpen}
        >
          Περισσότερα
        </Button>
      </Box>
      <Dialog
        maxWidth="400"
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>{store.store.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <b>ΠΡΟΣΦΟΡΕΣ</b>
            {offerProducts &&
              offerProducts.map(
                (indexProduct) =>
                  store.store.id === indexProduct.id && (
                    <p>
                      {indexProduct.product_name} {" Από "}
                      {indexProduct.init_price} {"€ Μόνο "}
                      {indexProduct.new_price} {"€ Ημερομηνία κατ: "}
                      {getFormattedDate(indexProduct.entry_date)} {", Likes "}
                      {indexProduct.likes} {", Dislikes "}
                      {indexProduct.dislikes} {", Σε απόθεμα: "}
                      {indexProduct.stock === true ? "ΝΑΙ" : "OXI"}
                      <AdminDeleteButton indexProduct={indexProduct} />
                      <br />
                    </p>
                  )
              )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" autoFocus onClick={() => navigate("/")}>
            Έξοδος
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AdminDeleteOffer;
