import React, { Fragment, useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { OpenDialog, OfferProducts } from "./UserContext";
import IconButton from "@mui/material/IconButton";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";

const Rating = (store) => {
  //useContext
  const { open, setOpen } = useContext(OpenDialog);
  const { offerProducts } = useContext(OfferProducts);

  //useStates
  const [Active, setActive] = useState(false);

  const handleClickLike = () => {
    setActive(!Active);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //useEffect//
  useEffect(() => {
  }, []);


 


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
          maxWidth="400"
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {store.store.name}
          </DialogTitle>
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
                        <IconButton onClick={() => handleClickLike()}>
                          {Active === false ? (
                            <ThumbUpOutlinedIcon />
                          ) : (
                            <ThumbUpOutlinedIcon color={"success"} />
                          )}
                        </IconButton>
                        <IconButton>
                          <ThumbDownOffAltOutlinedIcon />
                        </IconButton>
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
