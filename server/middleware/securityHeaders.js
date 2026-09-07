const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], // allow inline scripts if needed
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    imgSrc: ["'self'", 'data:', "https://i.ibb.co", "https://*.cdn.ampproject.org"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    connectSrc: ["'self'", "http://localhost:5000", "https://evcyberacademy.com"],
    frameAncestors: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  },
  reportOnly: false
});
