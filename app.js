const express = require('express');
const port = 8080;

const app = express();

app.use('/', require('./router'));

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
})