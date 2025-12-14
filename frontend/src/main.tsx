<<<<<<< HEAD
import React from "react";
import ReactDOM from "react-dom/client";
import "@fortawesome/fontawesome-free/css/all.min.css";
import RFQ from "./pages/RFQ";
import "./styles/rfq.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RFQ />
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
>>>>>>> e194e3da7bb8e6052e458b673bae5afb385d4f02
  </React.StrictMode>
);
