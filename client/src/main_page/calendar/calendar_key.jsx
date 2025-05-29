// import "./calendar.css";

function Calendar_Key() {
  // IM SORRY ABOUT THIS DIV MONSTER

  return (
    // MAIN BODY
    <div className="calendar_key_container">
      {/* FIRST ROW */}
      <div className="calendar_key_rows">
        {/* BUSCH INDEX */}
        <div className="calendar_key_cols">
          {/* LEFT SIDE COLOR TAG */}
          <div className="calendar_key" id="busch" />
          <p id="text">Busch</p>
        </div>
        {/* LIVI INDEX */}
        <div className="calendar_key_cols">
          {/* LEFT SIDE COLOR TAG */}
          <div className="calendar_key" id="livi" />
          <p id="text">Livingston</p>
        </div>
        {/* ONLINE INDEX */}
        <div className="calendar_key_cols">
          {/* LEFT SIDE COLOR TAG */}
          <div className="calendar_key" id="online" />
          <p id="text">Online</p>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="calendar_key_rows">
        {/* COLLEGE AVE INDEX */}
        <div className="calendar_key_cols">
          {/* LEFT SIDE COLOR TAG */}
          <div className="calendar_key" id="CA" />
          <p id="text">College Ave</p>
        </div>
        {/* COOK DOUG INDEX */}
        <div className="calendar_key_cols">
          {/* LEFT SIDE COLOR TAG */}
          <div className="calendar_key" id="CD" />
          <p id="text">Cook/Doug</p>
        </div>
        {/* DOWNTOWN INDEX */}
        <div className="calendar_key_cols">
          {/* LEFT SIDE COLOR TAG */}
          <div className="calendar_key" id="downtown" />
          <p id="text">Downtown</p>
        </div>
      </div>
    </div>
  );
}

export default Calendar_Key;
