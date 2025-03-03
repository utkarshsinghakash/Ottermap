import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Container, Button, Typography, Box, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Select from "ol/interaction/Select";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Fill, Stroke, Style } from "ol/style";
import { click } from "ol/events/condition";

const MapPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [vectorLayer, setVectorLayer] = useState(null);
  const [draw, setDraw] = useState(null);
  const [modify, setModify] = useState(null);
  const [select, setSelect] = useState(null);

  useEffect(() => {
    const vectorSource = new VectorSource();
    const newVectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({ color: "#ffcc33", width: 2 }),
        fill: new Fill({ color: "rgba(255, 204, 51, 0.5)" }),
      }),
    });
    const newMap = new Map({
      target: "map-container",
      layers: [new TileLayer({ source: new OSM() }), newVectorLayer],
      view: new View({ center: [0, 0], zoom: 2 }),
    });
    setMap(newMap);
    setVectorLayer(newVectorLayer);
  }, []);

  const removeInteractions = () => {
    if (map) {
      if (draw) map.removeInteraction(draw);
      if (modify) map.removeInteraction(modify);
      if (select) map.removeInteraction(select);
    }
  };

  const addPolygon = () => {
    if (!map || !vectorLayer) return;
    removeInteractions();
    const drawInteraction = new Draw({
      source: vectorLayer.getSource(),
      type: "Polygon",
    });
    setDraw(drawInteraction);
    map.addInteraction(drawInteraction);
  };

  const editPolygon = () => {
    if (!map || !vectorLayer) return;
    removeInteractions();
    const modifyInteraction = new Modify({ source: vectorLayer.getSource() });
    setModify(modifyInteraction);
    map.addInteraction(modifyInteraction);
  };

  const deletePolygon = () => {
    if (!map || !vectorLayer) return;
    removeInteractions();
    const selectInteraction = new Select({ condition: click });
    setSelect(selectInteraction);
    map.addInteraction(selectInteraction);
    selectInteraction.on("select", (event) => {
      const selectedFeatures = event.target.getFeatures();
      selectedFeatures.forEach((feature) =>
        vectorLayer.getSource().removeFeature(feature)
      );
    });
  };

  const clearPolygons = () => {
    if (!vectorLayer) return;
    vectorLayer.getSource().clear();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          padding: "12px 30px",
          borderRadius: "12px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        Welcome, {user.firstName || "Guest"} 🎬
      </Paper>

      <Box
        id="map-container"
        sx={{
          width: "100%",
          maxWidth: "1200px",
          height: "500px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
        }}
      />

      <Paper
        elevation={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          mt: 4,
          padding: "12px 30px",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Button
          onClick={addPolygon}
          variant="contained"
          startIcon={<AddLocationAltIcon />}
          sx={{ background: "#ff9800", color: "white" }}
        >
          Draw
        </Button>
        <Button
          onClick={editPolygon}
          variant="contained"
          startIcon={<EditIcon />}
          sx={{ background: "#1976d2", color: "white" }}
        >
          Edit
        </Button>
        <Button
          onClick={deletePolygon}
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{ background: "#d32f2f", color: "white" }}
        >
          Delete
        </Button>
        <Button
          onClick={clearPolygons}
          variant="contained"
          sx={{ background: "#9e9e9e", color: "white" }}
        >
          Clear All
        </Button>
      </Paper>

      <Button
        onClick={() => navigate("/")}
        sx={{ position: "absolute", top: 20, left: 20 }}
      >
        <ArrowBackIcon /> Back
      </Button>
    </Box>
  );
};

export default MapPage;
