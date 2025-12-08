import React, { useState, useEffect } from "react";
import "./selected_courses.css";
import searchFilter from "../enums/search_filter.js";

function Selected_Courses({
  courses,
  setCourses,
  setActiveTab,
  setInfo,
  setSpecialFilters,
  specialFilters,
}) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [showCampus, setShowCampus] = useState(false);
  const [showSectionStatus, setShowSectionStatus] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const [showCoreCode, setShowCoreCode] = useState(false);
  const [showTimeRange, setShowTimeRange] = useState(false);
  const [showWeekDays, setShowWeekDays] = useState(false);

  const { campus } = searchFilter;
  const { credit } = searchFilter;
  const { coreCode } = searchFilter;
  const { timeRanges } = searchFilter;
  const { weekDays } = searchFilter;

  const [customTimeRangesStr, setCustomTimeRangesStr] = useState("");
  const [customTimeRanges, setCustomTimeRanges] = useState([]);
  const parseCustomTimeRanges = (str) => {
    const ranges = str.split(",").map((range) => range.trim());
    const parsedRanges = [];
    ranges.forEach((range) => {
      const [startStr, endStr] = range.split("-").map((s) => s.trim());
      const parseHour = (timeStr) => {
        if (typeof timeStr !== "string") return -1;
        let [h, m] =
          timeStr
            .toLowerCase()
            .replace(/[^0-9apm]/g, "")
            .match(/^(\d{1,2})(?::?(\d{2}))?(am|pm)?$/)
            ?.slice(1) || [];
        h = parseInt(h, 10);
        m = m ? parseInt(m, 10) : 0;
        if (isNaN(h) || h < 1 || h > 12 || isNaN(m) || m < 0 || m >= 60)
          return -1;
        if (h === 12) h = 0; // Convert 12 AM to 0
        if (timeStr.toLowerCase().includes("pm")) h += 12; // Convert PM to 24-hour format
        return h + m / 60;
      };
      const startHour = parseHour(startStr);
      const endHour = parseHour(endStr);
      if (startHour !== -1 && endHour !== -1 && startHour < endHour) {
        parsedRanges.push([startHour, endHour]);
      }
    });
    return parsedRanges;
  };

  // Generalized add to filter
  const addToFilter = (filterKey, value) => {
    setSpecialFilters((prev) => ({
      ...prev,
      [filterKey]: [...prev[filterKey], value],
    }));
  };

  // Generalized remove from filter
  const removeFromFilter = (filterKey, value) => {
    setSpecialFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey].filter((item) => item !== value),
    }));
  };

  const Checkbox = ({ label, isChecked, onClick }) => (
    <label className="filter-checkbox">
      {label}
      <button
        className={`filter-button ${isChecked ? "selected" : ""}`}
        onClick={onClick}
        type="button"
      ></button>
    </label>
  );

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleChangeTimeRangesStr = (event) => {
    customTimeRanges.forEach((customRange) => {
      removeFromFilter("timeRanges", customRange);
    });
    const newValue = event.target.value;
    setCustomTimeRangesStr(newValue);
    const parsed = parseCustomTimeRanges(newValue); // <-- use new value
    setCustomTimeRanges(parsed);
    parsed.forEach((customRange) => {
      addToFilter("timeRanges", customRange);
    });
  };

  return (
    <div className={`selected_courses ${isMinimized ? "minimized" : ""}`}>
      {/* Minimize Button - positioned at the top right */}
      <button className="minimize_button" onClick={toggleMinimize}>
        {isMinimized ? ">" : "<"}
      </button>

      {/* Content only renders if not minimized */}
      {!isMinimized && (
        <div className="content_box">
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.08em",
              marginBottom: "0.6em",
            }}
          >
            Additional Filters
          </div>
          {/* Section Status Filter Dropdown */}
          <div className="filter-section">
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                background: "none",
                border: "none",
                width: "100%",
                padding: 0,
                marginBottom: showSectionStatus ? "0.3em" : 0,
              }}
              onClick={() => setShowSectionStatus((prev) => !prev)}
            >
              <h4 style={{ margin: 0, flex: 1, pointerEvents: "none" }}>
                Status (Open/Closed)
              </h4>
              <span style={{ fontSize: "1.1em" }}>
                {showSectionStatus ? "▲" : "▼"}
              </span>
            </button>
            {showSectionStatus && (
              <div>
                <Checkbox
                  label="Open"
                  isChecked={specialFilters.sectionStatus?.includes("open")}
                  onClick={() => {
                    if (specialFilters.sectionStatus?.includes("open")) {
                      removeFromFilter("sectionStatus", "open");
                    } else {
                      addToFilter("sectionStatus", "open");
                    }
                  }}
                />
                <Checkbox
                  label="Closed"
                  isChecked={specialFilters.sectionStatus?.includes("closed")}
                  onClick={() => {
                    if (specialFilters.sectionStatus?.includes("closed")) {
                      removeFromFilter("sectionStatus", "closed");
                    } else {
                      addToFilter("sectionStatus", "closed");
                    }
                  }}
                />
              </div>
            )}
          </div>
          {/* Campus Filter Dropdown */}
          <div className="filter-section">
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                background: "none",
                border: "none",
                width: "100%",
                padding: 0,
                marginBottom: showCampus ? "0.3em" : 0,
              }}
              onClick={() => setShowCampus((prev) => !prev)}
            >
              <h4 style={{ margin: 0, flex: 1, pointerEvents: "none" }}>
                Campus
              </h4>
              <span style={{ fontSize: "1.1em" }}>
                {showCampus ? "▲" : "▼"}
              </span>
            </button>
            {showCampus && (
              <div>
                <Checkbox
                  label="Busch"
                  isChecked={specialFilters.campus.includes(campus.BU)}
                  onClick={() => {
                    if (specialFilters.campus.includes(campus.BU)) {
                      removeFromFilter("campus", campus.BU);
                    } else {
                      addToFilter("campus", campus.BU);
                    }
                  }}
                />
                <Checkbox
                  label="Livingston"
                  isChecked={specialFilters.campus.includes(campus.LI)}
                  onClick={() => {
                    if (specialFilters.campus.includes(campus.LI)) {
                      removeFromFilter("campus", campus.LI);
                    } else {
                      addToFilter("campus", campus.LI);
                    }
                  }}
                />
                <Checkbox
                  label="College Avenue"
                  isChecked={specialFilters.campus.includes(campus.CA)}
                  onClick={() => {
                    if (specialFilters.campus.includes(campus.CA)) {
                      removeFromFilter("campus", campus.CA);
                    } else {
                      addToFilter("campus", campus.CA);
                    }
                  }}
                />
                <Checkbox
                  label="Cook/Douglass"
                  isChecked={specialFilters.campus.includes(campus.CD)}
                  onClick={() => {
                    if (specialFilters.campus.includes(campus.CD)) {
                      removeFromFilter("campus", campus.CD);
                    } else {
                      addToFilter("campus", campus.CD);
                    }
                  }}
                />
                <Checkbox
                  label="Async"
                  isChecked={
                    specialFilters.campus.includes(campus.ASYNC) ||
                    specialFilters.campus.includes(campus.ON)
                  }
                  onClick={() => {
                    if (
                      specialFilters.campus.includes(campus.ASYNC) ||
                      specialFilters.campus.includes(campus.ON)
                    ) {
                      removeFromFilter("campus", campus.ASYNC);
                      removeFromFilter("campus", campus.ON);
                    } else {
                      addToFilter("campus", campus.ASYNC);
                      addToFilter("campus", campus.ON);
                    }
                  }}
                />
              </div>
            )}
          </div>
          {/* Credit Filter Dropdown */}
          <div className="filter-section">
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                background: "none",
                border: "none",
                width: "100%",
                padding: 0,
                marginBottom: showCredit ? "0.3em" : 0,
              }}
              onClick={() => setShowCredit((prev) => !prev)}
            >
              <h4 style={{ margin: 0, flex: 1, pointerEvents: "none" }}>
                Credits
              </h4>
              <span style={{ fontSize: "1.1em" }}>
                {showCredit ? "▲" : "▼"}
              </span>
            </button>
            {showCredit && (
              <div>
                <Checkbox
                  label="One"
                  isChecked={specialFilters.credit.includes(credit.ONE)}
                  onClick={() => {
                    if (specialFilters.credit.includes(credit.ONE)) {
                      removeFromFilter("credit", credit.ONE);
                    } else {
                      addToFilter("credit", credit.ONE);
                    }
                  }}
                />
                <Checkbox
                  label="Two"
                  isChecked={specialFilters.credit.includes(credit.TWO)}
                  onClick={() => {
                    if (specialFilters.credit.includes(credit.TWO)) {
                      removeFromFilter("credit", credit.TWO);
                    } else {
                      addToFilter("credit", credit.TWO);
                    }
                  }}
                />
                <Checkbox
                  label="Three"
                  isChecked={specialFilters.credit.includes(credit.THREE)}
                  onClick={() => {
                    if (specialFilters.credit.includes(credit.THREE)) {
                      removeFromFilter("credit", credit.THREE);
                    } else {
                      addToFilter("credit", credit.THREE);
                    }
                  }}
                />
                <Checkbox
                  label="Four"
                  isChecked={specialFilters.credit.includes(credit.FOUR)}
                  onClick={() => {
                    if (specialFilters.credit.includes(credit.FOUR)) {
                      removeFromFilter("credit", credit.FOUR);
                    } else {
                      addToFilter("credit", credit.FOUR);
                    }
                  }}
                />
                <Checkbox
                  label="CBA/NA"
                  isChecked={
                    specialFilters.credit.includes(credit.CBA) ||
                    specialFilters.credit.includes(credit.NA)
                  }
                  onClick={() => {
                    if (
                      specialFilters.credit.includes(credit.CBA) ||
                      specialFilters.credit.includes(credit.NA)
                    ) {
                      removeFromFilter("credit", credit.CBA);
                      removeFromFilter("credit", credit.NA);
                    } else {
                      addToFilter("credit", credit.CBA);
                      addToFilter("credit", credit.NA);
                    }
                  }}
                />
              </div>
            )}
          </div>
          {/* Core Code Filter Dropdown */}
          <div className="filter-section">
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                background: "none",
                border: "none",
                width: "100%",
                padding: 0,
                marginBottom: showCoreCode ? "0.3em" : 0,
              }}
              onClick={() => setShowCoreCode((prev) => !prev)}
            >
              <h4 style={{ margin: 0, flex: 1, pointerEvents: "none" }}>
                Core Code
              </h4>
              <span style={{ fontSize: "1.1em" }}>
                {showCoreCode ? "▲" : "▼"}
              </span>
            </button>
            {showCoreCode && (
              <div>
                {Object.entries(coreCode).map(([key, label]) => (
                  <Checkbox
                    key={key}
                    label={label}
                    isChecked={specialFilters.coreCode.includes(key)}
                    onClick={() => {
                      if (specialFilters.coreCode.includes(key)) {
                        removeFromFilter("coreCode", key);
                      } else {
                        addToFilter("coreCode", key);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Time Range Filter Dropdown */}
          <div className="filter-section">
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                background: "none",
                border: "none",
                width: "100%",
                padding: 0,
                marginBottom: showTimeRange ? "0.3em" : 0,
              }}
              onClick={() => setShowTimeRange((prev) => !prev)}
            >
              <h4 style={{ margin: 0, flex: 1, pointerEvents: "none" }}>
                Time Range
              </h4>
              <span style={{ fontSize: "1.1em" }}>
                {showTimeRange ? "▲" : "▼"}
              </span>
            </button>
            {showTimeRange && (
              <div>
                <Checkbox
                  label="Morning (7am-12pm)"
                  isChecked={specialFilters.timeRanges.some(
                    (range) =>
                      Array.isArray(range) &&
                      range[0] === timeRanges.MORNING[0] &&
                      range[1] === timeRanges.MORNING[1]
                  )}
                  onClick={() => {
                    const exists = specialFilters.timeRanges.some(
                      (range) =>
                        Array.isArray(range) &&
                        range[0] === timeRanges.MORNING[0] &&
                        range[1] === timeRanges.MORNING[1]
                    );
                    if (exists) {
                      removeFromFilter("timeRanges", timeRanges.MORNING);
                    } else {
                      addToFilter("timeRanges", timeRanges.MORNING);
                    }
                  }}
                />
                <Checkbox
                  label="Afternoon (12pm-6pm)"
                  isChecked={specialFilters.timeRanges.some(
                    (range) =>
                      Array.isArray(range) &&
                      range[0] === timeRanges.AFTERNOON[0] &&
                      range[1] === timeRanges.AFTERNOON[1]
                  )}
                  onClick={() => {
                    const exists = specialFilters.timeRanges.some(
                      (range) =>
                        Array.isArray(range) &&
                        range[0] === timeRanges.AFTERNOON[0] &&
                        range[1] === timeRanges.AFTERNOON[1]
                    );
                    if (exists) {
                      removeFromFilter("timeRanges", timeRanges.AFTERNOON);
                    } else {
                      addToFilter("timeRanges", timeRanges.AFTERNOON);
                    }
                  }}
                />
                <Checkbox
                  label="Evening (6pm-10pm)"
                  isChecked={specialFilters.timeRanges.some(
                    (range) =>
                      Array.isArray(range) &&
                      range[0] === timeRanges.EVENING[0] &&
                      range[1] === timeRanges.EVENING[1]
                  )}
                  onClick={() => {
                    const exists = specialFilters.timeRanges.some(
                      (range) =>
                        Array.isArray(range) &&
                        range[0] === timeRanges.EVENING[0] &&
                        range[1] === timeRanges.EVENING[1]
                    );
                    if (exists) {
                      removeFromFilter("timeRanges", timeRanges.EVENING);
                    } else {
                      addToFilter("timeRanges", timeRanges.EVENING);
                    }
                  }}
                />
                {"Enter Custom Ranges (Hours Only):"}
                <input
                  type="text"
                  placeholder='Format: "9am-11am,1pm-3pm"'
                  value={customTimeRangesStr}
                  onChange={handleChangeTimeRangesStr}
                />
              </div>
            )}
          </div>
          {/* Week Days Filter Dropdown */}
          <div className="filter-section">
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                background: "none",
                border: "none",
                width: "100%",
                padding: 0,
                marginBottom: showWeekDays ? "0.3em" : 0,
              }}
              onClick={() => setShowWeekDays((prev) => !prev)}
            >
              <h4 style={{ margin: 0, flex: 1, pointerEvents: "none" }}>
                Week Days
              </h4>
              <span style={{ fontSize: "1.1em" }}>
                {showWeekDays ? "▲" : "▼"}
              </span>
            </button>
            {showWeekDays && (
              <div>
                {Object.entries(weekDays).map(([key, label]) => (
                  <Checkbox
                    key={key}
                    label={label}
                    isChecked={specialFilters.weekDays.includes(key)}
                    onClick={() => {
                      if (specialFilters.weekDays.includes(key)) {
                        removeFromFilter("weekDays", key);
                      } else {
                        addToFilter("weekDays", key);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Selected_Courses;
