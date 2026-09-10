import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Background from "./components/Background";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Career from "./pages/Career";
import Progress from "./pages/Progress";
import Saved from "./pages/Saved";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Background />

        <Navbar />

        <main className="page-container">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route
              path="/learn"
              element={<Learn />}
            />

            <Route
              path="/career"
              element={<Career />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/saved"
              element={<Saved />}
            />
            {/* <Route
  path="/profile"
  element={<Profile />} */}


          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;