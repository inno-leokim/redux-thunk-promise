import React from "react";
import { Route, Routes } from "react-router-dom";
import PostPage from "./pages/PostPage";
import PostListPage from "./pages/PostListPage";

function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<PostListPage />}/>
        <Route path="/:id" element={<PostPage />}/>
      </Routes>
    </div>
  );
}

export default App;





