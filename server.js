const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Expense = require('./models/expenseModel');
const _ = require('lodash');
const app = express();
const cors = require('cors');
const MonthlyExpense = require('./models/monthlyExpenseModel');
const port = 3001;
const tls = require('tls');
console.log('TLS module is available.');

require('dotenv').config();


const corsOptions = {
  origin: 'http://159.203.124.196:3000', // Replace with the origin of your React app
  credentials: true,
};

app.use(cors(corsOptions));

//app.use(cors());
app.use(bodyParser.json());

//mongoose.set('debug', true); 
mongoose.connect('mongodb+srv://doadmin:759x421WTP3n8UID@db-mongodb-nyc3-74012-ea192bfb.mongo.ondigitalocean.com/expenses?replicaSet=db-mongodb-nyc3-74012&tls=true&authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




// User signup
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User signin
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.sendStatus(401);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new expense with user authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  //console.log(token)
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  //console.log(token)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //console.log(err)
    //console.log(user)
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    req.user = user;
    next();
  });
};

app.post('/confBudget', authenticateToken, async (req, res) => {
  try {
    const { description, amount, user } = req.body;
    console.log(req.body);
    const id = user._id;
    const newExpense = await Expense.create({
      description,
      amount,
      user: id,
    });
    //console.log(res);
    res.json(newExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});


// Get all expenses
// Get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const userId = req.header('X-User-ID');

    // Fetch all expenses associated with the authenticated user
    const expenses = await Expense.find({ user: userId });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



app.post('/expenditure', authenticateToken, async (req, res) => {
  try {
    const { expense, amount, date, user } = req.body;
    console.log('sdafasd')
    console.log(req.body);
    const id = user._id;
    const newMonthlyExpense = await MonthlyExpense.create({
      expense,
      amount,
      date,
      user: id,
    });
    //console.log(res);
    res.json(newMonthlyExpense);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});

app.post('/delBudget', async (req, res) => {
  try {
    const { expense } = req.body;

    // Check if _id is provided
    if (!expense) {
      return res.status(400).json({ error: 'Expense _id is required' });
    }

    // Find and delete the expense by _id
    const deletedExpense = await Expense.findByIdAndDelete(expense);

    // Check if the expense was found and deleted
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully', deletedExpense });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/montlyExpenses', async (req, res) => {
  try {
    const userId = req.header('X-User-ID');

    // Fetch all expenses associated with the authenticated user
    const expenses = await MonthlyExpense.find({ user: userId });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



app.listen(port, '165.22.32.153', () => {
  console.log(`Server is running on port ${port}`);
});
