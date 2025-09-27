// import "./calendar.css";

function Calendar_Key() {
  // IM SORRY ABOUT THIS DIV MONSTER

  return (
    // MAIN BODY
    <div className="calendar_key_container">
        <div className="calendar_key_rows">
          {/* BUSCH INDEX */}
          <div className="calendar_key">
            <div className="calendar_key_color" id="busch"/>
            <p id="text">Busch</p>
          </div>
          {/* LIVI INDEX */}

          <div className="calendar_key">
            <div className="calendar_key_color" id="livi"/>
            <p id="text">Livingston</p>
          </div>

          {/* ONLINE INDEX */}

          <div className="calendar_key">
            <div className="calendar_key_color" id="online"/>
            <p id="text">Online</p>
          </div>
        </div>

        {/* SECOND ROW */}
        <div className="calendar_key_rows">
          {/* COLLEGE AVE INDEX */}

          <div className="calendar_key">
            <div className="calendar_key_color" id="CA"/>
            <p id="text">College Ave</p>
          </div>
          {/* COOK DOUG INDEX */}

          <div className="calendar_key">
            <div className="calendar_key_color" id="CD"/>
            <p id="text">Cook/Douglass</p>
          </div>
          {/* DOWNTOWN INDEX */}

          <div className="calendar_key">
            <div className="calendar_key_color" id="downtown"/>
            <p id="text">Downtown</p>
          </div>
        </div>
      </div>
  );
}

export default Calendar_Key;
