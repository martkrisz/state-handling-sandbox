import getHistoryPromisified from '../custom-stored/store-helper.service';

const historyPromise = getHistoryPromisified();

historyPromise.then(history => {
  document.body.childNodes(childNode => document.body.removeChild(childNode));
  history.forEach(historyFragment => {
    document.body.appendChild(historyFragment);
  })
});
