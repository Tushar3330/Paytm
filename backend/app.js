const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;
app.use(express.json());

const mainrouter = require('./routes/index_router');

app.use('/api/v1', mainrouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    });