const mapGameToModel = (game) => ({
  publisherId: game.publisher_id,
  name: game.name,
  platform: game.platform,
  storeId: game.app_id ? game.app_id.toString() : null,
  bundleId: game.bundle_id,
  appVersion: game.version || '1.0',
  isPublished: true,
});

module.exports = {
  mapGameToModel,
};
