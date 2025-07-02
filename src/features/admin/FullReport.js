import React, { useEffect, useState, useMemo, useCallback } from "react";
import "../../styles/full-report.css"
import {
  FaUserPlus,
  FaClipboardCheck,
  FaUsers,
  FaTimesCircle,
  FaCalendarCheck,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import "../../styles/admin.css";
import {
  exportToExcel,
  exportToCSV,
  exportToPDF,
} from "../../utils/exportUtils";
import { useApi } from "../../context/ApiContext";

/* ──────────────────────────────────────────────────────────── */
/*                          CONSTANTS                           */
/* ──────────────────────────────────────────────────────────── */

const CARDS = [
  { key: "fresh", icon: <FaUserPlus />, label: "Fresh Leads" },
  { key: "followUp", icon: <FaClipboardCheck />, label: "Follow-Ups" },
  { key: "converted", icon: <FaUsers />, label: "Converted Clients" },
  { key: "closed", icon: <FaTimesCircle />, label: "Closed Clients" },
  { key: "meetings", icon: <FaCalendarCheck />, label: "Meetings" },
];

const TABLE_HEADERS = {
  fresh: ["Name", "Email", "Phone", "Status"],
  followUp: ["Name", "Email", "Phone", "Status", "View"],
  converted: ["Name", "Email", "Phone", "Status", "View"],
  closed: ["Name", "Email", "Phone", "Status", "View"],
  meetings: ["Client", "Email", "Phone", "Start", "End"],
};

/* ──────────────────────────────────────────────────────────── */
/*                          COMPONENT                           */
/* ──────────────────────────────────────────────────────────── */

const FullReport = () => {
  /* ========== context fns ========== */
  const {
    /* generic */
    fetchExecutivesAPI,
    /* single-exec APIs */
    fetchAssignedLeads,
    fetchFollowUpsByExecutive,
    fetchConvertedByExecutive,
    fetchClosedByExecutive,
    fetchMeetingsByExecutive,
  } = useApi();

  /* ========== helpers ========== */
  const getExecId = (ex) => (ex?._id ?? ex?.id ?? ex?.ID ?? "").toString();

  /* ─────────────────────────────────── SINGLE MODE ─────────────────────────────────── */

  const [executives, setExecutives] = useState([]);
  const [selectedExec, setSelectedExec] = useState(null);

  /* raw responses for table */
  const [raw, setRaw] = useState({
    fresh: [],
    followUps: [],
    converted: [],
    closed: [],
    meetings: [],
  });

  /* counts for cards */
  const [counts, setCounts] = useState({
    fresh: 0,
    followUp: 0,
    converted: 0,
    closed: 0,
    meetings: 0,
  });

  /* which card’s table is open */
  const [activeCard, setActiveCard] = useState("");

  /* fetch single-exec data */
  const pullSingleExecData = useCallback(
    async (exec) => {
      if (!exec) return;

      const [
        freshLeads,
        followUpsRaw,
        convertedRaw,
        closedRaw,
        meetingsRaw,
      ] = await Promise.all([
        fetchAssignedLeads(exec.username),
        fetchFollowUpsByExecutive(exec.username),
        fetchConvertedByExecutive(exec.username),
        fetchClosedByExecutive(exec.username),
        fetchMeetingsByExecutive(exec.username),
      ]);

      /* group follow-ups by fresh_lead_id & keep only latest */
      const fuMap = {};
      (followUpsRaw || []).forEach((f) => {
        fuMap[f.fresh_lead_id] = f;
      });
      const followUpGrouped = Object.values(fuMap).filter(
        (f) => (f.clientLeadStatus || "").toLowerCase() === "follow-up"
      );

      /* update counts + raw cache */
      setCounts({
        fresh: (freshLeads || []).filter(
          (l) =>
            ["new", "assigned"].includes((l.status || "").toLowerCase()) ||
            ["new", "assigned"].includes(
              (l.clientLead?.status || "").toLowerCase()
            )
        ).length,
        followUp: followUpGrouped.length,
        converted: (convertedRaw || []).length,
        closed: (closedRaw || []).length,
        meetings: (meetingsRaw || []).length,
      });

      setRaw({
        fresh: freshLeads || [],
        followUps: followUpsRaw || [],
        converted: convertedRaw || [],
        closed: closedRaw || [],
        meetings: meetingsRaw || [],
      });

      setActiveCard(""); // reset table view
    },
    [
      fetchAssignedLeads,
      fetchFollowUpsByExecutive,
      fetchConvertedByExecutive,
      fetchClosedByExecutive,
      fetchMeetingsByExecutive,
    ]
  );

  /* table rows generator */
  const getTableRows = () => {
    if (!activeCard) return [];

    if (activeCard === "followUp") {
      const unique = {};
      raw.followUps.forEach((f) => {
        if (
          (f.clientLeadStatus || "").toLowerCase() === "follow-up" &&
          !unique[f.fresh_lead_id]
        ) {
          unique[f.fresh_lead_id] = {
            id: f.fresh_lead_id,
            name: f.freshLead?.name || "",
            email: f.freshLead?.email || "",
            phone: f.freshLead?.phone || "",
            status: f.clientLeadStatus,
          };
        }
      });
      return Object.values(unique);
    }

    if (activeCard === "converted")
      return raw.converted.map((c) => ({
        id: c.fresh_lead_id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: "Converted",
      }));

    if (activeCard === "closed")
      return raw.closed.map((c) => ({
        id: c.fresh_lead_id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: "Closed",
      }));

    if (activeCard === "fresh") return raw.fresh;
    if (activeCard === "meetings") return raw.meetings;
    return [];
  };

  /* FOLLOW-UP HISTORY MODAL */
  const [historyModal, setHistoryModal] = useState({
    open: false,
    clientName: "",
    items: [],
  });

  const openHistory = (freshLeadId, clientName) => {
    const items = raw.followUps.filter((f) => f.fresh_lead_id === freshLeadId);
    setHistoryModal({ open: true, clientName, items });
  };
  const closeHistory = () =>
    setHistoryModal({ open: false, clientName: "", items: [] });

  /* EXPORT HANDLER */
  const handleExport = (type) => {
    const data = getTableRows();
    if (!data.length) return;

    const fileName = `${selectedExec?.username || "Executive"}_${activeCard}`;
    const keys = TABLE_HEADERS[activeCard]
      .map((h) => h.toLowerCase())
      .filter((k) => k !== "view");

    const formatted = data.map((row) =>
      Object.fromEntries(keys.map((k) => [k, row[k] || ""]))
    );

    if (type === "excel") exportToExcel(formatted, fileName);
    else if (type === "csv") exportToCSV(formatted, fileName);
    else if (type === "pdf") exportToPDF(formatted, fileName, keys);
  };

  /* ─────────────────────────────────── COMPARE MODE ─────────────────────────────────── */

  const [compareMode, setCompareMode] = useState(false);
  const [selectedExecs, setSelectedExecs] = useState([]); // up to 5
  const [compareStats, setCompareStats] = useState({});
  const [activeRadar, setActiveRadar] = useState("");

  /* fetch stats for one exec */
  const fetchStats = useCallback(
    async (username) => {
      const [fresh, fu, conv, closed, meet] = await Promise.all([
        fetchAssignedLeads(username),
        fetchFollowUpsByExecutive(username),
        fetchConvertedByExecutive(username),
        fetchClosedByExecutive(username),
        fetchMeetingsByExecutive(username),
      ]);

      const fuMap = {};
      fu.forEach((f) => (fuMap[f.fresh_lead_id] = f));
      const fuGrouped = Object.values(fuMap).filter(
        (f) => (f.clientLeadStatus || "").toLowerCase() === "follow-up"
      );

      return {
        fresh: fresh.filter(
          (l) =>
            ["new", "assigned"].includes((l.status || "").toLowerCase()) ||
            ["new", "assigned"].includes(
              (l.clientLead?.status || "").toLowerCase()
            )
        ).length,
        followUp: fuGrouped.length,
        converted: conv.length,
        closed: closed.length,
        meetings: meet.length,
      };
    },
    [
      fetchAssignedLeads,
      fetchFollowUpsByExecutive,
      fetchConvertedByExecutive,
      fetchClosedByExecutive,
      fetchMeetingsByExecutive,
    ]
  );

  const applyCompare = async () => {
    if (selectedExecs.length < 2) {
      alert("Select at least 2 executives");
      return;
    }
    const statObj = {};
    await Promise.all(
      selectedExecs.map(async (ex) => {
        statObj[ex.username] = await fetchStats(ex.username);
      })
    );
    setCompareStats(statObj);
    setActiveRadar(selectedExecs[0]?.username || "");
  };

  /* delta util */
  const getDelta = (base, target) => {
    if (base === 0 && target === 0) return "0%";
    const diff = ((target - base) / (base || 1)) * 100;
    return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  /* bar data */
  const barData = useMemo(() => {
    return CARDS.map(({ key, label }) => {
      const row = { name: label };
      selectedExecs.forEach((ex) => {
        row[ex.username] = compareStats?.[ex.username]?.[key] || 0;
      });
      return row;
    });
  }, [compareStats, selectedExecs]);

  /* radar data */
  const radarData = useMemo(() => {
    if (!activeRadar || !compareStats[activeRadar]) return [];
    return CARDS.map(({ key, label }) => ({
      category: label,
      value: compareStats[activeRadar]?.[key] || 0,
    }));
  }, [activeRadar, compareStats]);

  /* ─────────────────────────────────── EFFECTS ─────────────────────────────────── */

  /* load exec list once */
  useEffect(() => {
    (async () => {
      const execs = await fetchExecutivesAPI();
      setExecutives(execs || []);
    })();
  }, [fetchExecutivesAPI]);

  /* fetch data for single exec whenever changed */
  useEffect(() => {
    if (!compareMode && selectedExec) pullSingleExecData(selectedExec);
  }, [selectedExec, compareMode, pullSingleExecData]);

  /* ─────────────────────────────────── UI HELPERS ─────────────────────────────────── */

  const isChecked = (id) =>
    selectedExecs.some((x) => getExecId(x) === id.toString());

  const toggleExecCheckbox = (id) => {
    const found = executives.find((x) => getExecId(x) === id);
    if (!found) return;

    setSelectedExecs((prev) => {
      const exists = prev.some((x) => getExecId(x) === id);
      if (exists) return prev.filter((x) => getExecId(x) !== id);
      if (prev.length >= 5) {
        alert("You can compare up to 5 executives only.");
        return prev;
      }
      return [...prev, found];
    });
  };

  /* rows renderer for single-exec table */
  const renderRow = (row, idx) => {
    switch (activeCard) {
      case "fresh":
        return (
          <tr key={idx}>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.phone}</td>
            <td>{row.status || row.clientLead?.status}</td>
          </tr>
        );

      case "followUp":
      case "converted":
      case "closed":
        return (
          <tr key={idx}>
            <td>{row.name}</td>
            <td>{row.email}</td>
            <td>{row.phone}</td>
            <td>{row.status}</td>
            <td style={{ textAlign: "center" }}>
              <FaEye
                className="fullreport-eye-icon"
                onClick={() => openHistory(row.id, row.name)}
              />
            </td>
          </tr>
        );

      case "meetings":
        return (
          <tr key={idx}>
            <td>{row.clientName}</td>
            <td>{row.clientEmail}</td>
            <td>{row.clientPhone}</td>
            <td>{new Date(row.startTime).toLocaleString()}</td>
            <td>
              {row.endTime ? new Date(row.endTime).toLocaleString() : "-"}
            </td>
          </tr>
        );

      default:
        return null;
    }
  };

  /* generate HSL color for bars */
  const barColor = (idx) => `hsl(${(idx * 60) % 360}, 70%, 60%)`;

  /* ─────────────────────────────────── JSX ─────────────────────────────────── */

  return (
    <div className="admin-full-report">
      <h2>{compareMode ? "Compare Executives" : "Full Report"}</h2>

      {/* ───────────── Selector Section ───────────── */}
      {!compareMode && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom:"1rem" }}>
          <select
            value={selectedExec ? getExecId(selectedExec) : ""}
            onChange={(e) => {
              const exec = executives.find(
                (x) => getExecId(x) === e.target.value
              );
              setSelectedExec(exec || null);
            }}
            className="fullreport-admin-dropdown"
          >
            <option value="">-- Select Executive --</option>
            {executives.map((ex) => (
              <option key={getExecId(ex)} value={getExecId(ex)}>
                {ex.username}
              </option>
            ))}
          </select>

          <button className="fullreport-compare-btn" onClick={() => setCompareMode(true)}>
            Compare
          </button>
        </div>
      )}

      {/* ───────────── Single Exec View ───────────── */}
      {!compareMode && selectedExec && (
        <>
          {/* cards */}
          <div className="card-grid">
            {CARDS.map(({ key, icon, label }) => (
              <div
                key={key}
                className={`report-card ${
                  activeCard === key ? "active" : ""
                }`}
                onClick={() =>
                  setActiveCard((prev) => (prev === key ? "" : key))
                }
              >
                {icon}
                <div className="count">{counts[key]}</div>
                <div className="label">{label}</div>
              </div>
            ))}
          </div>

          {/* table */}
          {activeCard && (
            <>
              <div className="table-actions">
                <h3 style={{ margin: 0 }}>
                  {CARDS.find((c) => c.key === activeCard).label}
                </h3>
                <div>
                  <button onClick={() => handleExport("excel")}>Excel</button>
                  <button onClick={() => handleExport("csv")}>CSV</button>
                  <button onClick={() => handleExport("pdf")}>PDF</button>
                  <button onClick={() => setActiveCard("")}>Close</button>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      {TABLE_HEADERS[activeCard].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getTableRows().map((row, idx) => renderRow(row, idx))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* ───────────── Compare Mode UI ───────────── */}
      {compareMode && (
        <>
          {/* checkbox list */}
          <div className="multi-select">
            <label>Select Executives (max 5)</label>
            <div className="dropdown-box">
              {executives.map((ex) => (
                <label key={getExecId(ex)} style={{ marginRight: "1rem" }}>
                  <input
                    type="checkbox"
                    value={getExecId(ex)}
                    checked={isChecked(getExecId(ex))}
                    onChange={(e) => toggleExecCheckbox(e.target.value)}
                  />
                  {ex.username}
                </label>
              ))}
            </div>
          </div>

          {/* buttons */}
          <div style={{ marginTop: "1rem" }}>
            <button className="compare-btn" onClick={applyCompare}>
              Compare
            </button>
            <button
              className="back-btn"
              style={{ marginLeft: "1rem" }}
              onClick={() => {
                setCompareMode(false);
                setSelectedExecs([]);
                setCompareStats({});
                setActiveRadar("");
              }}
            >
              ✕ Cancel
            </button>
          </div>

          {/* results */}
          {Object.keys(compareStats).length > 0 && (
            <>
              {/* summary grid */}
              <div className="compare-results">
                {CARDS.map(({ key, icon, label }) => (
                  <div className="compare-card" key={key}>
                    <div className="compare-icon">{icon}</div>
                    <h4>{label}</h4>
                    <div className="compare-values">
                      {selectedExecs.map((ex, idx) => (
                        <div key={ex.username} style={{ fontSize: ".85rem" }}>
                          <b>{ex.username}</b>:{" "}
                          {compareStats[ex.username]?.[key] || 0}
                          {idx > 0 && (
                            <small style={{ marginLeft: 4 }}>
                              ({getDelta(
                                compareStats[selectedExecs[0].username]?.[key] ||
                                  0,
                                compareStats[ex.username]?.[key] || 0
                              )}
                              )
                            </small>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* bar chart */}
              <div style={{ marginTop: "2.5rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>
                  Performance Comparison Chart
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedExecs.map((ex, idx) => (
                      <Bar
                        key={ex.username}
                        dataKey={ex.username}
                        fill={barColor(idx)}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* radar selector + chart */}
              <div style={{ marginTop: "3rem" }}>
                <h3>Radar Chart (select executive)</h3>
                <select
                  value={activeRadar || ""}
                  onChange={(e) => setActiveRadar(e.target.value)}
                  className="admin-dropdown"
                >
                  <option value="">-- Select Executive --</option>
                  {selectedExecs.map((ex) => (
                    <option key={ex.username} value={ex.username}>
                      {ex.username}
                    </option>
                  ))}
                </select>

                {activeRadar && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1.2rem",
                    }}
                  >
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      width={420}
                      height={320}
                      data={radarData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis />
                      <Radar
                        name={activeRadar}
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ───────────── Follow-Up History Modal ───────────── */}
      {historyModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={closeHistory}>
              <FaTimes />
            </button>
            <h3>
              Follow-Up History — <b>{historyModal.clientName}</b>
            </h3>
            {historyModal.items.length ? (
              <ul className="history-list">
                {historyModal.items.map((it, idx) => (
                  <li key={idx}>
                    <span>{new Date(it.createdAt).toLocaleString()}:</span>{" "}
                    {it.notes || it.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No history found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FullReport;
