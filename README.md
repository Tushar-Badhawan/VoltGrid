# VoltGrid

## Overview

VoltGrid is a power supply optimization tool that helps in minimizing power cuts during critical hours by optimizing electricity distribution using algorithms like max flow.

## Project Structure

VoltGrid/
│── backend/ # Flask backend │
├── app.py # Main backend file │
├── requirements.txt # Dependencies │
├── models/ #Data models if using a database │
├── routes/ # API endpoints │
├── venv/ # Virtual environment (not pushed to GitHub)
│── frontend/ # React.js frontend │
├── src/ # React components │
├── public/ # Static files │
├── package.json # Dependencies
│── docs/ # Documentation & guidelines
│── .gitignore # Ignore unnecessary files
│── README.md # Project overview & setup instructions

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/Tushar-Badhawan/VoltGrid.git
cd VoltGrid

cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt

### Run Backend
python app.py

### Run Frontend
cd ../frontend
npm install
npm start
```
