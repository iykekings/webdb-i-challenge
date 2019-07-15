const server = require('./server.js');
const db = require('./data/dbConfig');

const PORT = process.env.PORT || 4000;

// db helpers
const getAccounts = () => db('accounts');
const getAccountById = id =>
  db('accounts')
    .where({ id })
    .first();
const deleteAccount = id =>
  db('accounts')
    .where({ id })
    .del();
const addAccount = ({ name, budget }) =>
  db('accounts')
    .insert({ name, budget })
    .then(([id]) => getAccountById(id));
const updateAccount = (id, { name, budget }) =>
  db('accounts')
    .where({ id })
    .update({ name, budget })
    .then(count => (count > 0 ? getAccountById(id) : null));
// end db helpers

server.get('/accounts', async (req, res) => {
  try {
    const accounts = await getAccounts();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Couldn't retrieve the accounts" });
  }
});

server.get('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const account = await getAccountById(id);
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ error: 'No account with that id' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Couldn't retrieve the account with that id" });
  }
});

server.delete('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAccount(id);
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ error: "Couldn't delete the account with that id" });
  }
});

server.post('/accounts', async (req, res) => {
  const { name, budget } = req.body;
  try {
    if (name && budget) {
      const newAccount = await addAccount({ name, budget });
      res.status(201).json(newAccount);
    } else {
      res.status(400).json({ error: 'Please provide name and budget' });
    }
  } catch (error) {
    res.status(500).json({ error: "Couldn't add the account" });
  }
});
server.put('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, budget } = req.body;
  try {
    if (name && budget) {
      const updatedAccount = await updateAccount(id, { name, budget });
      res.status(200).json(updatedAccount);
    } else {
      res.status(400).json({ error: 'Please provide name and budget' });
    }
  } catch (error) {
    res.status(500).json({ error: "Couldn't add the account" });
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
