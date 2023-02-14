import React, { Fragment, useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { OpenDialog, OfferProducts, ReactedProducts } from "./UserContext";
import { useNavigate } from "react-router-dom";
import ReactionOffer from "./ReactionOffer";


const Rating = (store) => {
  //useNavigate
  const navigate = useNavigate();
  //useState
  const [reactedProducts, setReactedProducts] = useState([]);

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

  //format date//
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <Fragment>
      <div>
        <Button
          size="small"
          variant="outlined"
          sx={{ height: 40 }}
          onClick={handleClickOpen}
        >
          Αξιολόγηση
        </Button>
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
                        <ReactedProducts.Provider
                          value={{ reactedProducts, setReactedProducts }}
                        >
                          <ReactionOffer
                            indexProduct={indexProduct}
                          />
                        </ReactedProducts.Provider>
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
      </div>
    </Fragment>
  );
};

export default Rating;
