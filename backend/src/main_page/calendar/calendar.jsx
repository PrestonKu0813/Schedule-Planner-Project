import "./calendar.css";

function Calendar() {
  return (
    <div className="calendar">
      <div className="header">
        <div className="calendar_days_first">
          <p>Hours</p>
        </div>
        <div className="calendar_days">
          <p>Mon.</p>
        </div>
        <div className="calendar_days">
          <p>Tues.</p>
        </div>
        <div className="calendar_days">
          <p>Wed.</p>
        </div>
        <div className="calendar_days">
          <p>Thurs.</p>
        </div>
        <div className="calendar_days">
          <p>Fri.</p>
        </div>
        <div className="calendar_days">
          <p>Sat.</p>
        </div>
        <div className="calendar_days">
          <p>Sun.</p>
        </div>
      </div>
      <div className="body">
        <div className="calendar_hour_first"></div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>8:00 am</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>9:00 am</p>
          </div>
        </div>
        <div className="calendar_box">
          <p>10:00 am</p>
        </div>
        <div className="calendar_hour"></div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>11:00 am</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>12:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>1:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>2:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>3:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>4:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>5:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>6:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>7:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>8:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>9:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>10:00 pm</p>
          </div>
        </div>
        <div className="calendar_hour">
          <div className="calendar_box">
            <p>11:00 pm</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
