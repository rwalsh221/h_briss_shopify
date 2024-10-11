const displayMap = () => {
  const mapContainer = document.querySelector('.map');
  const dataLng = mapContainer.dataset.lng;
  const dataLat = mapContainer.dataset.lat;
  const dataMarker = mapContainer.dataset.marker;

  mapboxgl.accessToken =
    'pk.eyJ1Ijoicmlja3lyaWNhcmRpbmhvIiwiYSI6ImNrZTRuMGJteTAycWEyenBvbDRpZW12ZDcifQ.P0eovMFE3-zpXFL8TXAnhg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rickyricardinho/ckgf9w7h12h7n19pds7npab31',
    center: [dataLng, dataLat],
    zoom: 15,
  });

  new mapboxgl.Marker().setLngLat([dataLng, dataLat]).addTo(map);

  var markerHeight = 50,
    markerRadius = 10,
    linearOffset = 25;

  var popupOffsets = {
    top: [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    bottom: [0, -markerHeight],
    'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
  };

  new mapboxgl.Popup({ offset: popupOffsets, className: 'map__popup' })
    .setLngLat([-1.9683, 53.46315])
    .setHTML(`<h4>${dataMarker}</h4>`)
    .setMaxWidth('none')
    .addTo(map);
};

displayMap();
