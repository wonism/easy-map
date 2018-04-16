import fp from 'lodash/fp';
import { GOOGLE, NAVER, DAUM } from './constants';

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
  [DAUM]: (that, coord, markerPosition, width, height) => {
    if (fp.isEmpty(markerPosition)) {
      const marker = new window.daum.maps.Marker({
        position: new window.daum.maps.LatLng(coord.lat, coord.lng),
        image: new window.daum.maps.MarkerImage(
          coord.marker.icon,
          new window.daum.maps.Size(width, height)
        ),
      });

      marker.setMap(that.map);

      return marker;
    }

    const marker = new window.daum.maps.Marker({
      position: new window.daum.maps.LatLng(coord.lat, coord.lng),
      image: new window.daum.maps.MarkerImage(
        coord.marker.icon,
        new window.daum.maps.Size(width, height),
        { offset: new window.daum.maps.Point(markerPosition.x, markerPosition.y) }
      ),
    });

    marker.setMap(that.map);

    return marker;
  },
};

export const createMarkersWithoutIcon = {
  [GOOGLE]: (that, coord) =>
    new window.google.maps.Marker({
      position: coord,
      map: that.map,
    }),
  [NAVER]: (that, coord) =>
    new window.naver.maps.Marker({
      position: coord,
      map: that.map,
    }),
  [DAUM]: (that, coord) => {
    const marker = new window.daum.maps.Marker({
      position: new window.daum.maps.LatLng(coord.lat, coord.lng),
    });

    marker.setMap(that.map);

    return marker;
  },
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
  [DAUM]: (that, markerPosition, width, height) => {
    if (fp.isEmpty(markerPosition)) {
      const marker = new window.daum.maps.Marker({
        position: new window.daum.maps.LatLng(that.source.lat, that.source.lng),
        image: new window.daum.maps.MarkerImage(
          that.source.marker.icon,
          new window.daum.maps.Size(width, height)
        ),
      });

      marker.setMap(that.map);

      return marker;
    }

    const marker = new window.daum.maps.Marker({
      position: new window.daum.maps.LatLng(that.source.lat, that.source.lng),
      image: new window.daum.maps.MarkerImage(
        that.source.marker.icon,
        new window.daum.maps.Size(width, height),
        { offset: new window.daum.maps.Point(markerPosition.x, markerPosition.y) }
      ),
    });

    marker.setMap(that.map);

    return marker;
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
  [DAUM]: (that) => {
    const marker = new window.daum.maps.Marker({
      position: new window.daum.maps.LatLng(that.source.lat, that.source.lng),
    });

    marker.setMap(that.map);

    return marker;
  },
};
