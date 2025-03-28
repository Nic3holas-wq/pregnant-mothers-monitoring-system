import React from "react";
import theme from "../../utils/theme";

const Footer = () => {
  return (
    <footer style={{ 
      position: "relative", 
      bottom: 0, 
      fontWeight: "bold",
      width: "100%", 
      textAlign: "center", 
      padding: "10px", 
      background: theme.primary, 
      color: "white" 
    }}>
      Afya Bora © {new Date().getFullYear()} All rights reserved.
    </footer>
  );
};

export default Footer;
