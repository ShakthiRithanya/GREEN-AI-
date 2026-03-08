# 🌿 Green AI Compressor

A premium, modern web application designed to analyze and optimize the environmental impact of Machine Learning models. **Green AI Compressor** provides data scientists and developers with the tools to build, compress, and visualize the carbon footprint of their AI workloads.

![Green AI Theme](https://img.shields.io/badge/Theme-Beige%20%26%20Forest%20Green-166534)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-React%20%26%20Vite-61DAFB)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC)

---

## ✨ Key Features

*   **⚡ Two Build Modes**:
    *   **Mode A (Build from Data)**: Upload raw datasets and let the system train and optimize a model from scratch.
    *   **Mode B (Existing Models)**: Upload pre-trained `.pkl` baseline models and datasets for automated compression.
*   **📉 Smart Compression**: Uses advanced pruning techniques to reduce model size while maintaining critical accuracy and fairness.
*   **⚖️ Fairness & Ethics**: Automated **Disparate Impact** analysis and fairness score tracking during the compression process.
*   **🌍 Environmental Visualization**: Transform abstract grams of CO₂ into real-world analogies (Phone charges, LED hours, Laptop usage).
*   **💎 Premium UI**: A stunning Glassmorphism-based design system using a curated **Forest Green & Beige** color palette.

---

## 🛠️ Technology Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS** (Custom theme with `beige` and `dark` green tokens)
- **Lucide React** (Iconography)
- **Recharts** (Performance trade-off visualization)
- **Framer Motion** (Smooth transitions and animations)

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** (SQLite database for run tracking)
- **CodeCarbon** (Hardware-level energy & CO₂ tracking)
- **Scikit-learn** (Model training and compression logic)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`.
3. Activate the environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python -m uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📊 Methodology

### CO₂ Tracking
We use the **CodeCarbon** library to track the energy consumption of your CPU/GPU during the "Analyze" and "Compress" phases. This data is then converted into CO₂ emissions based on your regional energy grid intensity.

### Model Pruning
Our compression engine applies **Global Magnitude Pruning**. By removing weights with the smallest contributions, we significantly reduce the model's storage footprint and inference time with minimal impact on performance.

---

## 📜 License
Internal Project - All Rights Reserved.

---
Created with 💚 for a Greener AI.
