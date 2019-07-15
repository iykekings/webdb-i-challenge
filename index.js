const server = require('./server.js');
const db = require('./data/dbConfig');

const PORT = process.env.PORT || 4000;
const getAccounts = () => db('accounts');

server.get('/', async (req, res) => {
  try {
    const accounts = await getAccounts();
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ error: "Couldn't retrieve the accounts" });
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
