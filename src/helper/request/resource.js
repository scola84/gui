import { Request } from '@scola/http';
import FileSaver from 'file-saver';
import sprintf from 'sprintf-js';
import { select } from 'd3';

function clearRequest(box, data = null) {
  const request = box.node.request;
  const result = request.socket.status === 200;

  if (data === null) {
    request.socket.abort();
  } else if (result === true) {
    data.data = request.socket.response;
  }

  if (request.progress) {
    request.progress.remove();

    const button = select(box.node)
      .select('.ion-ios-square');

    if (result === false) {
      button.remove();
    } else {
      button
        .classed(box.button, true)
        .classed('ion-ios-square', false)
        .datum(request);
    }
  }

  const panel = box.node.closest ?
    box.node.closest('.panel') : null;

  select(panel).on('remove.scola-request', null);

  delete box.node.request;

  return result;
}

function prepareProgress(box) {
  select(box.node)
    .select('.' + box.button)
    .classed(box.button, false)
    .classed('ion-ios-square', true)
    .datum(box);

  const progress = select(box.node.closest('li'))
    .append('div')
    .classed('progress', true);

  progress.append('span');

  return progress;
}

function sendRequest(box, data, callback) {
  const progress = box.button ? prepareProgress(box) : null;
  const socket = new XMLHttpRequest();

  socket.open(box.method || 'GET', sprintf.sprintf(box.path, data));
  socket.responseType = box.responseType || 'blob';

  const panel = box.node.closest ?
    box.node.closest('.panel') : null;

  select(panel).on('remove.scola-request', () => {
    clearRequest(box);
  });

  socket.onabort = () => {
    socket.onabort = null;
    socket.onerror = null;
    socket.onload = null;
    socket.onprogress = null;
    socket.upload.onprogress = null;
  };

  socket.onerror = (error) => {
    clearRequest(box, data);

    if (box.callback) {
      box.callback(error);
    }

    callback(error);
  };

  socket.onload = () => {
    socket.onabort = null;
    socket.onerror = null;
    socket.onload = null;
    socket.onprogress = null;
    socket.upload.onprogress = null;

    const result = clearRequest(box, data);

    if (result === false) {
      callback(new Error(String(socket.status)));
      return;
    }

    if (box.save === true || data.save === true) {
      FileSaver.saveAs(socket.response, data.name);
    }

    if (box.callback) {
      box.callback(null, socket.response);
    }

    callback(null, socket.response);
  };

  if (progress) {
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
  }

  const headers = Request.getHeaders() || {};
  const names = Object.keys(headers);

  for (let i = 0; i < names.length; i += 1) {
    socket.setRequestHeader(names[i], headers[names[i]]);
  }

  if (box.method === 'POST' || box.method === 'PUT') {
    if (data) {
      socket.setRequestHeader('Content-Type', 'application/json');
    }
  }

  box.node.request = { socket, progress };
  const jsonData = data ? JSON.stringify(data) : data;

  socket.send(jsonData);
}

export default function requestResource(box, data = {}, callback = () => {}) {
  box.node = box.node || {};

  if (typeof box.node.request !== 'undefined') {
    clearRequest(box);
    return;
  }

  const save = typeof data.data !== 'undefined' &&
    data.data !== null &&
    typeof data.name !== 'undefined';

  if (save) {
    FileSaver.saveAs(data.data, data.name);
    return;
  }

  sendRequest(box, data, callback);
}
