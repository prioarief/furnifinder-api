module.exports = (ms) =>
  new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(1);
    }, ms);
  });
