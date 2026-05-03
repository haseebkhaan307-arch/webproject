const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// 1. Updated Static Path: Go UP one level from 'api' to find the root files
app.use(express.static(path.join(__dirname, '../')));

// 2. Updated Data File Path: Go UP one level to find students.json
const DATA_FILE = path.join(__dirname, '../students.json');

const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Read Error:", err);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Write Error:", err);
    }
};

// Routes
app.get('/api/students', (req, res) => res.json(readData()));

app.post('/api/students', (req, res) => {
    const { name, rollNo, gpa } = req.body;
    const students = readData();
    const newStudent = { id: Date.now().toString(), name, rollNo, gpa };
    students.push(newStudent);
    writeData(students);
    res.status(201).json(newStudent);
});

// 3. IMPORTANT: Vercel does not need app.listen()
// We export the app instead so Vercel can handle the traffic
module.exports = app;