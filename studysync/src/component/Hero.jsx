import "./Hero.css";
import HomeStats from "./Homestats";
import { useNavigate } from "react-router-dom";

function Hero() {
const navigate=useNavigate()



  return (
    <section className="hero">
      <div className="hero-content">

        <div className="hero-left">
          <h1>
            Welcome to <span>Study sync</span> 👋
          </h1>

          <div className="hero-line"></div>

          <p>
            Stay focused, manage tasks,
            track study progress, and
            boost your productivity
            every day.
          </p>

          <div className="hero-buttons">
            <button className="start-btn"
            onClick={()=>navigate("/Pomodoro")}
            >
              Start Studying
            </button>


          </div>
        </div>

<HomeStats />


      </div>
    </section>
  );
}

export default Hero;