module.exports = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Baseline API reached',
    env: process.env.NODE_ENV,
    cwd: process.cwd(),
    time: new Date().toISOString()
  });
};
