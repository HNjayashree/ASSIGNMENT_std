import { useState } from "react";

const subjects = [
  { key: "maths",   label: "Mathematics" },
  { key: "science", label: "Science" },
  { key: "english", label: "English" },
  { key: "history", label: "History" },
  { key: "cs",      label: "Computer Sc." },
];

function getGrade(pct) {
  if (pct >= 90) return { grade: "A+", remark: "Outstanding!" };
  if (pct >= 80) return { grade: "A",  remark: "Excellent!" };
  if (pct >= 70) return { grade: "B",  remark: "Very Good" };
  if (pct >= 60) return { grade: "C",  remark: "Good" };
  if (pct >= 35) return { grade: "D",  remark: "Needs Improvement" };
  return           { grade: "F",  remark: "Fail" };
}

const gradeColor = { "A+": "#0F6E56", A: "#185FA5", B: "#3B6D11", C: "#BA7517", D: "#993C1D", F: "#A32D2D" };

export default function App() {
  const [name, setName]   = useState("");
  const [roll, setRoll]   = useState("");
  const [marks, setMarks] = useState({ maths:"", science:"", english:"", history:"", cs:"" });
  const [report, setReport] = useState(null);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!roll.trim()) e.roll = "Required";
    subjects.forEach(({ key }) => {
      const v = Number(marks[key]);
      if (marks[key] === "") e[key] = "Required";
      else if (isNaN(v) || v < 0 || v > 100) e[key] = "0–100 only";
    });
    return e;
  }

  function generate() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const m = {};
    subjects.forEach(({ key }) => m[key] = Number(marks[key]));
    const total = Object.values(m).reduce((a, b) => a + b, 0);
    const pct   = total / 5;
    const { grade, remark } = getGrade(pct);
    const passed = subjects.every(({ key }) => m[key] >= 35);

    let high = subjects[0], low = subjects[0];
    subjects.forEach(s => {
      if (m[s.key] > m[high.key]) high = s;
      if (m[s.key] < m[low.key]) low  = s;
    });

    const needed = subjects
      .filter(({ key }) => m[key] < 35)
      .map(({ key, label }) => ({ label, need: 35 - m[key] }));

    setReport({ name: name.trim(), roll: roll.trim(), m, total, pct, grade, remark, passed, high, low, needed, scholarship: pct > 95 });
  }

  function reset() {
    setReport(null);
    setName("");
    setRoll("");
    setMarks({ maths:"", science:"", english:"", history:"", cs:"" });
    setErrors({});
  }

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const err = (k) => errors[k] ? (
    <span style={{color:"red",fontSize:11,marginLeft:6}}>{errors[k]}</span>
  ) : null;

  if (report) {
    const { name, roll, m, total, pct, grade, remark, passed, high, low, needed, scholarship } = report;
    const gc = gradeColor[grade] || "#444";

    return (
      <div style={{fontFamily:"Arial",padding:"20px",maxWidth:500,margin:"0 auto"}}>
        <div style={{border:"2px solid #ddd",borderRadius:10,overflow:"hidden"}}>
          <div style={{background:"#f5f5f5",padding:"15px",textAlign:"center"}}>
            <h2>Student Report Card</h2>
            <h3>{name}</h3>
            <p>Roll No. {roll}</p>
          </div>

          <div style={{padding:"15px"}}>
            {subjects.map(({ key, label }) => {
              const v = m[key];
              const fail = v < 35;
              return (
                <div key={key} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px dashed #ccc"}}>
                  <span>{label}</span>
                  <span style={{color: fail ? "red" : "black",fontWeight:"bold"}}>
                    {v} / 100 {fail && "✗"}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{background:"#fafafa",padding:"15px"}}>
            <p><b>Total:</b> {total} / 500</p>
            <p><b>Percentage:</b> {pct.toFixed(2)}%</p>
            <p><b>Grade:</b> <span style={{color:gc,fontWeight:"bold"}}>{grade}</span></p>
            <p><b>Remark:</b> {remark}</p>
            <p>
              <b>Result:</b>
              <span style={{color: passed ? "green" : "red",marginLeft:6}}>
                {passed ? "PASSED" : "FAILED"}
              </span>
            </p>
          </div>

          <div style={{padding:"15px",fontSize:"14px"}}>
            <p>🏆 Highest: <b>{high.label} ({m[high.key]})</b></p>
            <p>📉 Lowest: <b>{low.label} ({m[low.key]})</b></p>

            {scholarship && (
              <p style={{color:"green"}}>🎓 Scholarship eligible! (above 95%)</p>
            )}

            {needed.length > 0 && (
              <p style={{color:"red"}}>
                Marks needed to pass: {needed.map(n => `${n.label} +${n.need}`).join(", ")}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={reset}
          style={{
            marginTop:16,
            width:"100%",
            padding:"12px",
            border:"none",
            borderRadius:8,
            background:"#333",
            color:"white",
            cursor:"pointer"
          }}
        >
          Generate Another Report
        </button>
      </div>
    );
  }

  return (
    <div style={{padding:"20px",maxWidth:450,margin:"0 auto",fontFamily:"Arial"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <h2>Student Report Card Generator</h2>
        <p>Week 9 Mini Project</p>
      </div>

      <div style={{marginBottom:12}}>
        <label>Student Name {err("name")}</label>
        <input
          style={inputStyle}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter student name"
        />
      </div>

      <div style={{marginBottom:16}}>
        <label>Roll Number {err("roll")}</label>
        <input
          style={inputStyle}
          value={roll}
          onChange={e => setRoll(e.target.value)}
          placeholder="Enter roll number"
        />
      </div>

      <h4>Enter Marks (0–100)</h4>

      {subjects.map(({ key, label }) => (
        <div key={key} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{width:120}}>{label}</span>
          <input
            type="number"
            min="0"
            max="100"
            style={inputStyle}
            value={marks[key]}
            onChange={e => setMarks(prev => ({ ...prev, [key]: e.target.value }))}
            placeholder="0-100"
          />
          {err(key)}
        </div>
      ))}

      <button
        onClick={generate}
        style={{
          marginTop:12,
          width:"100%",
          padding:"12px",
          border:"none",
          borderRadius:8,
          background:"#2563eb",
          color:"white",
          cursor:"pointer",
          fontWeight:"bold"
        }}
      >
        Generate Report Card
      </button>
    </div>
  );
}
