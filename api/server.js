const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

// Go UP one level to find your HTML and JSON files
app.use(express.static(path.join(__dirname, '../')));
const DATA_FILE = path.join(__dirname, '../students.json');

const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) return [];
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) { return []; }
};

const writeData = (data) => {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }
    catch (err) { console.error(err); }
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api/students', (req, res) => res.json(readData()));

app.post('/api/students', (req, res) => {
    const { name, rollNo, gpa } = req.body;
    const students = readData();
    const newStudent = { id: Date.now().toString(), name, rollNo, gpa };
    students.push(newStudent);
    writeData(students);
    res.status(201).json(newStudent);
});

// IMPORTANT: Export for Vercel
module.exports = app;