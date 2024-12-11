import { Link } from "react-router-dom";
import "./homepage.css";

function HomePage() {
  return (
    <div className="homepage">
      <div className="left">
        <h1>Linkly</h1>
        <h2> AI-powered networking companion designed to help users connect, practice professional conversations, and receive personalized feedback to enhance their networking skills.</h2>
        <Link to="/dashboard" className="btn-start">
          Get Started
        </Link>
      </div>
      <div className="terms">
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;