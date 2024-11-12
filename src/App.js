import "./App.css";
import React from "react";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import CreateTicket from "./Components/CreateTicket/CreateTicket";
import BrowseTickets from "./Components/BrowseTickets/BrowseTickets";
import Home from "./Components/Home/Home";
import { Provider } from "./Components/ui/provider";

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/browse-tickets" element={<BrowseTickets />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
