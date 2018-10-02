import { select } from 'd3';
import { formatters } from '@scola/d3-string-format';
import requestResource from '../../../request/resource';

export default class FileInput {
  render(datum, index, node, format) {
    const urls = [];

    const panel = node
      .node()
      .closest('.panel');

    select(panel).on('remove.scola-file', () => {
      for (let i = 0; i < urls.length; i += 1) {
        URL.revokeObjectURL(urls[i]);
      }
    });

    if (datum.view) {
      return this._viewFile(datum, index, node, format, urls);
    }

    const id = 'input-' + datum.name + '-' + index;

    const wrap = node
      .select('.input')
      .append('div')
      .classed('wrap file', true);

    const label = wrap
      .append('label')
      .attr('for', id)
      .classed('placeholder', true)
      .text(format('placeholder'));

    label
      .append('span')
      .classed('value');

    const input = wrap
      .append('input')
      .attr('id', id)
      .attr('accept', datum.accept)
      .attr('multiple', datum.array ? 'multiple' : null)
      .attr('type', 'file')
      .on('change', () => {
        this._setPlaceholder(datum, label, input, format);

        if (datum.preview) {
          this._previewFiles(input, format, urls);
        }
      });

    return input;
  }

  _setPlaceholder(datum, label, input, format) {
    const files = input.node().files;

    datum.value = () => {
      return {
        count: files.length,
        name: files[0] && files[0].name
      };
    };

    label
      .select('span')
      .text(format('value'));

    delete datum.value;
  }

  _handleRequest(datum, index, node, file, format, error, blob, urls) {
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
      this._showImage(node, blob, urls);
    } else {
      const box = Object.assign({ datum, node: node.node() }, datum);
      requestResource(box, file, format);
    }
  }

  _previewFile(file, input, format, urls) {
    const form = input
      .node()
      .closest('form');

    const block = select(form)
      .append('div')
      .classed('block file', true)
      .datum(file);

    block
      .append('div')
      .classed('title', true);

    const list = block
      .append('ul')
      .classed('body', true);

    const item = list
      .append('li');

    const primary = item
      .append('div')
      .classed('primary', true);

    const size = formatters.si.format([file.size], '%(B)si', ['%(B)si']);

    primary
      .append('span')
      .classed('l0', true)
      .text(`${file.name} (${size})`);

    if (file.type.match(/^image\//)) {
      this._previewImage(primary, file, urls);
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
      .classed('button ion-ios-close-circle-outline', true)
      .on('click', () => {
        block.remove();
      });
  }

  _previewFiles(input, format, urls) {
    const files = input.node().files;

    for (let i = 0; i < files.length; i += 1) {
      this._previewFile(files[i], input, format, urls);
    }
  }

  _previewImage(primary, file, urls) {
    const url = URL.createObjectURL(file);
    urls[urls.length] = url;

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

  _showImage(node, blob, urls) {
    const url = URL.createObjectURL(blob);
    urls[urls.length] = url;

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

  _viewFile(datum, index, node, format, urls) {
    const file = format('data');

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

    const size = formatters.si.format([file.size], '%(B)si', ['%(B)si']);

    primary
      .append('span')
      .classed('l0', true)
      .text(`${file.name} (${size})`);

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
        const box = Object.assign({ datum, node: node.node() }, datum);
        requestResource(box, file, (error, blob) => {
          this._handleRequest(datum, index, node, file,
            format, error, blob, urls);
        });
      });

    if (file.type.match(/^image\//)) {
      file.version = thumbnail;
      const box = Object.assign({ datum, node: node.node() }, datum);
      requestResource(box, file, (error, blob) => {
        this._handleRequest(datum, index, node, file,
          format, error, blob, urls);
      });
    } else {
      file.version = original;
      this._showMessage(node, format);
    }
  }
}
