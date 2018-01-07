import leaflet from 'leaflet';

export default class OsmFigure {
  render(datum, index, node, format) {
    const view = format({ name: 'summary.osm' });

    if (view === null) {
      return null;
    }

    const div = node.append('div');
    const map = leaflet.map(div.node(), {
      attributionControl: false,
      zoomControl: false
    });

    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(map);

    map.setView(...view);

    return div;
  }
}
