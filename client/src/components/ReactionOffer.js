import React, { Fragment, useContext, useEffect, useState } from "react";
import { ReactedProducts, UserCredentials } from "./UserContext";
import IconButton from "@mui/material/IconButton";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import Checkbox from "@mui/material/Checkbox";

const ReactionOffer = (indexProduct) => {
  //useContext
  const { userCredentials } = useContext(UserCredentials);
  const { reactedProducts, setReactedProducts } = useContext(ReactedProducts);

  //useState
  const [checked, setChecked] = useState(indexProduct.indexProduct.stock);
  const [todayDate, setTodayDate] = useState(null);

  //<-----------handlers----------->

  //handler for Checkbox
  const handlerCheckbox = (e) => {
    setChecked(e.target.checked);
    console.log(checked);
  };

  //handler for Likes
  const handleClickLike = (indexProduct) => {
    if (
      !reactedProducts.find(
        ({ offerid, userid, r_type }) =>
          offerid === indexProduct.indexProduct.offer_id &&
          userid === userCredentials.user_id &&
          r_type === true
      )
    ) {
      indexProduct.indexProduct.likes = indexProduct.indexProduct.likes + 1;
      updateLikes(
        indexProduct.indexProduct.likes,
        indexProduct.indexProduct.offer_id
      );
      addReactionProduct(
        indexProduct.indexProduct.offer_id,
        userCredentials.user_id,
        true,
        todayDate
      );
    } else { //Οταν ο χρηστης παιρνει πισω το like
      indexProduct.indexProduct.likes = indexProduct.indexProduct.likes - 1;
      updateLikes(
        indexProduct.indexProduct.likes,
        indexProduct.indexProduct.offer_id
      );
      deleteLikedProduct(
        indexProduct.indexProduct.offer_id,
        userCredentials.user_id
      );
    }
  };

  //handler for dislikes
  const handleClickDislike = (indexProduct) => {
    if (
      !reactedProducts.find(
        ({ offerid, userid, r_type }) =>
          offerid === indexProduct.indexProduct.offer_id &&
          userid === userCredentials.user_id &&
          r_type === false
      )
    ) {
      indexProduct.indexProduct.dislikes =
        indexProduct.indexProduct.dislikes + 1;
      updateDislikes(
        indexProduct.indexProduct.dislikes,
        indexProduct.indexProduct.offer_id
      );
      addReactionProduct(
        indexProduct.indexProduct.offer_id,
        userCredentials.user_id,
        false,
        todayDate
      );
    } else { //Οταν ο χρηστης παιρνει πισω το dislike
      indexProduct.indexProduct.dislikes =
        indexProduct.indexProduct.dislikes - 1;
      updateDislikes(
        indexProduct.indexProduct.dislikes,
        indexProduct.indexProduct.offer_id
      );
      deleteLikedProduct(
        indexProduct.indexProduct.offer_id,
        userCredentials.user_id
      );
    }
  };

  //<-----------Fetching----------->

  //Get reactedProducts
  const getReactedProducts = async () => {
    try {
      const resLikedProducts = await fetch(
        "http://localhost:5000/checkReaction"
      );
      const getReactedProducts = await resLikedProducts.json();

      setReactedProducts(getReactedProducts);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Update stock
  const updateStock = async (offerid) => {
    const body = { offerid };
    await fetch("http://localhost:5000/updateStock", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  //Update Likes
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

  //Upadate Dislikes
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

  //Add reaction
  const addReactionProduct = async (offerid, userid, like, date) => {
    const body = { offerid, userid, like, date };
    await fetch("http://localhost:5000/addReaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    getReactedProducts();
  };

  //Delete from reactedProducts
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

  //format date//
  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  //Get current date//
  const today = () => {
    const current = new Date();
    //setTodayDate(getFormattedDate(current));
    setTodayDate(current);
    const forma = getFormattedDate(current);
    const dollar = `${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()}`;
  };

  //useEffect//
  useEffect(() => {
    today();
  }, []);

  //useEffects//
  useEffect(() => {
    getReactedProducts();
  }, []);

  return (
    <Fragment>
      {checked === true ? (
        <Checkbox
          checked={checked}
          onChange={handlerCheckbox}
          onClick={() => updateStock(indexProduct.indexProduct.offer_id)}
        />
      ) : (
        <Checkbox
          checked={checked}
          onChange={handlerCheckbox}
          onClick={() => updateStock(indexProduct.indexProduct.offer_id)}
        />
      )}

      {checked === false ? ( //Δεν μπορεις να κανεις reaction
        <IconButton disabled={true}>
          <ThumbUpOutlinedIcon />
        </IconButton>
      ) : reactedProducts.find(
          ({ offerid, userid, r_type }) =>
            offerid === indexProduct.indexProduct.offer_id &&
            userid === userCredentials.user_id &&
            r_type === false
        ) ? (
        <IconButton disabled={true}>
          <ThumbUpOutlinedIcon />
        </IconButton>
      ) : reactedProducts.find(
          ({ offerid, userid, r_type }) =>
            offerid === indexProduct.indexProduct.offer_id &&
            userid === userCredentials.user_id &&
            r_type === true
        ) ? (
        <IconButton onClick={() => handleClickLike(indexProduct)}>
          <ThumbUpOutlinedIcon color={"success"} />
        </IconButton>
      ) : (
        <IconButton onClick={() => handleClickLike(indexProduct)}>
          <ThumbUpOutlinedIcon />
        </IconButton>
      )}
      {/*Για Dislikes*/}
      {checked === false ? (
        <IconButton disabled={true}>
          <ThumbDownOffAltOutlinedIcon />
        </IconButton>
      ) : reactedProducts.find(
          ({ offerid, userid, r_type }) =>
            offerid === indexProduct.indexProduct.offer_id &&
            userid === userCredentials.user_id &&
            r_type === true
        ) ? (
        <IconButton disabled={true}>
          <ThumbDownOffAltOutlinedIcon />
        </IconButton>
      ) : reactedProducts.find(
          ({ offerid, userid, r_type }) =>
            offerid === indexProduct.indexProduct.offer_id &&
            userid === userCredentials.user_id &&
            r_type === false
        ) ? (
        <IconButton onClick={() => handleClickDislike(indexProduct)}>
          <ThumbDownOffAltOutlinedIcon color={"error"} />
        </IconButton>
      ) : (
        <IconButton onClick={() => handleClickDislike(indexProduct)}>
          <ThumbDownOffAltOutlinedIcon />
        </IconButton>
      )}
    </Fragment>
  );
};

export default ReactionOffer;
