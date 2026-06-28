import "./StatsCard.css";
import {
  FaTasks,
  FaClock,
  FaStickyNote,
  FaChartBar,
  FaCalendarCheck,
} from "react-icons/fa";

function StatsCard() {
  const features = [
    {
      title: "Task Manager",
      desc: "Manage daily study tasks easily",
      icon: <FaTasks />,
    },
    {
      title: "Pomodoro Timer",
      desc: "Stay focused using study sessions",
      icon: <FaClock />,
    },
    {
      title: "Notes",
      desc: "Save quick study notes anytime",
      icon: <FaStickyNote />,
    },
    {
      title: "Calendar",
      desc: "Mark your important dates",
      icon: <FaCalendarCheck />,
    },
    {
      title: "Analytics",
      desc: "See your productivity insights",
      icon: <FaChartBar />,
    },
  ];

  return (
    <section className="features">
      {/* <h2>Explore<span>Features</span> </h2> */}

      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsCard;