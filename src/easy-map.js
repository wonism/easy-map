/**
 *
 * title   : Easy Map JS
 *
 * version : 1.0.3
 *
 * author  : Jaewon <yocee57@gmail.com>
 *
 * license : MIT
 *
 * blog    : https://jaewonism.com
 *
 * github  : https://github.com/wonism
 *
 */

const UnsupportedBrowser = window.navigator.userAgent.match(/(msie [4-8]|opera mini)/i) ? true : false;

class EasyMap {
  constructor(obj) {
    this.version = '1.0.3';

    this.availableMaps = ['google', 'naver'];

    this.map = {};

    this.mapType = '';
    this.element = null;
    this.key = '';

    this.source = { lat: 37.5666103, lng: 126.9783882, };
    this.sourceMarker = {};
    this.sourceInfoWindow = {};

    this.coords = [];
    this.coordsMarkers = [];
    this.coordsInfoWindows = [];

    this.markerNames = [];
    this.markerIds = [];

    this.closeInfoWindowAuto = true;
    this.clickedNestedMarker = () => {};

    this.option = null;

    if (this.isValid(obj)) {
      this.setProperties(obj);
    }
  }

  isValid(obj) {
    let errorMessage = '';

    UnsupportedBrowser && (errorMessage = `This Browser doesn't support Maps.`);

    !obj.mapType && (errorMessage = 'mapType is required.');
    typeof obj.mapType !== 'string' && (errorMessage = 'mapType must be string.');
    this.availableMaps.indexOf(obj.mapType.toLowerCase()) === -1 && (errorMessage = `mapType must be included in ${ this.availableMaps.join(', ') }.`);
    !obj.element && (errorMessage = 'element is required.');
    !obj.element.nodeType && (errorMessage = 'element must be DOM Element.');
    !obj.key && (errorMessage = 'key is required.');
    typeof obj.key !== 'string' && (errorMessage = 'key must be string.');
    obj.source && typeof obj.source !== 'object' && (errorMessage = 'source must be object includes .lat, .lng.');
    obj.coords && !Array.isArray(obj.coords) && (errorMessage = 'coords must be array.');
    obj.closeInfoWindowAudo && typeof obj.closeInfoWindowAuto !== 'boolean' && (errorMessage = 'closeInfoWindowAuto must be boolean.');
    obj.clickedNestedMarker && typeof obj.clickedNestedMarker !== 'function' && (errorMessage = 'clickedNestedMarker must be function.');
    obj.option && typeof obj.option !== 'object' && (errorMessage = 'option must be object.');

    if (errorMessage) {
      throw new Error(errorMessage);
    } else {
      return true;
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
    obj.option && (this.option = obj.option);
  }

  getDistance(source, target) {
    const R = 6371000;
    let dLat, dLng, a, b, c;

    dLat = this.deg2rad(target.lat - source.lat);
    dLng = this.deg2rad(target.lng - source.lng);

    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(target.lat)) * Math.cos(this.deg2rad(source.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    c = R * b;

    return Math.round(c);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  initGoogleOption(option) {
    return new google.maps.Map(this.element, option);
  }

  initNaverOption(option) {
    return new naver.maps.Map(this.element, option);
  }

  markCurrentPosition() {
    const marker = this.source.marker;
    const infoWindow = this.source.infoWindow;

    if (marker && marker.icon) {
      const markerPosition = {};
      const width = +marker.width;
      const height = +marker.height;
      const verticalAlign = marker.verticalAlign;
      const horizontalAlign = marker.horizontalAlign;
      const useSizeOption = !!(width && height);

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
        markerPosition.x = width;
      } else {
        markerPosition.x = width / 2;
      }

      switch (this.mapType) {
        case 'google': {
          if (useSizeOption) {
            this.sourceMarker = new google.maps.Marker({
              position: this.source,
              map: this.map,
              icon: new google.maps.MarkerImage(
                this.source.marker.icon,
                new google.maps.Size(width, height),
                new google.maps.Point(0, 0),
                new google.maps.Point(markerPosition.x, markerPosition.y),
                new google.maps.Size(width, height)
              ),
            });
          } else {
            this.sourceMarker = new google.maps.Marker({
              position: this.source,
              map: this.map,
              icon: new google.maps.MarkerImage(
                this.source.marker.icon
              ),
            });
          }
          break;
        }
        case 'naver': {
          if (useSizeOption) {
            this.sourceMarker = new naver.maps.Marker({
              position: this.source,
              map: this.map,
              icon: {
                url: this.source.marker.icon,
                size: new naver.maps.Size(width, height),
                scaledSize: new naver.maps.Size(width, height),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(markerPosition.x, markerPosition.y),
              },
            });
          } else {
            this.sourceMarker = new naver.maps.Marker({
              position: this.source,
              map: this.map,
              icon: {
                url: this.source.marker.icon,
              },
            });
          }
          break;
        }
        default: {
          break;
        }
      }
    } else if (this.sourceMarker) {
      switch (this.mapType) {
        case 'google': {
          this.sourceMarker = new google.maps.Marker({
            position: this.source,
            map: this.map,
          });
          break;
        }
        case 'naver': {
          this.sourceMarker = new naver.maps.Marker({
            position: this.source,
            map: this.map,
          });
          break;
        }
        default: {
          break;
        }
      }
    }

    if (infoWindow) {
      const infoWindowContent = (infoWindow && infoWindow.content) || '';

      switch (this.mapType) {
        case 'google': {
          this.sourceInfoWindow = new google.maps.InfoWindow({ ...infoWindow, content: infoWindowContent, });
          break;
        }
        case 'naver': {
          this.sourceInfoWindow = new naver.maps.InfoWindow({ ...infoWindow, content: infoWindowContent, });
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  selectOne(that, selectedMarkerId) {
    selectedMarkerId = +selectedMarkerId || 0;

    if (that.markerIds.indexOf(selectedMarkerId) > -1) {
      that.map.setCenter(that.coordsMarkers[selectedMarkerId].getPosition());

      if (that.closeInfoWindowAuto) {
        that.sourceInfoWindow.close();

        for (let i = 0, len = that.coords.length; i < len; i++) {
          that.coordsInfoWindows[i].close();
        }
      }

      that.coordsInfoWindows[that.coordsMarkers[selectedMarkerId].__id].open(that.map, that.coordsMarkers[selectedMarkerId]);
    }
  }

  createMarkers() {
    let width, height, verticalAlign, horizontalAlign, useSizeOption;

    for (let i = 0, len = this.coords.length; i < len; i++) {
      const coord = this.coords[i];
      const infoWindow = coord.infoWindow;
      const marker = coord.marker;

      if (marker && marker.icon) {
        const markerPosition = {};

        width = +marker.width;
        height = +marker.height;
        verticalAlign = marker.verticalAlign;
        horizontalAlign = marker.horizontalAlign;
        useSizeOption = !!(width && height);

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
          markerPosition.x = width;
        } else {
          markerPosition.x = width / 2;
        }

        switch (this.mapType) {
          case 'google': {
            if (useSizeOption) {
              this.coordsMarkers[i] = new google.maps.Marker({
                position: coord,
                map: this.map,
                icon: new google.maps.MarkerImage(
                  coord.marker.icon,
                  new google.maps.Size(width, height),
                  new google.maps.Point(0, 0),
                  new google.maps.Point(markerPosition.x, markerPosition.y),
                  new google.maps.Size(width, height)
                ),
              });
            } else {
              this.coordsMarkers[i] = new google.maps.Marker({
                position: coord,
                map: this.map,
                icon: new google.maps.MarkerImage(
                  coord.marker.icon
                ),
              });
            }
            break;
          }
          case 'naver': {
            if (useSizeOption) {
              this.coordsMarkers[i] = new naver.maps.Marker({
                position: coord,
                map: this.map,
                icon: {
                  url: coord.marker.icon,
                  size: new naver.maps.Size(width, height),
                  scaledSize: new naver.maps.Size(width, height),
                  origin: new naver.maps.Point(0, 0),
                  anchor: new naver.maps.Point(markerPosition.x, markerPosition.y),
                },
              });
            } else {
              this.coordsMarkers[i] = new naver.maps.Marker({
                position: coord,
                map: this.map,
                icon: {
                  url: coord.marker.icon,
                },
              });
            }
            break;
          }
          default: {
            break;
          }
        }
      } else if (marker) {
        switch (this.mapType) {
          case 'google': {
            this.coordsMarkers[i] = new google.maps.Marker({
              position: coord,
              map: this.map,
            });
            break;
          }
          case 'naver': {
            this.coordsMarkers[i] = new naver.maps.Marker({
              position: coord,
              map: this.map,
            });
            break;
          }
          default: {
            break;
          }
        }
      }

      this.coordsMarkers[i].__id = i;
      this.coordsMarkers[i].__name = coord.name || i;
      this.coordsMarkers[i].__distance = this.getDistance(this.source, coord);

      if (infoWindow) {
        let infoWindowContent = (infoWindow && infoWindow.content) || '';

        infoWindowContent = infoWindowContent
          .replace(/\{{2}distance\s?km\}{2}/gi, `${ this.coordsMarkers[i].__distance / 1000 }km`)
          .replace(/\{{2}distance\s?m\}{2}/gi, `${ this.coordsMarkers[i].__distance }m`)
          .replace(/\{{2}distance\s?ft\}{2}/gi, `${ this.coordsMarkers[i].__distance / 0.3048 } ft`)
          .replace(/\{{2}distance\s?yd\}{2}/gi, `${ this.coordsMarkers[i].__distance / 0.9144 }yd`);

        switch (this.mapType) {
          case 'google': {
            this.coordsInfoWindows[i] = new google.maps.InfoWindow({ ...infoWindow, content: infoWindowContent, });
            break;
          }
          case 'naver': {
            this.coordsInfoWindows[i] = new naver.maps.InfoWindow({ ...infoWindow, content: infoWindowContent, });
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  renderMap() {
    this.markCurrentPosition();
    this.createMarkers();
    this.subscribeInfoWindow();
  }

  start() {
    const script = document.createElement('script');
    script.type = 'text/javascript';

    switch(this.mapType) {
      case 'google': {
        const timestamp = +new Date();

        script.src = `//maps.googleapis.com/maps/api/js?key=${ this.key }&callback=easyMap${ timestamp }&libraries=geometry`;
        window[`easyMap${ timestamp }`] = () => {
          this.map = this.initGoogleOption(this.option || {
            center: this.source,
            zoom: 14,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            panControl: true,
            zoomControl: true,
            scaleControl: true,
          });

          this.renderMap();
        };

        break;
      }
      case 'naver': {
        script.src = `//openapi.map.naver.com/openapi/v3/maps.js?clientId=${ this.key }`;
        script.onload = () => {
          this.map = this.initNaverOption(this.option || {
            center: this.source,
            zoom: 10,
          });

          this.renderMap();
        };
        break;
      }
      default: {
        break;
      }
    }

    document.body.appendChild(script);
  }

  subscribeInfoWindow() {
    const that = this;

    switch (this.mapType) {
      case 'google': {
        google.maps.event.addListener(this.sourceMarker, 'click', function () {
          that.map.setCenter(this.getPosition());

          if (that.closeInfoWindowAuto) {
            for (let i = 0, len = that.coordsInfoWindows.length; i < len; i++) {
              that.coordsInfoWindows[i].close();
            }
          }

          that.sourceInfoWindow.open(that.map, this);
        });

        for (let i = 0, len = this.coords.length; i < len; i++) {
          google.maps.event.addListener(that.coordsMarkers[i], 'click', function () {
            const tempCoordsArr = [];

            for (let j = 0, len2 = that.coordsMarkers.length; j < len2; j++) {
              if (this.getPosition().lat() === that.coordsMarkers[j].position.lat() && this.getPosition().lng() === that.coordsMarkers[j].position.lng()) {
                tempCoordsArr.push(that.coordsMarkers[j]);
              }
            }

            if (tempCoordsArr.length === 1 || typeof that.clickedNestedMarker !== 'function') {
              that.map.setCenter(this.getPosition());

              if (that.closeInfoWindowAuto) {
                that.sourceInfoWindow.close();

                for (let j = 0, len2 = that.coordsInfoWindows.length; j < len2; j++) {
                  that.coordsInfoWindows[j].close();
                }
              }

              that.coordsInfoWindows[that.coordsMarkers[i].__id].open(that.map, this);
            } else {
              that.markerNames.length = 0;
              that.markerIds.length = 0;

              for (let j = 0, len2 = tempCoordsArr.length; j < len2; j++) {
                that.markerNames.push(`${ tempCoordsArr[j].__id }. ${ tempCoordsArr[j].__name }`);
                that.markerIds.push(tempCoordsArr[j].__id);
              }

              that.clickedNestedMarker((userInput) => { that.selectOne(that, userInput); }, that.markerIds, that.markerNames.join('\n'));
            }
          });
        }
        break;
      }
      case 'naver': {
        naver.maps.Event.addListener(this.sourceMarker, 'click', function () {
          that.map.setCenter(that.sourceMarker.position);

          if (that.sourceInfoWindow.getMap()) {
            that.sourceInfoWindow.close();
          } else {
            that.sourceInfoWindow.open(that.map, that.sourceMarker);
          }

          if (that.closeInfoWindowAuto) {
            for (let i = 0, len = that.coordsInfoWindows.length; i < len; i++) {
              that.coordsInfoWindows[i].close();
            }
          }
        });

        for (let i = 0, len = this.coords.length; i < len; i++) {
          naver.maps.Event.addListener(that.coordsMarkers[i], 'click', function () {
            const tempCoordsArr = [];

            for (let j = 0, len2 = that.coordsMarkers.length; j < len2; j++) {
              if (that.coordsMarkers[i].position._lat === that.coordsMarkers[j].position._lat && that.coordsMarkers[i].position._lng === that.coordsMarkers[j].position._lng) {
                tempCoordsArr.push(that.coordsMarkers[j]);
              }
            }

            if (tempCoordsArr.length === 1 || typeof that.clickedNestedMarker !== 'function') {
              if (that.closeInfoWindowAuto) {
                that.sourceInfoWindow.close();

                for (let j = 0, len2 = that.coordsInfoWindows.length; j < len2; j++) {
                  that.coordsInfoWindows[j].close();
                }
              }

              if (that.coordsInfoWindows[i].getMap()) {
                that.coordsInfoWindows[i].close();
              } else {
                that.coordsInfoWindows[i].open(that.map, that.coordsMarkers[i]);
              }

              that.map.setCenter(that.coordsInfoWindows[i].position);
            } else {
              that.markerNames.length = 0;
              that.markerIds.length = 0;

              for (let j = 0, len2 = tempCoordsArr.length; j < len2; j++) {
                that.markerNames.push(`${ tempCoordsArr[j].__id }. ${ tempCoordsArr[j].__name }`);
                that.markerIds.push(tempCoordsArr[j].__id);
              }

              that.clickedNestedMarker((userInput) => { that.selectOne(that, userInput); }, that.markerIds, that.markerNames.join('\n'));
            }
          });
        }
        break;
      }
      default: {
        break;
      }
    }
  }
}

((root, factory) => {
  root = root || window;

  if (typeof root.define === 'function' && root.define.amd) {
    return define([], factory);
  } else if (typeof root.module === 'object' && root.module.exports) {
    return module.exports = factory();
  } else {
    return root.EasyMap = factory();
  }
})(this, () => {
  return EasyMap;
});

