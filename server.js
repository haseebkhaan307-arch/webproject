const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'students.json');

const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/students', (req, res) => res.json(readData()));

app.post('/api/students', (req, res) => {
    const { name, rollNo, gpa } = req.body;
    const students = readData();
    const newStudent = { id: Date.now().toString(), name, rollNo, gpa };
    students.push(newStudent);
    writeData(students);
    res.status(201).json(newStudent);
});

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));