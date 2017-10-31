/**
 * title   : Easy Map JS
 * author  : Jaewon <yocee57@gmail.com>
 * license : MIT
 * blog    : https://wonism.github.io
 * github  : https://github.com/wonism
 */
import fp from 'lodash/fp';
import { MAP_DICTIONARY } from './constants';
import initializer from './initializer';
import {
  createMarkersWithIcon,
  createMarkersWithoutIcon,
  markCurrentPositionWithIcon,
  markCurrentPositionWithoutIcon,
} from './marker';
import {
  makeInfoWindow,
  createMarkerInfoWindow,
  infoWindowCallback,
} from './infoWindow';

export default class EasyMap {
  static isValid(obj) {
    if (!fp.isNil(window.navigator.userAgent.match(/(msie [4-8]|opera mini)/i))) {
      throw new Error('This Browser doesn\'t support Maps.');
    }

    const { mapType, element, key, source, coords, closeInfoWindowAuto, clickedNestedMarket, option } = obj;

    if (!fp.get(mapType)(MAP_DICTIONARY)) {
      throw new Error(`mapType is to be one of ${fp.keys(MAP_DICTIONARY).join(', ')}.`);
    } else if (!fp.get('nodeType')(element)) {
      throw new Error('element must be DOM Element.');
    } else if (!fp.isString(key)) {
      throw new Error('key must be string.');
    } else if (!(fp.has('lat')(source) && fp.has('lng')(source))) {
      throw new Error('source must be object includes .lat, .lng.');
    } else if (!fp.isNil(coords) && !fp.isArray(coords)) {
      throw new Error('coords must be array.');
    } else if (!fp.isNil(closeInfoWindowAuto) && !fp.isBoolean(closeInfoWindowAuto)) {
      throw new Error('closeInfoWindowAuto must be boolean.');
    } else if (!fp.isNil(clickedNestedMarket) && !fp.isFunction(clickedNestedMarket)) {
      throw new Error('clickedNestedMarker must be function.');
    } else if (!fp.isNil(option) && !fp.isObject(option)) {
      throw new Error('option must be object.');
    }

    return true;
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  static getDistance(source, target) {
    const R = 6371000;

    const { deg2rad } = EasyMap;

    const dLat = deg2rad(target.lat - source.lat);
    const dLng = deg2rad(target.lng - source.lng);

    const a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
      (((Math.cos(deg2rad(target.lat)) * Math.cos(deg2rad(source.lat))) * Math.sin(dLng / 2)) * Math.sin(dLng / 2));
    const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const c = R * b;

    return Math.round(c);
  }

  static selectOne(that, id) {
    const selectedMarkerId = Number(id || 0);

    if (fp.map(({ markerId }) => markerId)(that.markers).indexOf(selectedMarkerId) > -1) {
      that.map.setCenter(that.coordsMarkers[selectedMarkerId].getPosition());

      if (that.closeInfoWindowAuto) {
        that.sourceInfoWindow.close();

        for (let i = 0, len = that.coords.length; i < len; i += 1) {
          that.coordsInfoWindows[i].close();
        }
      }

      that.coordsInfoWindows[that.coordsMarkers[selectedMarkerId].__id].open(
        that.map,
        that.coordsMarkers[selectedMarkerId]
      );
    }
  }

  constructor(obj) {
    this.version = '1.1.1';
    this.map = {};
    this.mapType = '';
    this.element = null;
    this.key = '';
    this.source = { lat: 37.5666103, lng: 126.9783882 };
    this.sourceMarker = {};
    this.sourceInfoWindow = {};
    this.coords = [];
    this.coordsMarkers = [];
    this.coordsInfoWindows = [];
    this.markers = [];
    this.closeInfoWindowAuto = true;
    this.clickedNestedMarker = () => {};
    this.option = null;

    if (EasyMap.isValid(obj)) {
      this.setProperties(obj);
    }
  }

  setProperties(obj) {
    this.mapType = obj.mapType;
    this.element = obj.element;
    this.key = obj.key;
    this.source = obj.source || this.source;
    this.coords = obj.coords || this.coords;
    this.closeInfoWindowAuto = obj.closeInfoWindowAuto || this.closeInfoWindowAuto;
    this.clickedNestedMarker = obj.clickedNestedMarker || this.clickedNestedMarker;

    if (obj.option) {
      this.option = obj.option;
    }
  }

  initGoogleOption(option) {
    return new window.google.maps.Map(this.element, option);
  }

  initNaverOption(option) {
    return new window.naver.maps.Map(this.element, option);
  }

  markCurrentPosition() {
    const { marker, infoWindow } = this.source;

    if (marker && marker.icon) {
      const markerPosition = {};
      const { width, height, verticalAlign, horizontalAlign } = marker;

      if (verticalAlign === 'top') {
        markerPosition.y = 0;
      } else if (verticalAlign === 'bottom') {
        markerPosition.y = height;
      } else {
        markerPosition.y = height / 2;
      }

      if (horizontalAlign === 'left') {
        markerPosition.x = 0;
      } else if (horizontalAlign === 'right') {
        markerPosition.x = Number(width);
      } else {
        markerPosition.x = Number(width) / 2;
      }

      if (fp.isFunction(markCurrentPositionWithIcon[this.mapType])) {
        this.sourceMarker = markCurrentPositionWithIcon[this.mapType](this, markerPosition, width, height);
      }
    } else if (this.sourceMarker) {
      if (fp.isFunction(markCurrentPositionWithoutIcon[this.mapType])) {
        this.sourceMarker = markCurrentPositionWithoutIcon[this.mapType](this);
      }
    }

    if (infoWindow && fp.isFunction(makeInfoWindow[this.mapType])) {
      this.sourceInfoWindow = makeInfoWindow[this.mapType](infoWindow);
    }
  }

  createMarkers() {
    for (let i = 0, len = this.coords.length; i < len; i += 1) {
      const coord = this.coords[i];
      const { infoWindow, marker } = coord;

      if (marker && marker.icon) {
        const markerPosition = {};
        const { width, height, verticalAlign, horizontalAlign } = marker;

        if (verticalAlign === 'top') {
          markerPosition.y = 0;
        } else if (verticalAlign === 'bottom') {
          markerPosition.y = height;
        } else {
          markerPosition.y = height / 2;
        }

        if (horizontalAlign === 'left') {
          markerPosition.x = 0;
        } else if (horizontalAlign === 'right') {
          markerPosition.x = Number(width);
        } else {
          markerPosition.x = Number(width) / 2;
        }

        if (fp.isFunction(createMarkersWithIcon[this.mapType])) {
          this.coordsMarkers[i] = createMarkersWithIcon[this.mapType](this, coord, markerPosition, width, height);
        }
      } else if (marker) {
        if (fp.isFunction(createMarkersWithoutIcon[this.mapType])) {
          this.coordsMarkers[i] = createMarkersWithoutIcon[this.mapType](this, coord);
        }
      }

      this.coordsMarkers[i].__id = i;
      this.coordsMarkers[i].__name = coord.name || i;
      this.coordsMarkers[i].__distance = EasyMap.getDistance(this.source, coord);

      if (infoWindow && fp.isFunction(createMarkerInfoWindow[this.mapType])) {
        this.coordsInfoWindows[i] = createMarkerInfoWindow[this.mapType](this, infoWindow, i);
      }
    }
  }

  renderMap() {
    this.markCurrentPosition();
    this.createMarkers();
    this.subscribeInfoWindow();
  }

  start() {
    if (fp.isFunction(initializer[this.mapType])) {
      initializer[this.mapType](this);
    }
  }

  subscribeInfoWindow() {
    if (fp.isFunction(initializer[this.mapType])) {
      infoWindowCallback[this.mapType](this, EasyMap);
    }
  }
}
