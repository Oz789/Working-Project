import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceptionistNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    if (userID) {
      axios.get(`http://localhost:5001/api/notifications/${userID}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [userID]);

  const handleClick = (notif) => {
    axios.patch(`http://localhost:5001/api/notifications/mark-read/${notif.notificationID}`)
      .then(() => {
        setNotifications(prev => prev.filter(n => n.notificationID !== notif.notificationID));
      })
      .catch(err => console.error("Failed to mark as read", err));
  };

  return (
    <div>
      <h2>Referral Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map(n => (
            <li key={n.notificationID} onClick={() => handleClick(n)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
              <strong>{n.message}</strong> <br />
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReceptionistNotifications;
