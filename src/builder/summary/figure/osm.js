import leaflet from 'leaflet';

export default class OsmFigure {
  create(figure, data, format) {
    const view = format({ data, name: 'summary.osm' });

    if (view === null) {
      return null;
    }

    const div = figure.append('div');
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
