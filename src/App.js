// App.js
import React, { useState } from "react";

function App() {
  const [age, setAge] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [coveragePeriod, setCoveragePeriod] = useState("");
  const [premium, setPremium] = useState(null);
  const [errors, setErrors] = useState({
    age: "",
    loanAmount: "",
    coveragePeriod: "",
  });
  const [formError, setFormError] = useState(false);

  // ✅ ฟังก์ชันตรวจสอบค่า input
  const validateInput = (field, value) => {
    let error = "";
    const numericValue = Number(value.toString().replace(/,/g, "")); // ✅ แปลงกลับก่อนตรวจสอบ

    if (field === "age") {
      if (numericValue < 25 || numericValue > 74) error = "กรุณากรอกอายุในช่วง 25-74 ปี";
    } else if (field === "loanAmount") {
      if (numericValue < 1 || numericValue > 3000000)
        error = "กรุณากรอกวงเงินกู้คงเหลือในช่วง 1 - 3,000,000 บาท";
    } else if (field === "coveragePeriod") {
      if (numericValue < 1 || numericValue > 3)
        error = "กรุณากรอกระยะเวลาคุ้มครองในช่วง 1-3 ปี";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // ✅ ฟังก์ชัน format ตัวเลขให้มี comma
  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // ✅ format เงินให้มีทศนิยม 2 ตำแหน่ง
  const formatMoney = (num) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ✅ เมื่อพิมพ์ช่อง loanAmount → ใส่ comma ทันที
  const handleLoanAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, ""); // เอาเฉพาะตัวเลข
    const formattedValue = rawValue ? formatNumber(rawValue) : "";
    setLoanAmount(formattedValue);
    validateInput("loanAmount", formattedValue);
  };

  // ✅ ฟังก์ชันคำนวณเบี้ย
  const calculatePremium = () => {
    const loanValue = Number(loanAmount.toString().replace(/,/g, "")); // แปลงค่ากลับก่อนคำนวณ
    const ageValue = Number(age);
    const coverageValue = Number(coveragePeriod);

    if (
      errors.age ||
      errors.loanAmount ||
      errors.coveragePeriod ||
      !ageValue ||
      !loanValue ||
      !coverageValue
    ) {
      setFormError(true);
      return;
    }

    setFormError(false);

    // อัตราเบี้ย (วิริยะ อัตราใหม่ 9/10/2569) หน่วย: ต่อหมื่น (76 = 0.76%)
    let rateBp = 0;
    if (ageValue <= 60) rateBp = 76;
    else if (ageValue <= 65) rateBp = 151;
    else if (ageValue <= 70) rateBp = 189;
    else rateBp = 298;

    // คำนวณเป็นสตางค์เพื่อเลี่ยงปัญหาทศนิยม
    const netSatang = Math.round(loanValue * rateBp * coverageValue / 100);
    // อากร: 1 บาท ต่อทุก 250 บาท หรือเศษของ 250 บาท (ปัดขึ้น) — แสดงผลเท่านั้น
    const duty = Math.ceil(netSatang / 25000);
    const net = netSatang / 100;

    // เบี้ยรวม = เบี้ยสุทธิ (ไม่รวมอากร)
    setPremium({ net, duty, total: net });
  };

  return (
    <div
      style={{
        fontFamily: "'Prompt', sans-serif",
        padding: "20px",
        background: "linear-gradient(180deg, #ffe6ea 0%, #ffdce5 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "460px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          padding: "40px 32px",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#d63384",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: "25px",
          }}
        >
          🧮 คำนวณเบี้ยประกันภัย
        </h1>

        {/* ช่องอายุ */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: 600, color: "#444" }}>อายุ:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              validateInput("age", e.target.value);
            }}
            placeholder="กรอกอายุ (ปี)"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          {errors.age && <span style={{ color: "red" }}>{errors.age}</span>}
        </div>

        {/* ✅ ช่องวงเงินกู้คงเหลือ */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: 600, color: "#444" }}>วงเงินกู้คงเหลือ:</label>
          <input
            type="text"
            value={loanAmount}
            onChange={handleLoanAmountChange}
            placeholder="กรอกวงเงินกู้คงเหลือ (บาท)"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              textAlign: "left", // ✅ ชิดขวาเหมือนเครื่องคิดเลข
              outline: "none",
            }}
          />
          {errors.loanAmount && (
            <span style={{ color: "red" }}>{errors.loanAmount}</span>
          )}
        </div>

        {/* ช่องระยะเวลาคุ้มครอง */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: 600, color: "#444" }}>ระยะเวลาคุ้มครอง:</label>
          <input
            type="number"
            value={coveragePeriod}
            onChange={(e) => {
              setCoveragePeriod(e.target.value);
              validateInput("coveragePeriod", e.target.value);
            }}
            placeholder="กรอกระยะเวลาคุ้มครอง (ปี)"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          {errors.coveragePeriod && (
            <span style={{ color: "red" }}>{errors.coveragePeriod}</span>
          )}
        </div>

        {/* ปุ่มคำนวณ */}
        <button
          onClick={calculatePremium}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#d63384",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#b82c70")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#d63384")}
        >
          คำนวณ
        </button>

        {formError && (
          <div style={{ color: "red", marginTop: "12px", textAlign: "center" }}>
            กรุณากรอกข้อมูลให้ครบถ้วน
          </div>
        )}

        {premium !== null && (
          <div
            style={{
              marginTop: "25px",
              backgroundColor: "#fff0f3",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center",
              border: "1px solid #ffd1dc",
              color: "#b82c70",
              fontWeight: "600",
            }}
          >
            <div>ค่าเบี้ยสุทธิ: {formatMoney(premium.net)} บาท</div>
            <div>อากร: {formatMoney(premium.duty)} บาท</div>
            <div style={{ marginTop: "8px" }}>
              💰 เบี้ยรวม:{" "}
              <span style={{ fontSize: "1.2rem" }}>{formatMoney(premium.total)} บาท</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;