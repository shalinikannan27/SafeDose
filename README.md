# SafeDose

🔗 Live Demo: https://safedose.vercel.app/

---

## Problem Statement

Cervical cancer is the **fourth most common cancer among women worldwide**, yet it is largely preventable. The HPV vaccine, administered to girls aged 9–14, can provide up to **90% protection**.

However, this protection depends on one critical factor:  
👉 **Vaccine potency at the time of administration**

HPV vaccines are highly sensitive and can degrade due to:
- Temperature fluctuations
- Cold chain breaks
- Light exposure
- Physical handling during transport

While IoT-based cold chain systems collect this data, they only **record conditions** — they do **not interpret whether the vaccine is still usable**.

---

## Our Solution

**SafeDose bridges the gap between raw sensor data and real-world clinical decisions.**

It takes cold-chain sensor inputs and provides an **instant, actionable verdict**:

- ✅ **Safe** → Fully potent, ready to use  
- ⚠️ **Use Soon** → Potency declining, prioritize usage  
- ❌ **Discard** → No longer effective  

---

## How It Works

SafeDose combines **scientific modeling + machine learning**:

### Arrhenius Equation
- Models **temperature-driven degradation**
- Estimates vaccine potency loss over time

### Machine Learning (XGBoost)
- Predicts **remaining shelf life**
- Learns from degradation patterns and environmental conditions

---

## Tech Stack

| Layer        | Technology Used              |
|-------------|-----------------------------|
| Frontend    | React.js, Tailwind CSS      |
| Backend     | Flask                       |
| ML Model    | XGBoost Regression          |
| Deployment  | Vercel (Frontend), Render (Backend) |

---

## Key Features

- 📊 Real-time interpretation of cold-chain data  
- 🧪 Scientific + ML-based decision support  
- ⚡ Instant classification (Safe / Use Soon / Discard)  
- 🌐 Fully deployed web application  
- 🧩 Scalable architecture for broader vaccine monitoring  

---

## Impact

SafeDose ensures that:
- Patients receive **effective vaccines**
- Healthcare workers make **informed decisions**
- Vaccine wastage is **minimized**
- Cold chain data becomes **actionable intelligence**

---

## Future Scope

- Integration with real-time IoT devices  
- Expansion to other vaccines and biologics  
- Mobile app for field healthcare workers  
- Dashboard analytics for supply chain monitoring  

---

## Achievement
Top 5 Finalist at ACM-W Hackfinity 6.0 (State-level Hackathon at PES University).

