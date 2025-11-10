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

  const validateInput = (field, value) => {
    let error = "";
    if (field === "age") {
      if (value < 1 || value > 74) error = "กรุณากรอกอายุในช่วง 1-74 ปี";
    } else if (field === "loanAmount") {
      if (value < 1 || value > 3000000)
        error = "กรุณากรอกวงเงินกู้คงเหลือในช่วง 1 - 3,000,000 บาท";
    } else if (field === "coveragePeriod") {
      if (value < 1 || value > 3)
        error = "กรุณากรอกระยะเวลาคุ้มครองในช่วง 1-3 ปี";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const calculatePremium = () => {
    if (
      errors.age ||
      errors.loanAmount ||
      errors.coveragePeriod ||
      !age ||
      !loanAmount ||
      !coveragePeriod
    ) {
      setFormError(true);
      return;
    }

    setFormError(false);

    let ageRate = 0;
    if (age <= 60) ageRate = 790;
    else if (age <= 65) ageRate = 1390;
    else if (age <= 70) ageRate = 1680;
    else ageRate = 1800;

    const result = (loanAmount / 100000) * ageRate * coveragePeriod;
    setPremium(result.toFixed(2));
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
          padding: "40px 32px", // ✅ เพิ่ม padding ด้านข้าง
          boxSizing: "border-box", // ✅ ป้องกัน padding overflow
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

        {[
          {
            label: "อายุ:",
            value: age,
            setter: setAge,
            field: "age",
            placeholder: "กรอกอายุ (ปี)",
          },
          {
            label: "วงเงินกู้คงเหลือ:",
            value: loanAmount,
            setter: setLoanAmount,
            field: "loanAmount",
            placeholder: "กรอกวงเงินกู้คงเหลือ (บาท)",
          },
          {
            label: "ระยะเวลาคุ้มครอง:",
            value: coveragePeriod,
            setter: setCoveragePeriod,
            field: "coveragePeriod",
            placeholder: "กรอกระยะเวลาคุ้มครอง (ปี)",
          },
        ].map(({ label, value, setter, field, placeholder }) => (
          <div
            key={field}
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              style={{
                marginBottom: "6px",
                fontWeight: "600",
                color: "#444",
                fontSize: "0.95rem",
              }}
            >
              {label}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => {
                setter(e.target.value);
                validateInput(field, e.target.value);
              }}
              placeholder={placeholder}
              style={{
                width: "100%", // ✅ ยังคงให้เต็ม container
                boxSizing: "border-box", // ✅ ป้องกัน input ชนขอบ
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                transition: "0.2s border-color",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgb(214,51,132)")
              }
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
            {errors[field] && (
              <span
                style={{
                  color: "red",
                  marginTop: "5px",
                  fontSize: "0.85rem",
                }}
              >
                {errors[field]}
              </span>
            )}
          </div>
        ))}

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
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = "#b82c70")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "#d63384")
          }
        >
          คำนวณ
        </button>

        {formError && (
          <div
            style={{
              color: "red",
              marginTop: "12px",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
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
            💰 เบี้ยประกันภัยโดยประมาณ:{" "}
            <span style={{ fontSize: "1.2rem" }}>
              {formatNumber(premium)} บาท
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;