module.exports = {
  "extends": "airbnb-base",
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "no-underscore-dangle": ["error", { "allow": ["_renderer"] }] // Needed to find the DOM element of a Two.Circle
  }
};
