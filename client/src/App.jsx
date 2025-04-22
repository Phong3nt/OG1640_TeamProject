import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";  // Đảm bảo đã import AuthProvider
import { Router } from "./routes"; // Đảm bảo Router là nơi chứa các route của bạn

function App() {
  return (
    <BrowserRouter>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </BrowserRouter>
  );
}

export default App;
