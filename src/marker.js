import fp from 'lodash/fp';
import { GOOGLE, NAVER } from './constants';

export const createMarkersWithIcon = {
  [GOOGLE]: (that, coord, markerPosition, width, height) => {
    if (fp.isEmpty(markerPosition)) {
      return new window.google.maps.Marker({
        position: coord,
        map: that.map,
        icon: new window.google.maps.MarkerImage(coord.marker.icon),
      });
    }

    return new window.google.maps.Marker({
      position: coord,
      map: that.map,
      icon: new window.google.maps.MarkerImage(
        coord.marker.icon,
        new window.google.maps.Size(width, height),
        new window.google.maps.Point(0, 0),
        new window.google.maps.Point(markerPosition.x, markerPosition.y),
        new window.google.maps.Size(width, height),
      ),
    });
  },
  [NAVER]: (that, coord, markerPosition, width, height) => {
    if (fp.isEmpty(markerPosition)) {
      return new window.naver.maps.Marker({
        position: coord,
        map: that.map,
        icon: { url: coord.marker.icon },
      });
    }

    return new window.naver.maps.Marker({
      position: coord,
      map: that.map,
      icon: {
        url: coord.marker.icon,
        size: new window.naver.maps.Size(width, height),
        scaledSize: new window.naver.maps.Size(width, height),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(markerPosition.x, markerPosition.y),
      },
    });
  },
};

export const createMarkersWithoutIcon = {
  [GOOGLE]: (that, coord) => (
    new window.google.maps.Marker({
      position: coord,
      map: that.map,
    })),
  [NAVER]: (that, coord) => (
    new window.naver.maps.Marker({
      position: coord,
      map: that.map,
    })),
};

export const markCurrentPositionWithIcon = {
  [GOOGLE]: (that, markerPosition, width, height) => {
    if (fp.isEmpty(markerPosition)) {
      return new window.google.maps.Marker({
        position: that.source,
        map: that.map,
        icon: new window.google.maps.MarkerImage(that.source.marker.icon),
      });
    }

    return new window.google.maps.Marker({
      position: that.source,
      map: that.map,
      icon: new window.google.maps.MarkerImage(
        that.source.marker.icon,
        new window.google.maps.Size(width, height),
        new window.google.maps.Point(0, 0),
        new window.google.maps.Point(markerPosition.x, markerPosition.y),
        new window.google.maps.Size(width, height)
      ),
    });
  },
  [NAVER]: (that, markerPosition, width, height) => {
    if (fp.isEmpty(markerPosition)) {
      return new window.naver.maps.Marker({
        position: that.source,
        map: that.map,
        icon: { url: that.source.marker.icon },
      });
    }

    return new window.naver.maps.Marker({
      position: that.source,
      map: that.map,
      icon: {
        url: that.source.marker.icon,
        size: new window.naver.maps.Size(width, height),
        scaledSize: new window.naver.maps.Size(width, height),
        origin: new window.naver.maps.Point(0, 0),
        anchor: new window.naver.maps.Point(markerPosition.x, markerPosition.y),
      },
    });
  },
};

export const markCurrentPositionWithoutIcon = {
  [GOOGLE]: that => (
    new window.google.maps.Marker({
      position: that.source,
      map: that.map,
    })
  ),
  [NAVER]: that => (
    new window.naver.maps.Marker({
      position: that.source,
      map: that.map,
    })
  ),
};
