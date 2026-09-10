import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Background from "./components/Background";
import AIChatCard from "./components/AIChatCard";
import { ChatCardProvider } from "./context/ChatCardContext";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Career from "./pages/Career";
import Progress from "./pages/Progress";
import Saved from "./pages/Saved";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <ChatCardProvider>
        <div className="app">
          <Background />
          <Navbar />

          <main className="page-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/career" element={<Career />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>

          <AIChatCard />
        </div>
      </ChatCardProvider>
    </BrowserRouter>
  );
}

export default App;