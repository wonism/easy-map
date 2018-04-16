import fp from 'lodash/fp';
import { GOOGLE, NAVER, DAUM } from './constants';

const replaceContent = (that, i) => fp.flow(
  fp.replace(/\{{2}distance\s?km\}{2}/gi, `${that.coordsMarkers[i].__distance / 1000}km`),
  fp.replace(/\{{2}distance\s?m\}{2}/gi, `${that.coordsMarkers[i].__distance}m`),
  fp.replace(/\{{2}distance\s?ft\}{2}/gi, `${that.coordsMarkers[i].__distance / 0.3048} ft`),
  fp.replace(/\{{2}distance\s?yd\}{2}/gi, `${that.coordsMarkers[i].__distance / 0.9144}yd`)
);

export const createMarkerInfoWindow = {
  [GOOGLE]: (that, infoWindow, i) => {
    const { content } = infoWindow;
    const infoWindowContent = replaceContent(that, i)(content);

    return new window.google.maps.InfoWindow({
      ...infoWindow,
      content: infoWindowContent,
    });
  },
  [NAVER]: (that, infoWindow, i) => {
    const { content } = infoWindow;
    const infoWindowContent = replaceContent(that, i)(content);

    return new window.naver.maps.InfoWindow({
      ...infoWindow,
      content: infoWindowContent,
    });
  },
  [DAUM]: (that, infoWindow, i) => {
    const { content } = infoWindow;
    const infoWindowContent = replaceContent(that, i)(content);

    return new window.daum.maps.InfoWindow({
      ...infoWindow,
      content: infoWindowContent,
    });
  },
};

export const makeInfoWindow = {
  [GOOGLE]: (infoWindow, that) => {
    const { isOpen } = infoWindow;
    const iw = new window.google.maps.InfoWindow({
      ...infoWindow,
      content: infoWindow.content || '',
    });

    if (isOpen) {
      iw.open(that.map, that.sourceMarker);
    }

    return iw;
  },
  [NAVER]: (infoWindow, that) => {
    const { isOpen } = infoWindow;
    const iw = new window.naver.maps.InfoWindow({
      ...infoWindow,
      content: infoWindow.content || '',
    });

    if (isOpen) {
      iw.open(that.map, that.sourceMarker);
    }

    return iw;
  },
  [DAUM]: (infoWindow, that) => {
    const { isOpen } = infoWindow;
    const iw = new window.daum.maps.InfoWindow({
      ...infoWindow,
      content: infoWindow.content || '',
    });

    if (isOpen) {
      iw.open(that.map, that.sourceMarker);
    }

    return iw;
  },
};

