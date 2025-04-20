import React, { useEffect, useRef, useState } from 'react';
import {
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import useCartStore from '../../components/cartStorage';
import { useNavigate } from 'react-router-dom';
import '../admin/frames/adminFrames.css';
import './userFramesModal.css';
import axios from 'axios';

const UserFramesModal = ({ data, onClose }) => {
  const { addToCart } = useCartStore();
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [stockQuantity, setStockQuantity] = useState(null);

  const {
    name,
    price,
    img,
    brand,
    model,
    material,
    lensWidth,
    bridgeWidth,
    templeLength
  } = data;

  
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/checkout/stock/frames/${data.frameID}`);
        setStockQuantity(res.data.stockCount);

      } catch (err) {
        console.error("Stock fetch failed:", err);
        setStockQuantity(-1); // Unknown/fallback
      }
    };
    fetchStock();
  }, [data.frameID]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);


  const handlePurchase = () => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("You must be logged in to make a purchase.");
      return navigate("/log-in");
    }
  
    const existingItem = useCartStore.getState().cart.find(
      (item) => item.itemID === data.frameID && item.type === "frame"
    );
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + 1;
  
    if (stockQuantity === 0) {
      alert("This item is out of stock.");
      return;
    }
  
    if (newQuantity > stockQuantity) {
      alert(`Only ${stockQuantity} item(s) in stock. You already have ${currentQuantity} in your cart.`);
      return;
    }
  
    addToCart({
      itemID: data.frameID,
      name,
      price: parseFloat(price),
      quantity: 1,
      type: 'frame'
    });
  
    onClose();
  };
  

  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-content-cartier">
        <div className="modal-inner">
          <div className="frame-image">
            <img src={img || "/Images/default-frame.png"} alt={name} />
          </div>

          <div className="frame-info">
            <h1>{name}</h1>
            <p className="model">Model: {model}</p>
            <p className="stock">
              {stockQuantity > 0 ? (
                <b>In stock: {stockQuantity}</b>
              ) : stockQuantity === 0 ? (
                <span style={{ color: 'red' }}><b>Out of stock</b></span>
              ) : (
                <span style={{ color: 'gray' }}>Loading stock...</span>
              )}
            </p>

            <div className="dimensions">
              <p><b>Lens Width:</b> {lensWidth}</p>
              <p><b>Bridge Width:</b> {bridgeWidth}</p>
              <p><b>Temple Length:</b> {templeLength}</p>
            </div>

            <div className="specs">
              <p><b>Brand:</b> {brand}</p>
              <p><b>Material:</b> {material}</p>
            </div>

            <p className="price">${parseFloat(price).toFixed(2)}</p>
            <button
              className="purchase-button"
              onClick={handlePurchase}
              disabled={stockQuantity === 0}
            >
              PURCHASE
            </button>
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default UserFramesModal;


