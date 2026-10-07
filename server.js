const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Minecraft Bot Express Server is Running!');
});

app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});