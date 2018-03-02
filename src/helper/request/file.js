import { Request } from '@scola/http';
import FileSaver from 'file-saver';
import sprintf from 'sprintf-js';
import { select } from 'd3';

function clearRequest(node, datum, data = null) {
  const result = node.request.socket.status === 200;

  if (data === null) {
    node.request.socket.abort();
  } else if (result === true) {
    data.file = node.request.socket.response;
  }

  node.request.progress.remove();

  const button = select(node)
    .select('.ion-stop');

  if (result === false) {
    button.remove();
  } else {
    button
      .classed(datum.button, true)
      .classed('ion-stop', false)
      .datum(datum);
  }

  delete node.request;

  return result;
}

function sendRequest(datum, index, node, data, callback = () => {}) {
  select(node)
    .select('.' + datum.button)
    .classed(datum.button, false)
    .classed('ion-stop', true)
    .datum(datum);

  const progress = select(node.closest('li'))
    .append('div')
    .classed('progress', true);

  progress.append('span');

  const socket = new XMLHttpRequest();

  socket.open(datum.method || 'GET', sprintf.sprintf(datum.path, data));
  socket.responseType = datum.responseType || 'blob';

  socket.onload = () => {
    socket.onerror = null;
    socket.onload = null;
    socket.onprogress = null;
    socket.upload.onprogress = null;

    const result = clearRequest(node, datum, data);

    if (result === false) {
      callback(new Error(String(socket.status)));
      return;
    }

    if (datum.save === true || data.save === true) {
      FileSaver.saveAs(socket.response, data.name);
    }

    if (datum.callback) {
      datum.callback(null, socket.response);
    }

    callback(null, socket.response);
  };

  socket.onprogress = (event) => {
    const fraction = event.lengthComputable ?
      event.loaded / event.total : 1;

    if (fraction === 1) {
      progress.remove();
    } else {
      progress
        .select('span')
        .style('width', (fraction * 100) + '%');
    }
  };

  socket.upload.onprogress = socket.onprogress;

  socket.onerror = (error) => {
    clearRequest(node, datum, data, socket.response);

    if (datum.callback) {
      datum.callback(error);
    }

    callback(error);
  };

  const headers = Request.getHeaders() || {};
  const names = Object.keys(headers);

  for (let i = 0; i < names.length; i += 1) {
    socket.setRequestHeader(names[i], headers[names[i]]);
  }

  node.request = { socket, progress };

  socket.send();
}

export default function requestFile(datum, index, node, data, callback) {
  if (node.request) {
    clearRequest(node, datum);
    return;
  }

  if (data.file) {
    FileSaver.saveAs(data.file, data.name);
    return;
  }

  sendRequest(datum, index, node, data, callback);
}
