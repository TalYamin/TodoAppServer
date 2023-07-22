let requestNumber = 1;

function increaseRequestCounter() {
  return requestNumber++;
}

function decreaseRequestCounter() {
  return --requestNumber;
}

module.exports = {
  increaseRequestCounter,
  decreaseRequestCounter
};