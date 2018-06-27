const path = require('path');
const router = require('express').Router();

router.get('/disqus.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'disqus.html'));
});

module.exports = router
