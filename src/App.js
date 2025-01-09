import "./App.css";
import React from "react";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateTicket from "./Components/CreateEditTicket/CreateTicket";
import EditTicket from "./Components/CreateEditTicket/EditTicket";
import BrowseTickets from "./Components/BrowseTickets/BrowseTickets";
import Home from "./Components/Home/Home";
import { Provider } from "./Components/ui/provider";
import NavBar from "./Components/NavBar/NabBar";
import Test from "./Components/test/Test";
import TicketDetails from "./Components/TicketDetails/TicketDetails";
import MyTickets from "./Components/MyTickets/MyTickets";

function App() {
  return (
    <Provider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/edit-ticket/:slug" element={<EditTicket />} />
          <Route path="/browse-tickets" element={<BrowseTickets />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/test" element={<Test />} />
          <Route path="/tickets/:slug" element={<TicketDetails />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
