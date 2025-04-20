import React, { useEffect, useState } from "react";
import axios from "axios";
import "./frames.css";
import UsernavBar from "../../components/navBar";
import UserFramesModal from "./userFramesModal";
import UserContactsModal from "./contactsModal";

const UserFrames = () => {
  const [frames, setFrames] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const frameRes = await axios.get("http://localhost:5001/api/frames");
        const contactRes = await axios.get("http://localhost:5001/api/eyecontacts");

        setFrames(frameRes.data);
        setContacts(contactRes.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchAll();
  }, []);

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type });
    setViewModal(true);
  };

  return (
    <>
      <UsernavBar />
      <div className="frames-container">
        {/* FRAMES */}
        <h2 className="frames-title">Eyeglass Frames</h2>
        <p className="frames-count">Showing {frames.length} Products</p>

        <div className="frames-grid">
          {frames.map((frame) => (
            <div
              className="frame-card"
              key={frame.frameID}
              onClick={() => handleItemClick(frame, "frame")}
            >
              <img
                src={frame.img }
                alt={frame.name}
                className="frame-image"
              />
              <div className="frame-info">
                <span className="brand">{frame.brand}</span>
                <span className="model">{frame.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr style={{ margin: "4rem auto 2rem", width: "80%" }} />
        <h2 className="frames-title">Eye Contacts</h2>
        <p className="frames-count">Showing {contacts.length} Products</p>

        {/* CONTACTS */}
        <div className="frames-grid">
          {contacts.map((contact) => (
            <div
              className="frame-card"
              key={contact.contactID}
              onClick={() => handleItemClick(contact, "contact")}
            >
              <img
  src={contact.image}
  alt={contact.name}
/>
              <div className="frame-info">
                <span className="brand">{contact.brand}</span>
                <span className="model">{contact.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal rendering */}
      {viewModal && selectedItem && (
        selectedItem.type === "frame" ? (
          <UserFramesModal
            data={selectedItem}
            onClose={() => setViewModal(false)}
          />
        ) : (
          <UserContactsModal
            data={selectedItem}
            onClose={() => setViewModal(false)}
          />
        )
      )}
    </>
  );
};

export default UserFrames;

