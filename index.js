const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const router = require('./routes/api_v1');

require('dotenv').config();


const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());


// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to Supabase PostgreSQL successful!');
  })
  .catch((err) => {
    console.error('Unable to connect to Supabase PostgreSQL:', err);
    process.exit(1); // Exit the process on failure
  });

// routes
app.use(router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
