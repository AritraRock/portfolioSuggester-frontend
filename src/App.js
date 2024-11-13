import React from "react";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  return (
    <BrowserRouter>
        <AuthProvider> {/* Wrap your app with AuthProvider to provide context */}
            {/* <div className="min-h-screen bg-gray-300 flex-row justify-center items-center">
              <div className="text-4xl text-blue-600 font-bold flex">
                <p className="mx-auto">
                  Welcome to 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:scale-110 hover:rotate-3 transition-all duration-300"> Portfolio Suggester</span>
                </p>
              </div> */}
              <Routes>
                <Route path="/register" element={<Register />} />  {/* Default route for Register */}
                <Route path="/" element={<Register />} />  {/* Default route for Register */}
                <Route path="/login" element={<Login />} />  {/* Route for Login */}
                <Route path="/home" element={<Home />} />  {/* Route for Login */} 
              </Routes>
            {/* </div> */}
        </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
