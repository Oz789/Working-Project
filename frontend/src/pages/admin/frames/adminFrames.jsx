import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Grid2,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";

import AdminFrameModal from "./adminCreateFrameModal";
import AdminNavbar from "../../../components/navBar"; 
import AdminEditFrameModal from "./adminEditFrames";

const AdminFrames = () => {
  const [frames, setFrames] = useState([]);
  const [modal, setModal] = useState(false);
  const [buffer, setBuffer] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState(null);

  const fetchFrames = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/frames"); //fix this 
      setFrames(res.data);
    } catch (error) {
      console.error("Failed to fetch frames", error);
    }
  };

  useEffect(() => {
    fetchFrames();
  }, []);

  const handleClick = (frame) => {
    setBuffer(frame);
    setModal(true);
  };

  const handleFramesClick = (frame) => {
    setSelectedFrame(frame);
    setViewModal(true);
  };

  const handleCreate = async (newFrame) => {
    try {
      await axios.post("http://localhost:5001/api/createFrame", newFrame);
        setModal(false); 
      fetchFrames(); 
        console.log("Adding new frame:", newFrame);

    } catch (error) {
      console.error("Error creating frame:", error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <Grid2 sx={{ paddingLeft: 4, paddingTop: 2 }}>
        <Typography variant="h3">Eyeglasses</Typography>
        <Typography variant="h6">Showing {frames.length} Products</Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={() => setModal(true)}
        >
          + Add New Frame
        </Button>
      </Grid2>

      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ padding: 2 }}
      >
        {frames.map((frame) => (
          <Grid2 item key={frame.id} minWidth={100}>
            <Card>


              <CardActionArea onClick={() => handleFramesClick(frame)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={frame.img}
                  alt="Eyeglass"
                />


                <CardContent>
                  <Grid2 container justifyContent="space-between">
                    <Grid2 item>
                      <Typography variant="h5">{frame.name}</Typography>
                    </Grid2>
                    <Grid2 item>
                      <Typography variant="h5" fontWeight="bold">
                        {frame.price}
                      </Typography>
                    </Grid2>
                  </Grid2>
                </CardContent>


              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {modal && (
        <AdminFrameModal
          toggleModal={() => setModal(false)}
          onSubmit={handleCreate}
        />
      )}


      {viewModal && selectedFrame && (
    <AdminEditFrameModal
    data={selectedFrame}
    onClose={() => setViewModal(false)}
    onEdit={() => console.log("Edit", selectedFrame.frameID)}
    onDelete={() => console.log("Delete", selectedFrame.frameID)}
  />
)}

    </div>
  );
};

export default AdminFrames;
