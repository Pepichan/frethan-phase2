import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      <Hero />
      <Features />
    </div>
  );
}
