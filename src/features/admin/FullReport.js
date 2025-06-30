// src/pages/admin/FullReport.js
import React, { useEffect, useState, useMemo } from "react";
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

/* ─────────────────────────────────── */

const FullReport = () => {
  /* ========== context fns ========== */
  const {
    fetchExecutivesAPI,
    fetchAssignedLeads,
    fetchFollowUpsByExecutive,
    fetchConvertedByExecutive,
    fetchClosedByExecutive,
    fetchMeetingsByExecutive,
  } = useApi();

  /* ========== helpers ========== */
  const getExecId = (ex) => (ex?._id ?? ex?.id ?? ex?.ID ?? "").toString();

  /* ========== local state ========== */
  const [executives, setExecutives] = useState([]);
  const [selectedExec, setSelectedExec] = useState(null);

  // raw responses
  const [raw, setRaw] = useState({
    fresh: [],
    followUps: [],
    converted: [],
    closed: [],
    meetings: [],
  });

  // grouped / counts
  const [counts, setCounts] = useState({
    fresh: 0,
    followUp: 0,
    converted: 0,
    closed: 0,
    meetings: 0,
  });

  // active table card
  const [activeCard, setActiveCard] = useState("");

  /* ========== compare mode state ========== */
  const [compareMode, setCompareMode] = useState(false);
  const [execA, setExecA] = useState(null);
  const [execB, setExecB] = useState(null);
  const [compareStats, setCompareStats] = useState({ A: null, B: null });

  /* ========== export handler ========== */
  const handleExport = (type) => {
    const data = getTableRows();
    if (!data.length) return;

    const fileName = `${selectedExec?.username || "Executive"}_${activeCard}`;

    const keys = headers[activeCard]
      .map((h) => h.toLowerCase())
      .filter((k) => k !== "view");

    const formattedData = data.map((row) =>
      Object.fromEntries(keys.map((k) => [k, row[k] || ""]))
    );

    if (type === "excel") exportToExcel(formattedData, fileName);
    else if (type === "csv") exportToCSV(formattedData, fileName);
    else if (type === "pdf") exportToPDF(formattedData, fileName, keys);
  };

  /* ========== follow-up history modal ========== */
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

  /* ────────────────────────── data fetch ────────────────────────── */

  // dropdown options
  useEffect(() => {
    (async () => {
      const execs = await fetchExecutivesAPI();
      setExecutives(execs || []);
    })();
  }, []);

  // whenever executive changes → hit all APIs
  useEffect(() => {
    if (!selectedExec) return;

    (async () => {
      const [
        freshLeads,
        followUpsRaw,
        convertedRaw,
        closedRaw,
        meetingsRaw,
      ] = await Promise.all([
        fetchAssignedLeads(selectedExec.username),
        fetchFollowUpsByExecutive(selectedExec.username),
        fetchConvertedByExecutive(selectedExec.username),
        fetchClosedByExecutive(selectedExec.username),
        fetchMeetingsByExecutive(selectedExec.username),
      ]);

      /* --- group follow-ups by fresh_lead_id & keep only latest status --- */
      const followUpMap = {};
      (followUpsRaw || []).forEach((f) => {
        followUpMap[f.fresh_lead_id] = f;
      });
      const followUpGrouped = Object.values(followUpMap).filter(
        (f) => (f.clientLeadStatus || "").toLowerCase() === "follow-up"
      );

      /* --- counts --- */
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

      /* --- raw cache for tables / history modal --- */
      setRaw({
        fresh: freshLeads || [],
        followUps: followUpsRaw || [],
        converted: convertedRaw || [],
        closed: closedRaw || [],
        meetings: meetingsRaw || [],
      });

      setActiveCard("");
    })();
  }, [selectedExec]);

  /* ========== table data based on activeCard ========== */
  const getTableRows = () => {
    if (!activeCard) return [];

    if (activeCard === "followUp") {
      const map = {};
      raw.followUps.forEach((f) => {
        if (
          (f.clientLeadStatus || "").toLowerCase() === "follow-up" &&
          !map[f.fresh_lead_id]
        ) {
          map[f.fresh_lead_id] = {
            id: f.fresh_lead_id,
            name: f.freshLead?.name || "",
            email: f.freshLead?.email || "",
            phone: f.freshLead?.phone || "",
            status: f.clientLeadStatus,
          };
        }
      });
      return Object.values(map);
    }

    if (activeCard === "converted") {
      return raw.converted.map((c) => ({
        id: c.fresh_lead_id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: "Converted",
      }));
    }

    if (activeCard === "closed") {
      return raw.closed.map((c) => ({
        id: c.fresh_lead_id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: "Closed",
      }));
    }

    if (activeCard === "fresh") return raw.fresh;
    if (activeCard === "meetings") return raw.meetings;
    return [];
  };

  /* ========== card + table meta ========== */
  const cards = [
    { key: "fresh", icon: <FaUserPlus />, label: "Fresh Leads" },
    { key: "followUp", icon: <FaClipboardCheck />, label: "Follow-Ups" },
    { key: "converted", icon: <FaUsers />, label: "Converted Clients" },
    { key: "closed", icon: <FaTimesCircle />, label: "Closed Clients" },
    { key: "meetings", icon: <FaCalendarCheck />, label: "Meetings" },
  ];

  const headers = {
    fresh: ["Name", "Email", "Phone", "Status"],
    followUp: ["Name", "Email", "Phone", "Status", "View"],
    converted: ["Name", "Email", "Phone", "Status", "View"],
    closed: ["Name", "Email", "Phone", "Status", "View"],
    meetings: ["Client", "Email", "Phone", "Start", "End"],
  };

  /* ========== compare helpers ========== */
  const fetchStats = async (username) => {
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
  };

  const handleApplyCompare = async () => {
    if (!execA || !execA.username || !execB || !execB.username || execA.username === execB.username) {
  alert("Please select two different executives");
  return;
}
    const [statsA, statsB] = await Promise.all([
      fetchStats(execA.username),
      fetchStats(execB.username),
    ]);
    setCompareStats({ A: statsA, B: statsB });
  };

  /* ========== percentage delta helper ========== */
  const getDelta = (a, b) => {
    if (a === 0 && b === 0) return "0%";
    const delta = ((b - a) / (a === 0 ? b : a)) * 100;
    const fixed = isNaN(delta) ? 0 : delta.toFixed(1);
    return `${delta > 0 ? "+" : ""}${fixed}%`;
  };

  /* ========== chart data ========== */
  const barData = useMemo(() => {
    if (!compareStats?.A || !compareStats?.B) return [];
    return cards.map(({ key, label }) => ({
      name: label,
      [execA?.username || "A"]: compareStats.A[key],
      [execB?.username || "B"]: compareStats.B[key],
    }));
  }, [compareStats, execA, execB, cards]);

  const radarDataA = useMemo(() => {
    if (!compareStats?.A) return [];
    return cards.map(({ key, label }) => ({
      category: label,
      value: compareStats.A[key],
    }));
  }, [compareStats, cards]);

  const radarDataB = useMemo(() => {
    if (!compareStats?.B) return [];
    return cards.map(({ key, label }) => ({
      category: label,
      value: compareStats.B[key],
    }));
  }, [compareStats, cards]);

  /* ========== render helpers ========== */
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
                className="eye-icon"
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
            <td>{row.endTime ? new Date(row.endTime).toLocaleString() : "-"}</td>
          </tr>
        );

      default:
        return null;
    }
  };

  /* ========== JSX ========== */
  return (
    <div className="admin-full-report">
      <h2>{!compareMode ? "Full Report" : "Compare Executives"}</h2>

      {/* Selector & Compare toggle */}
      {!compareMode && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <select
            value={selectedExec ? getExecId(selectedExec) : ""}
            onChange={(e) => {
              const exec = executives.find((x) => getExecId(x) === e.target.value);
              setSelectedExec(exec || null);
            }}
            className="admin-dropdown"
          >
            <option value="">-- Select Executive --</option>
            {executives.map((ex) => (
              <option key={getExecId(ex)} value={getExecId(ex)}>
                {ex.username}
              </option>
            ))}
          </select>

          <button className="compare-btn" onClick={() => setCompareMode(true)}>
            Compare
          </button>
        </div>
      )}

      {/* Compare UI */}
      {compareMode && (
        <>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", marginBottom: "1.2rem" }}>
            <div>
              <label style={{ fontSize: ".85rem" }}>Executive A</label>
              <select
                value={execA ? getExecId(execA) : ""}
                onChange={(e) =>
                  setExecA(executives.find((x) => getExecId(x) === e.target.value))
                }
                className="admin-dropdown"
              >
                <option value="">-- Select --</option>
                {executives.map((ex) => (
                  <option key={getExecId(ex)} value={getExecId(ex)}>
                    {ex.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: ".85rem" }}>Executive B</label>
              <select
                value={execB ? getExecId(execB) : ""}
                onChange={(e) =>
                  setExecB(executives.find((x) => getExecId(x) === e.target.value))
                }
                className="admin-dropdown"
              >
                <option value="">-- Select --</option>
                {executives.map((ex) => (
                  <option key={getExecId(ex)} value={getExecId(ex)}>
                    {ex.username}
                  </option>
                ))}
              </select>
            </div>

            <button className="compare-btn" onClick={handleApplyCompare}>
              Apply
            </button>

            <button
              className="back-btn"
              onClick={() => {
                setCompareMode(false);
                setCompareStats({ A: null, B: null });
                setExecA(null);
                setExecB(null);
              }}
            >
              ✕ Cancel
            </button>
          </div>

          {/* Show compare result */}
          {compareStats.A && compareStats.B && (
            <>
              <div className="compare-results">
                {cards.map(({ key, icon, label }) => (
                  <div className="compare-card" key={key}>
                    <div className="compare-icon">{icon}</div>
                    <h4>{label}</h4>
                    <div className="compare-values">
                      <span>{compareStats.A[key]}</span>
                      <span className="vs">vs</span>
                      <span>{compareStats.B[key]}</span>
                      <small
                        style={{
                          fontWeight: 600,
                          color: parseFloat(getDelta(compareStats.A[key], compareStats.B[key])) >= 0 ? "green" : "crimson",
                        }}
                      >
                        ({getDelta(compareStats.A[key], compareStats.B[key])})
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Histogram */}
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ marginBottom: "1rem" }}>Performance Histogram</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={execA?.username || "A"} fill="#8884d8" />
                    <Bar dataKey={execB?.username || "B"} fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Spider Charts */}
              <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2rem" }}>
                <div>
                  <h4 style={{ textAlign: "center" }}>{execA?.username} Radar</h4>
                  <RadarChart cx="50%" cy="50%" outerRadius={90} width={300} height={250} data={radarDataA}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis />
                    <Radar name="A" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </div>
                <div>
                  <h4 style={{ textAlign: "center" }}>{execB?.username} Radar</h4>
                  <RadarChart cx="50%" cy="50%" outerRadius={90} width={300} height={250} data={radarDataB}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis />
                    <Radar name="B" dataKey="value" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  </RadarChart>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FullReport;
