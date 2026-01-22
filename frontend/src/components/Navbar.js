import React from "react";
import "./Navbar.css"; // Keep your original styles

const Navbar = ({ setActiveTab, activeTab }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <h4 className="navbar-brand">Emotion Detection</h4>
        <div className="navbar-nav">
          <button
            className={`nav-item nav-link ${activeTab === "image" ? "active" : ""}`}
            onClick={() => setActiveTab("image")}
          >
            Image
          </button>
          <button
            className={`nav-item nav-link ${activeTab === "audio" ? "active" : ""}`}
            onClick={() => setActiveTab("audio")}
          >
            Audio
          </button>
          <button
            className={`nav-item nav-link ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            Video
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
