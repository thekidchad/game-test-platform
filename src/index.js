const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const db = require('./models');
const { STORE_URLS } = require('./constants/urls');
const { flatten } = require('./utils/arrays');
const { mapGameToModel } = require('./utils/gameMapper');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get('/api/games', (req, res) => db.Game.findAll()
  .then((games) => res.send(games))
  .catch((err) => {
    console.log('There was an error querying games', JSON.stringify(err));
    return res.send(err);
  }));

app.post('/api/games', (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  return db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    .then((game) => res.send(game))
    .catch((err) => {
      console.log('***There was an error creating a game', JSON.stringify(err));
      return res.status(400).send(err);
    });
});

app.post('/api/games/search', (req, res) => {
  const { name, platform } = req.body;
  const whereClause = {};

  if (name) {
    whereClause.name = db.Sequelize.where(
      db.Sequelize.fn('LOWER', db.Sequelize.col('name')),
      'LIKE',
      `%${name.toLowerCase()}%`,
    );
  }

  if (platform) {
    whereClause.platform = platform; // no need to lower case since it's a dropdown.
  }

  return db.Game.findAll({
    where: whereClause,
  })
    .then((games) => res.send(games))
    .catch((err) => {
      console.log('***Error searching games', JSON.stringify(err));
      res.status(400).send(err);
    });
});

app.delete('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => game.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('***Error deleting game', JSON.stringify(err));
      res.status(400).send(err);
    });
});

app.put('/api/games/:id', (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  return db.Game.findByPk(id)
    .then((game) => {
      const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
      return game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
        .then(() => res.send(game))
        .catch((err) => {
          console.log('***Error updating game', JSON.stringify(err));
          res.status(400).send(err);
        });
    });
});

app.post('/api/games/populate', async (req, res) => {
  const startTime = Date.now();

  try {
    const [androidResponse, iosResponse] = await Promise.all([
      axios.get(STORE_URLS.ANDROID),
      axios.get(STORE_URLS.IOS),
    ]);

    const androidGames = flatten(androidResponse.data)
      .map((game) => mapGameToModel({ ...game, platform: 'android' }));

    const iosGames = flatten(iosResponse.data)
      .map((game) => mapGameToModel({ ...game, platform: 'ios' }));

    const createdGames = await db.Game.bulkCreate([...androidGames, ...iosGames]);

    const timeElapsed = Date.now() - startTime;

    return res.send({
      message: 'Database populated successfully',
      gamesCount: createdGames.length,
      timeElapsed: `${timeElapsed}ms`,
    });
  } catch (err) {
    const timeElapsed = Date.now() - startTime;
    console.log('***Error populating games', JSON.stringify(err));
    return res.status(400).send({
      error: 'Failed to populate database',
      details: err.message,
      timeElapsed: `${timeElapsed}ms`,
    });
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;
