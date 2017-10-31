import fp from 'lodash/fp';
import { GOOGLE, NAVER } from './constants';

export default {
  [GOOGLE]: (t) => {
    const timestamp = Date.now();
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = `//maps.googleapis.com/maps/api/js?key=${t.key}&callback=easyMap${timestamp}&libraries=geometry`;

    window[`easyMap${timestamp}`] = () => {
      const that = fp.set('map', t.initGoogleOption(t.option || {
        center: t.source,
        zoom: 14,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: true,
        scaleControl: true,
      }))(t);

      that.renderMap();
    };

    document.body.appendChild(script);
  },
  [NAVER]: (t) => {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = `//openapi.map.naver.com/openapi/v3/maps.js?clientId=${t.key}`;
    script.onload = () => {
      const that = fp.set('map', t.initNaverOption(t.option || {
        center: t.source,
        zoom: 10,
      }))(t);

      that.renderMap();
    };

    document.body.appendChild(script);
  },
};
