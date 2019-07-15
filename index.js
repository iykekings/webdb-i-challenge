const server = require('./server.js');
const db = require('./data/dbConfig');

const PORT = process.env.PORT || 4000;
const getAccounts = () => db('accounts');
const getAccountById = id =>
  db('accounts')
    .where({ id })
    .first();
const deleteAccount = id =>
  db('accounts')
    .where({ id })
    .del();

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

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
