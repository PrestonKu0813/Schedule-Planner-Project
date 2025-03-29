import "./calendar.css";
import classes from "./classes.json";

// Helper: Calculate position as a percentage (8:00 AM = 0%, 10:00 PM = 100%)
const calculatePosition = (time) => {
  const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  let hour24 = parseInt(hour, 10) % 12 + (period === "PM" ? 12 : 0);
  if (hour24 < 8) hour24 += 12; // Ensure morning starts at 8 AM

  const totalMinutes = (hour24 - 8) * 60 + parseInt(minute, 10);
  return (totalMinutes / (14 * 60)) * 100; // 14 hours total (8 AM - 10 PM)
};

// Helper: Map day to grid position (Mon-Fri)
const dayToIndex = (day) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.indexOf(day);
};

function Calendar() {
  return (
    <div className="calendar">
      {/* Time Column (8 AM - 10 PM) */}
      <div className="calendar_time">
      <div className="calendar_spacer"></div>
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} className="calendar_hour">
            <p>{(i + 8) % 12 || 12}:00 {i + 8 >= 12 ? "PM" : "AM"}</p>
          
          </div>
        ))}
      </div>

      {/* Calendar Body (Mon-Fri) */}
      <div className="calendar_body">
        <div className="calendar_header">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
            <div key={day} className="calendar_days">
              <p>{day}</p>
            </div>
          ))}
        </div>

        {/* Class Display (From JSON File) */}
        <div className="calendar_classes">
          {classes.map((cls, index) => (
            <div
              key={index}
              className="calendar_class"
              style={{
                top: `${calculatePosition(cls.start)}%`,
                height: `${calculatePosition(cls.end) - calculatePosition(cls.start)}%`,
                left: `${dayToIndex(cls.day) * 20}%`,
              }}
            >
              {cls.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;