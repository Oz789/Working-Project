import React, { useState } from "react";
import AdminHeader from "./adminHeader";
import AdminTabs from "./adminTabs";
import AdminTabContent from "./adminTabContent";

const AdminProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const user = {
    name: "John Doe",
    role: "Administrator",
    avatar: "/Images/dog-secretary.webp",
  };

  return (
    <div>
      <AdminHeader name={user.name} role={user.role} avatar={user.avatar} />
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <AdminTabContent activeTab={activeTab} />
    </div>
  );
};

export default AdminProfilePage;
