import React, { Fragment, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import "react-confirm-alert/src/react-confirm-alert.css";
import { OfferProducts } from "../UserContext";

const AdminDeleteButton = (indexProduct) => {
 //useContext//
  const { setOfferProducts } = useContext(OfferProducts);

  //<------------------ Fetching -------------------->

  //Get offers//
  const getOfferProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/offerProducts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const getOfferProducts = await response.json();
      setOfferProducts(getOfferProducts);
    } catch (err) {
      console.error(err.message);
    }
  };

  //Delete offer
  const deleteOffer = async (offerid) => {
    if (offerid !== null) {
      const body = { offerid };
      console.log(offerid);
      await fetch("http://localhost:5000/deleteOffer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      getOfferProducts();
    }
  };
  
  return (
    <Fragment>
      <IconButton onClick={() => deleteOffer(indexProduct.indexProduct.offer_id)}>
        <DeleteIcon color="error" />
      </IconButton>
    </Fragment>
  );
};

export default AdminDeleteButton;
