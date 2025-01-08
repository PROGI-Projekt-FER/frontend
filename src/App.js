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
import NavBar from "./Components/NavBar/NabBar";
import Profile from "./Components/Profile/Profile";
import ProfileEdit from "./Components/ProfileEdit/ProfileEdit";

function App() {
  return (
    <Provider>
      <Router>
      <NavBar />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/browse-tickets" element={<BrowseTickets />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
