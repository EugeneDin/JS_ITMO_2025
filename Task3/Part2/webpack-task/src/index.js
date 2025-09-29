const moment = require('moment');

setInterval(() => {
  hh.textContent = moment().format('DD.MM.YYYY HH:mm:ss');
}, 1000);
