const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); // <-- NEW: For parsing cookies

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // <-- NEW: Use the cookie parser middleware

// Check if MongoDB URI is available
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully to jira-mvp'))
.catch(err => {
  console.log('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/users', require('./routes/userRoutes')); // <-- NEW: Add user routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/sprints', require('./routes/sprints'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => {
  res.json({ message: 'JIRA MVP API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});