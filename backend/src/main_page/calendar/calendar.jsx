import "./calendar.css";

function Calendar() {
  return (
    <div className="calendar">
      <div className="calendar_time">
        <div className="calendar_hours">
          <div className="calendar_hour">
            <p>8:00 am</p>
          </div>
          <div className="calendar_hour">
            <p>9:00 am</p>
          </div>
          <div className="calendar_hour">
            <p>10:00 am</p>
          </div>
          <div className="calendar_hour">
            <p>11:00 am</p>
          </div>
          <div className="calendar_hour">
            <p>12:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>1:00 pm</p>
          </div>
          <div className="calendar_hour">
            <div className="calendar_hour_box">
              <p>2:00 pm</p>
            </div>
          </div>
          <div className="calendar_hour">
            <div className="calendar_hour_box">
              <p>3:00 pm</p>
            </div>
          </div>
          <div className="calendar_hour">
            <p>4:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>5:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>6:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>7:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>8:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>9:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>10:00 pm</p>
          </div>
          <div className="calendar_hour">
            <p>11:00 pm</p>
          </div>
        </div>
      </div>

      <div className="calendar_body">
        <div className="calendar_header">
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
        <div className="calendar_classes"></div>
      </div>
    </div>
  );
}

export default Calendar;
