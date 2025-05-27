const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webhookController = require('./controllers/webhookController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/webhook', webhookController.handleWebhook);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});