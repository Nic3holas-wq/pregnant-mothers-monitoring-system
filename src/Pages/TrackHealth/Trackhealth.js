import React, { useEffect, useState } from "react";
import Navigation from "../../Components/Navigation/Navigation";
import config from "../../utils/config";

const TrackHealth = () => {
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [healthTips, setHealthTips] = useState([]);
  const [symptom, setSymptom] = useState("");
  const [loggedSymptoms, setLoggedSymptoms] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [user, setUser] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);

  const [formData, setFormData] = useState({
    bloodPressure: "",
    heartRate: "",
    weight: "",
    temperature: "",
    glucoseLevel: "",
  });

  // Fetch user from local storage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setUser(currentUser);
      fetchUserHealthMetrics(currentUser.email);
    }
  }, []);

  // Fetch health metrics
  const fetchUserHealthMetrics = async (email) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/health-metrics?email=${email}`);
      if (!response.ok) throw new Error("Failed to fetch health metrics");

      const data = await response.json();
      if (data) {
        setHealthMetrics(data);
        setFormData({
          bloodPressure: data.blood_pressure || "",  // Convert snake_case to camelCase
          heartRate: data.heart_rate || "",
          weight: data.weight || "",
          temperature: data.temperature || "",
          glucoseLevel: data.glucose_level || "",
        });        
      }
    } catch (error) {
      console.error("Error fetching health metrics:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    console.log(`Updating ${e.target.name} to`, e.target.value); // ✅ Debugging Line
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSaveHealthMetrics = async () => {
    if (!user || !user.email) {
      alert("User not found. Please log in.");
      return;
    }
  
    setFormData((prevFormData) => {
      console.log("Final Form Data Before Sending:", prevFormData);
      
      fetch(`${config.API_BASE_URL}/api/health-metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, ...prevFormData }),
      })
      .then((res) => res.json())
      .then((result) => {
        console.log("Backend Response:", result);
        alert(result.message);
        fetchUserHealthMetrics(user.email);
      })
      .catch((error) => {
        console.error("Error saving health metrics:", error);
        alert("Failed to save health metrics. Try again.");
      });
  
      return prevFormData;
    });
  };
  

  // Fetch symptoms once when component mounts
  useEffect(() => {
    setHealthTips([
      "Stay hydrated and drink at least 8 glasses of water daily.",
      "Ensure you get enough sleep to help your body recover.",
      "Eat a balanced diet with plenty of fruits and vegetables.",
    ]);
  
  }, []);

  

  // Analyze symptom severity
  const analyzeSymptom = (symptomText) => {
    const lowerSymptom = symptomText.toLowerCase();
    
    if (lowerSymptom.includes("headache")) {
      return { message: "Mild headache detected. Stay hydrated and rest.", severity: "yellow" };
    } else if (lowerSymptom.includes("fever")) {
      return { message: "Fever detected! Monitor your temperature and drink fluids.", severity: "red" };
    } else if (lowerSymptom.includes("cough")) {
      return { message: "Cough detected. If persistent, see a doctor.", severity: "yellow" };
    } else if (lowerSymptom.includes("chest pain")) {
      return { message: "Chest pain detected! Seek immediate medical attention!", severity: "red" };
    } else {
      return { message: "Symptom logged. Monitor your condition.", severity: "green" };
    }
  };

  // Submit a new symptom
  const handleSymptomSubmit = async (e) => {
    e.preventDefault();

    if (!symptom.trim()) {
      alert("Please enter a symptom before submitting.");
      return;
    }

    const analysis = analyzeSymptom(symptom);
    setAnalysisResult(analysis.message);

    const newSymptom = { text: symptom, date: new Date().toLocaleString(), severity: analysis.severity };

    
  };

  const checkHealthStatus = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/health-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(healthMetrics),
      });

      const data = await response.json();
      setHealthStatus(data.status);
    } catch (error) {
      console.error("Error checking health status:", error);
    }
  };

  const fetchHealthStatus = async () => {
    if (!user || !user.email) {
      alert("User not found. Please log in.");
      return;
    }
  
    try {
      const response = await fetch(`${config.API_BASE_URL}/health-status?email=${user.email}`);
      if (!response.ok) throw new Error("Failed to fetch health status");
  
      const data = await response.json();
      setHealthStatus(data.status);
    } catch (error) {
      console.error("Error fetching health status:", error);
      //alert("Failed to fetch health status. Try again.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold my-4">Track Your Health</h2>
        <h4 className="text-lg font-bold">Welcome, {user && user.email}!</h4>

        {/* Health Metrics Form */}
        <div className="p-4 rounded-lg shadow bg-white">
          <h3 className="text-lg font-semibold">Update Your Health Metrics</h3>

          <div className="d-flex justify-content-center min-vh-10">
  <div className="row row-cols-3 gap-3">
    {["bloodPressure", "heartRate", "weight", "temperature", "glucoseLevel"].map((key) => (
      <input
        key={key}
        type="text"
        name={key}
        value={formData[key]}
        onChange={handleInputChange}
        placeholder={key.replace(/([A-Z])/g, " $1")}
        className="p-2 border rounded w-full my-2"
      />
    ))}
    <button onClick={handleSaveHealthMetrics} className="btn btn-primary text-white p-2 rounded mt-2">
      Save Health Metrics
    </button>
  </div>
</div>

        </div>

        {/* Display Health Metrics */}
<div className="mt-4 p-4 rounded shadow bg-light">
  <h3 className="h5 fw-semibold">Your Health Metrics</h3>
  {healthMetrics ? (
    <div className="row row-cols-4 g-3 mt-2">
      {Object.entries(healthMetrics).map(([key, value]) => (
        <div key={key} className="col">
          <div className="p-3 border rounded bg-white d-flex align-items-center">
            <i className="bi bi-heart-pulse-fill text-danger me-2"></i>
            <span className="fw-bold text-primary">
              {key.replace(/([A-Z])/g, " $1")}:
            </span> 
            <span className="ms-1">{value}</span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-muted mt-2">Loading health metrics...</p>
  )}
  <button onClick={checkHealthStatus} className="btn btn-info mt-3">Check Health Status</button>
  {healthStatus && (
  <div className="mt-3">
    <h4 
      className={
        healthStatus === "Best" ? "text-success" :
        healthStatus === "Good" ? "text-warning" :
        "text-danger"
      }
    >
      Health Status
    </h4>
    <span 
      className={`badge  p-2 fs-3 ${
        healthStatus === "Best" ? "bg-success" :
        healthStatus === "Good" ? "bg-warning" :
        "bg-danger"
      }`}
    >
      {healthStatus}
    </span>
  </div>
)}

</div>


        {/* Health Tips */}
<div className="bg-warning bg-opacity-25 p-4 mt-4 rounded shadow">
  <h3 className="h5 fw-semibold">Daily Health Tips</h3>
  <ul className="list-group list-group-flush mt-2">
    {healthTips.map((tip, index) => (
      <li key={index} className="list-group-item bg-transparent border-0">
        <i className="bi bi-check-circle-fill text-success me-2"></i> {tip}
      </li>
    ))}
  </ul>
</div>


        {/* Log Symptoms */}
<div className="bg-light p-4 mt-4 rounded shadow d-flex flex-row gap-5">
  <form onSubmit={handleSymptomSubmit} className="w-50">
    <h3 className="h5 fw-semibold">Log Symptoms</h3>
    <input
      type="text"
      value={symptom}
      onChange={(e) => setSymptom(e.target.value)}
      placeholder="Describe any symptoms..."
      className="form-control mt-2"
    />
    <button type="submit" className="btn btn-danger mt-3">Submit</button>
  </form>

  {analysisResult && (
    <div className="w-50">
      <p className="h4 mt-3">Recommendation</p>
      <p className="text-success">{analysisResult}</p>
    </div>
  )}
</div>

      </div>
    </>
  );
};

export default TrackHealth;
