import React, { Fragment, useContext, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { OpenDialog, OfferProducts, UserCredentials } from "./UserContext";
import IconButton from "@mui/material/IconButton";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
//import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";

const Rating = (store) => {
  //useNavigate
  const navigate = useNavigate();

  //useContext
  const { open, setOpen } = useContext(OpenDialog);
  const { offerProducts } = useContext(OfferProducts);
  const { userCredentials } = useContext(UserCredentials);

  //useStates
  const [likedProducts, setLikedProducts] = useState([]);
  const [disableLikeButton, setDisableLikeButton] = useState(false);
  const [disableUnlikeButton, setDisableUnlikeButton] = useState(false);

  const deleteLikedProduct = async (offerId, userId) => {
    try {
      await fetch(
        `http://localhost:5000/deleteLikedProduct?offerid=${offerId}&userid=${userId}`,
        {
          method: "DELETE",
        }
      );
      getReactedProducts();
    } catch (err) {
      console.error(err.message);
    }
  };

  const addReactionProduct = async (offerId, userId, like) => {
    const body = { offerId, userId, like };
    await fetch("http://localhost:5000/addReaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    getReactedProducts();
  };

  const getReactedProducts = async () => {
    try {
      const resLikedProducts = await fetch(
        "http://localhost:5000/checkReaction"
      );
      const getReactedProducts = await resLikedProducts.json();

      setLikedProducts(getReactedProducts);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateLikes = async (val1, val2) => {
    try {
      const body = { val1, val2 };
      await fetch(
        `http://localhost:5000/offerlike?updatedlikes=${val1}&offerid=${val2}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateDislikes = async (val1, val2) => {
    try {
      const body = { val1, val2 };
      await fetch(
        `http://localhost:5000/offerdislike?updateddislikes=${val1}&offerid=${val2}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleClickLike = (indexProduct) => {
    if (
      !likedProducts.find(
        ({ offerid, userid, r_type }) =>
          offerid === indexProduct.offer_id &&
          userid === userCredentials.user_id &&
          r_type === true
      )
    ) {
      indexProduct.likes = indexProduct.likes + 1;
      updateLikes(indexProduct.likes, indexProduct.offer_id);
      addReactionProduct(indexProduct.offer_id, userCredentials.user_id, true);
      setDisableUnlikeButton(true);
    } else {
      indexProduct.likes = indexProduct.likes - 1;
      updateLikes(indexProduct.likes, indexProduct.offer_id);
      deleteLikedProduct(indexProduct.offer_id, userCredentials.user_id);
      setDisableUnlikeButton(false);
    }
  };

  const handleClickDislike = (indexProduct) => {
    if (
      !likedProducts.find(
        ({ offerid, userid, r_type }) =>
          offerid === indexProduct.offer_id &&
          userid === userCredentials.user_id &&
          r_type === false
      )
    ) {
      indexProduct.dislikes = indexProduct.dislikes + 1;
      updateDislikes(indexProduct.dislikes, indexProduct.offer_id);
      addReactionProduct(indexProduct.offer_id, userCredentials.user_id, false);
      setDisableLikeButton(true);
    } else {
      indexProduct.dislikes = indexProduct.dislikes - 1;
      updateDislikes(indexProduct.dislikes, indexProduct.offer_id);
      deleteLikedProduct(indexProduct.offer_id, userCredentials.user_id);
      setDisableLikeButton(false);
    }
  };

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

  //useEffects
  useEffect(() => {
    getReactedProducts();
  }, []);

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
                        {indexProduct.stock === true ? "NAI" : "OXI"}
                        {likedProducts.length === 0 ? (
                          <IconButton
                            onClick={() => handleClickLike(indexProduct)}
                          >
                            <ThumbUpOutlinedIcon />
                          </IconButton>
                        ) : likedProducts.find(
                            ({ offerid, userid, r_type }) =>
                              offerid === indexProduct.offer_id &&
                              userid === userCredentials.user_id &&
                              r_type === false
                          ) ? (
                          <IconButton
                            onClick={() => handleClickLike(indexProduct)}
                            disabled={disableLikeButton}
                          >
                            <ThumbUpOutlinedIcon />
                          </IconButton>
                        ) : likedProducts.find(
                            ({ offerid, userid, r_type }) =>
                              offerid === indexProduct.offer_id &&
                              userid === userCredentials.user_id &&
                              r_type === true
                          ) ? (
                          <IconButton
                            onClick={() => handleClickLike(indexProduct)}
                          >
                            <ThumbUpOutlinedIcon color={"success"} />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => handleClickLike(indexProduct)}
                          >
                            <ThumbUpOutlinedIcon />
                          </IconButton>
                        )}
                        {likedProducts.length === 0 ? (
                          <IconButton
                            onClick={() => handleClickDislike(indexProduct)}
                          >
                            <ThumbDownOffAltOutlinedIcon />
                          </IconButton>
                        ) : likedProducts.find(
                            ({ offerid, userid, r_type }) =>
                              offerid === indexProduct.offer_id &&
                              userid === userCredentials.user_id &&
                              r_type === true
                          ) ? (
                          <IconButton
                            onClick={() => handleClickDislike(indexProduct)}
                            disabled={disableUnlikeButton}
                          >
                            <ThumbDownOffAltOutlinedIcon />
                          </IconButton>
                        ) : likedProducts.find(
                            ({ offerid, userid, r_type }) =>
                              offerid === indexProduct.offer_id &&
                              userid === userCredentials.user_id &&
                              r_type === false
                          ) ? (
                          <IconButton
                            onClick={() => handleClickDislike(indexProduct)}
                          >
                            <ThumbDownOffAltOutlinedIcon color={"error"} />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => handleClickDislike(indexProduct)}
                          >
                            <ThumbDownOffAltOutlinedIcon />
                          </IconButton>
                        )}
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
