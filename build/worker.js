
onmessage = function(e) {
  console.log('Message received from main script');
  console.log('e.data', e.data);

  // var dimensions = e.data[0];
  // console.log('dimensions', dimensions);

  // postMessage(workerResult);
  close();
}
