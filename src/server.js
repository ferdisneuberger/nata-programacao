const express = require('express');
const app = express();

app.use(express.json());

app.use('/users', require('./routes/userRoutes.js'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})