export const infoWindowCallback = {
  [GOOGLE]: (that, EasyMap) => {
    window.google.maps.event.addListener(that.sourceMarker, 'click', function f() {
      that.map.setCenter(this.getPosition());

      if (that.closeInfoWindowAuto) {
        for (let i = 0, len = that.coordsInfoWindows.length; i < len; i += 1) {
          that.coordsInfoWindows[i].close();
        }
      }

      that.sourceInfoWindow.open(that.map, this);
    });

    for (let i = 0, len = that.coords.length; i < len; i += 1) {
      window.google.maps.event.addListener(that.coordsMarkers[i], 'click', function f() {
        const tempCoordsArr = [];

        for (let j = 0, len2 = that.coordsMarkers.length; j < len2; j += 1) {
          if (this.getPosition().lat() === that.coordsMarkers[j].position.lat() &&
              this.getPosition().lng() === that.coordsMarkers[j].position.lng()) {
            tempCoordsArr.push(that.coordsMarkers[j]);
          }
        }

        if (tempCoordsArr.length === 1 || !fp.isFunction(that.clickedNestedMarker)) {
          that.map.setCenter(this.getPosition());

          if (that.closeInfoWindowAuto) {
            that.sourceInfoWindow.close();

            for (let j = 0, len2 = that.coordsInfoWindows.length; j < len2; j += 1) {
              that.coordsInfoWindows[j].close();
            }
          }

          that.coordsInfoWindows[that.coordsMarkers[i].__id].open(that.map, this);
        } else {
          that.markers.length = 0;

          for (let j = 0, len2 = tempCoordsArr.length; j < len2; j += 1) {
            that.markers.push({
              markerId: tempCoordsArr[j].__id,
              markerName: `${tempCoordsArr[j].__id}. ${tempCoordsArr[j].__name}`,
            });
          }

          that.clickedNestedMarker(
            (userInput) => { EasyMap.selectOne(that, userInput); },
            fp.map(({ markerId }) => markerId)(that.markers),
            fp.map(({ markerName }) => markerName)(that.markers).join('\n'),
          );
        }
      });
    }
  },
  [NAVER]: (that, EasyMap) => {
    window.naver.maps.Event.addListener(that.sourceMarker, 'click', function f() {
      that.map.setCenter(that.sourceMarker.position);

      if (that.sourceInfoWindow.getMap()) {
        that.sourceInfoWindow.close();
      } else {
        that.sourceInfoWindow.open(that.map, that.sourceMarker);
      }

      if (that.closeInfoWindowAuto) {
        for (let i = 0, len = that.coordsInfoWindows.length; i < len; i += 1) {
          that.coordsInfoWindows[i].close();
        }
      }
    });

    for (let i = 0, len = that.coords.length; i < len; i += 1) {
      window.naver.maps.Event.addListener(that.coordsMarkers[i], 'click', function f() {
        const tempCoordsArr = [];

        for (let j = 0, len2 = that.coordsMarkers.length; j < len2; j += 1) {
          if (that.coordsMarkers[i].position._lat === that.coordsMarkers[j].position._lat &&
              that.coordsMarkers[i].position._lng === that.coordsMarkers[j].position._lng) {
            tempCoordsArr.push(that.coordsMarkers[j]);
          }
        }

        if (tempCoordsArr.length === 1 || !fp.isFunction(that.clickedNestedMarker)) {
          if (that.closeInfoWindowAuto) {
            that.sourceInfoWindow.close();

            for (let j = 0, len2 = that.coordsInfoWindows.length; j < len2; j += 1) {
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
          that.markers.length = 0;

          for (let j = 0, len2 = tempCoordsArr.length; j < len2; j += 1) {
            that.markers.push({
              markerId: tempCoordsArr[j].__id,
              markerName: `${tempCoordsArr[j].__id}. ${tempCoordsArr[j].__name}`,
            });
          }

          that.clickedNestedMarker(
            (userInput) => { EasyMap.selectOne(that, userInput); },
            fp.map(({ markerId }) => markerId)(that.markers),
            fp.map(({ markerName }) => markerName)(that.markers).join('\n'),
          );
        }
      });
    }
  },
  [DAUM]: (that, EasyMap) => {
    window.daum.maps.event.addListener(that.sourceMarker, 'click', function f() {
      const { lat, lng } = that.source;
      const center = new window.daum.maps.LatLng(lat, lng);

      that.map.setCenter(center);
      that.sourceInfoWindow.open(that.map, this);

      if (that.closeInfoWindowAuto) {
        for (let i = 0, len = that.coordsInfoWindows.length; i < len; i += 1) {
          that.coordsInfoWindows[i].close();
        }
      }
    });

    for (let i = 0, len = that.coords.length; i < len; i += 1) {
      window.daum.maps.event.addListener(that.coordsMarkers[i], 'click', (index =>
        () => {
          const tempCoordsArr = [];

          for (let j = 0, len2 = that.coords.length; j < len2; j += 1) {
            if (that.coords[index].lat === that.coords[j].lat &&
                that.coords[index].lng === that.coords[j].lng) {
              tempCoordsArr.push(that.coordsMarkers[j]);
            }
          }

          if (tempCoordsArr.length === 1 || !fp.isFunction(that.clickedNestedMarker)) {
            if (that.closeInfoWindowAuto) {
              that.sourceInfoWindow.close();

              for (let j = 0, len2 = that.coordsInfoWindows.length; j < len2; j += 1) {
                that.coordsInfoWindows[j].close();
              }
            }

            const { lat, lng } = that.coords[index];
            const center = new window.daum.maps.LatLng(lat, lng);

            that.map.setCenter(center);
            that.coordsInfoWindows[index].open(that.map, that.coordsMarkers[index]);
          } else {
            that.markers.length = 0;

            for (let j = 0, len2 = tempCoordsArr.length; j < len2; j += 1) {
              that.markers.push({
                markerId: tempCoordsArr[j].__id,
                markerName: `${tempCoordsArr[j].__id}. ${tempCoordsArr[j].__name}`,
              });
            }

            that.clickedNestedMarker(
              (userInput) => { EasyMap.selectOne(that, userInput); },
              fp.map(({ markerId }) => markerId)(that.markers),
              fp.map(({ markerName }) => markerName)(that.markers).join('\n'),
            );
          }
        }
      )(i));
    }
  },
};
