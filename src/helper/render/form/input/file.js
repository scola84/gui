import { select } from 'd3';
import bytes from 'bytes';
import requestResource from '../../../request/resource';

export default class FileInput {
  render(datum, index, node, format) {
    if (datum.view) {
      return this._viewFile(datum, index, node, format);
    }

    const id = 'input-' + datum.name + '-' + index;

    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap', true);

    wrap
      .append('label')
      .attr('for', id)
      .classed('placeholder', true)
      .text(format('placeholder'));

    const input = wrap
      .append('input')
      .attr('id', id)
      .attr('accept', datum.accept)
      .attr('multiple', datum.array ? 'multiple' : null)
      .attr('type', 'file')
      .on('change', () => {
        if (datum.preview) {
          this._previewFiles(input, format);
        }
      });

    return input;
  }

  _handleRequest(datum, index, node, file, format, error, blob) {
    if (error) {
      this._showMessage(node, format);
      return;
    }

    const [
      thumbnail = 'thumbnail',
      original = 'original'
    ] = datum.version || [];

    if (file.type.match(/^image\//)) {
      file.data = file.version === thumbnail ? null : file.data;
      file.save = true;
      file.version = original;
      this._showImage(node, blob);
    } else {
      requestResource(datum, index, node.node(), file, format);
    }
  }

  _previewFile(file, input, format) {
    const form = input
      .node()
      .closest('form');

    const block = select(form)
      .append('div')
      .classed('block file', true)
      .datum(file);

    const list = block
      .append('ul');

    block
      .append('span')
      .classed('title', true);

    const item = list
      .append('li');

    const primary = item
      .append('div')
      .classed('primary', true);

    primary
      .append('span')
      .classed('l0', true)
      .text(`${file.name} (${bytes(file.size)})`);

    if (file.type.match(/^image\//)) {
      this._previewImage(primary, file);
    } else {
      this._previewNone(primary, format);
    }

    const secondary = item
      .append('div')
      .classed('secondary', true);

    secondary
      .append('button')
      .attr('tabindex', 0)
      .attr('type', 'button')
      .classed('button ion-ios-close-outline', true)
      .on('click', () => {
        block.remove();
      });
  }

  _previewFiles(input, format) {
    const files = input.node().files;

    for (let i = 0; i < files.length; i += 1) {
      this._previewFile(files[i], input, format);
    }
  }

  _previewImage(primary, file) {
    const url = URL.createObjectURL(file);

    primary
      .append('span')
      .classed('l1', true)
      .append('img')
      .attr('src', url);
  }

  _previewNone(primary, format) {
    primary
      .append('span')
      .classed('l1', true)
      .text(format('nopreview'));
  }

  _showImage(node, blob) {
    const url = URL.createObjectURL(blob);

    const primary = node
      .select('.primary');

    const all = primary
      .selectAll('.l1')
      .data([0]);

    const enter = all
      .enter()
      .append('span')
      .classed('l1', true);

    enter
      .append('img');

    all
      .merge(enter)
      .select('img')
      .attr('src', url);
  }

  _showMessage(node, format) {
    const primary = node
      .select('.primary');

    const all = primary
      .selectAll('.l1')
      .data([0]);

    const enter = all
      .enter()
      .append('span')
      .classed('l1', true);

    all
      .merge(enter)
      .text(format('nopreview'));
  }

  _viewFile(datum, index, node, format) {
    const file = format('value');

    const [
      thumbnail = 'thumbnail',
      original = 'original'
    ] = datum.version || [];

    node
      .select('.input')
      .remove();

    const primary = node
      .append('div')
      .classed('primary', true);

    primary
      .append('span')
      .classed('l0', true)
      .text(`${file.name} (${bytes(file.size)})`);

    const secondary = node
      .append('div')
      .classed('secondary', true);

    secondary
      .append('button')
      .attr('tabindex', 0)
      .attr('type', 'button')
      .classed('button', true)
      .classed(datum.button, true)
      .on('click', () => {
        requestResource(datum, index, node.node(), file, (error, blob) => {
          this._handleRequest(datum, index, node, file, format, error, blob);
        });
      });

    if (file.type.match(/^image\//)) {
      file.version = thumbnail;
      requestResource(datum, index, node.node(), file, (error, blob) => {
        this._handleRequest(datum, index, node, file, format, error, blob);
      });
    } else {
      file.version = original;
      this._showMessage(node, format);
    }
  }
}
