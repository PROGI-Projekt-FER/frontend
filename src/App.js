import "./App.css";
import React from "react";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import CreateTicket from "./Components/CreateTicket/CreateTicket";
import Home from "./Components/Home/Home";
import { Provider } from "./Components/ui/provider";

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/createticket" element={<CreateTicket />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
