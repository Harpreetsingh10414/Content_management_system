import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./Display/ProductList";
import ProductForm from "./Admin/ProductForm";
import CreateChecksheet from "./Admin/CreateChecksheet";
import CreateStep from "./Admin/CreateStep";
import ToolsForm from "./Admin/ToolsForm";
import PartsForm from "./Admin/PartsForm";
import DosDontsForm from "./Admin/DosDontsForm";
import DocumentForm from "./Admin/DocumentForm";
import OnePointLesson from "./Admin/OnePointLesson";
import OnePointLessonList from "./Display/OnePointLessonList";
import DoDontsPage from "./Display/DosAndDontsList";
import Tabs from "./Display/Tabs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tabs />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/create-step" element={<CreateStep />} />
        <Route path="/add-tool" element={<ToolsForm />} />
        <Route path="/add-parts" element={<PartsForm />} />
        <Route path="/add-onepoint-lesson" element={<OnePointLesson />} />
        <Route path="/DoDonts" element={<DosDontsForm />} />
        <Route path="/Document-form" element={<DocumentForm />} />
        <Route path="/check-sheet-form" element={<CreateChecksheet />} />



        <Route path="/products" element={<ProductList />} />
        <Route path="/one-point-lesson" element={<OnePointLessonList />} />
        <Route path="/DoDontsPage" element={<DoDontsPage />} />

        <Route path="/tabs" element={<Tabs />} />
      </Routes>
    </Router>
  );
}

export default App;
