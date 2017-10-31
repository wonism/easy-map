import EasyMap from '../src';

const optionsForGoogle = {
  mapType: 'google',
  key: 'AIzaSyBL4Ugej1KvkfIrU2qOhoAkE85rKEcTApo',
  element: document.createElement('div'),
  source: {
    lat: 37.5666103,
    lng: 126.9783882,
    marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 48, height: 48, verticalAlign: 'top' },
    infoWindow: { content: '<div class="info-window">Source Marker</div>', maxWidth: 50 }
  },
  coords: [{
    lat: 37.5658528,
    lng: 126.9779845,
    name: 'Marker 1',
    marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 36, height: 36, verticalAlign: 'middle' },
    infoWindow: { content: '<div class="info-window">Marker 1<br>distance is {{distance m}}</div>', maxWidth: 50 }
  }],
  clickedNestedMarker: (cb, ids, strs) => {
    console.log(`cb's type is... ${ typeof cb }`);
    console.log(`ids's type is... ${ typeof ids }`);
    console.log(`strs's type is... ${ typeof strs }`);
  },
  option: {
    center: { lat: 37.5666103, lng: 126.9783882, },
    zoom: 14,
    mapTypeId: 'roadmap',
  },
};

const easyMapGoogle = new EasyMap(optionsForGoogle);

test('Create instance (google)', () => {
  expect(new EasyMap(optionsForGoogle)).toBeInstanceOf(EasyMap);
});

test('Get distance between 2 points. (google)', () => {
  expect(EasyMap.getDistance(easyMapGoogle.source, easyMapGoogle.coords[0])).toBeTruthy();
});

const optionsForNaver = {
  mapType: 'naver',
  key: 'ZINRRHtKwGpXNxXjcqwv',
  element: document.createElement('div'),
  source: {
    lat: 37.5666103,
    lng: 126.9783882,
    marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 48, height: 48, verticalAlign: 'top' },
    infoWindow: { content: '<div class="info-window">Source Marker</div>', maxWidth: 50 }
  },
  coords: [{
    lat: 37.5658528,
    lng: 126.9779845,
    name: 'Marker 1',
    marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 36, height: 36, verticalAlign: 'middle' },
    infoWindow: { content: '<div class="info-window">Marker 1<br>distance is {{distance m}}</div>', maxWidth: 50 }
  }],
  clickedNestedMarker: (cb, ids, strs) => {
    console.log(`cb's type is... ${ typeof cb }`);
    console.log(`ids's type is... ${ typeof ids }`);
    console.log(`strs's type is... ${ typeof strs }`);
  },
  option: {
    center: { lat: 37.5666103, lng: 126.9783882, },
    zoom: 10,
  },
};

const easyMapNaver = new EasyMap(optionsForNaver);

test('Create instance (naver)', () => {
  expect(new EasyMap(optionsForNaver)).toBeInstanceOf(EasyMap);
});

test('Get distance between 2 points. (naver)', () => {
  expect(EasyMap.getDistance(easyMapNaver.source, easyMapNaver.coords[0])).toBeTruthy();
});

function capitalize(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}
