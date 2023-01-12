import React, { Fragment, useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { OpenDialog, OfferProducts } from "./UserContext";

const Rating = (store) => {
  //useContext
  const { open, setOpen } = useContext(OpenDialog);
  const { offerProducts, setOfferProducts } = useContext(OfferProducts);

  const handleClickOpen = () => {
    setOpen(true);
  };

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
          <div>
            <Button size="small" variant="outlined" onClick={handleClickOpen}>
              Αξιολόγηση{" "}
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {store.store.name}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {offerProducts &&
                    offerProducts.map(
                      (indexProduct) =>
                        store.store.id === indexProduct.id && (
                          <p>
                            {indexProduct.product_name} {" Από "}
                            {indexProduct.init_price} {"€ Μόνο "}
                            {indexProduct.new_price} {"€ Ημερομηνία κατ: "}
                            {getFormattedDate(indexProduct.entry_date)}{" "}
                            {", Likes "}
                            {indexProduct.likes} {", Dislikes "}
                            {indexProduct.dislikes} {", Σε απόθεμα: "}
                            {indexProduct.stock === true ? "ΝΑΙ" : "OXI"}
                            <br />
                          </p>
                        )
                    )}
                    {console.log(store.store.id)}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="error" autoFocus onClick={handleClose}>
                  Έξοδος
                </Button>
              </DialogActions>
            </Dialog>
          </div>
    </Fragment>
  );
};

export default Rating;
