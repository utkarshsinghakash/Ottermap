import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

const SearchForm = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ firstName: "", mobileNumber: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setUser({ ...formData, location: userLocation }); // Save user + location
          navigate("/map");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
        padding: "20px",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: "40px",
          maxWidth: 420,
          width: "100%",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
          sx={{ color: "#fff" }}
        >
          Welcome
        </Typography>
        <Typography variant="body1" mb={3} sx={{ color: "#ddd" }}>
          Enter your details to continue
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Name"
            name="firstName"
            fullWidth
            required
            value={formData.firstName}
            onChange={handleChange}
            sx={{
              mb: 2,
              bgcolor: "white",
              borderRadius: "5px",
              "& .MuiInputLabel-root": { color: "#555" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#007bff" },
                "&.Mui-focused fieldset": { borderColor: "#007bff" },
              },
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            placeholder="Mobile Number"
            name="mobileNumber"
            fullWidth
            required
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            sx={{
              mb: 3,
              bgcolor: "white",
              borderRadius: "5px",
              "& .MuiInputLabel-root": { color: "#555" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ccc" },
                "&:hover fieldset": { borderColor: "#007bff" },
                "&.Mui-focused fieldset": { borderColor: "#007bff" },
              },
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(to right, #ff416c, #ff4b2b)",
              color: "white",
              fontWeight: "bold",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                background: "linear-gradient(to right, #ff4b2b, #ff416c)",
              },
            }}
          >
            Continue
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SearchForm;
