import React from "react";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import HealthCheck from "../components/HealthCheck";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Hero />
      <Features />
      <HealthCheck />
    </div>
  );
}
