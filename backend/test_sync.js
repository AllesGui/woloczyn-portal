require('dotenv').config();
const db = require('./src/db');
const { list } = require('./src/controllers/atendimento.controller');

async function testSync() {
    const req = { query: {} };
    const res = {
        json: (data) => { console.log("List returned:", data); },
        status: (code) => ({ json: (err) => console.log(`Error ${code}:`, err) })
    };
    await list(req, res);
    process.exit(0);
}

testSync();
