const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// 1. Point to the 'public' folder which is one level up
app.use(express.static(path.join(__dirname, '../public')));

// 2. Point to 'students.json' which is one level up
const DATA_FILE = path.join(__dirname, '../students.json');

const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
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

// 3. Routes for the API
app.get('/api/students', (req, res) => res.json(readData()));

app.post('/api/students', (req, res) => {
    const { name, rollNo, gpa } = req.body;
    const students = readData();
    const newStudent = { id: Date.now().toString(), name, rollNo, gpa };
    students.push(newStudent);
    writeData(students);
    res.status(201).json(newStudent);
});

// 4. Serve the index.html from the public folder for the main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// IMPORTANT: Do NOT use app.listen(). Export the app for Vercel.
module.exports = app;