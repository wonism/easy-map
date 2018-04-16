import fp from 'lodash/fp';
import { GOOGLE, NAVER, DAUM } from './constants';

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
  [DAUM]: (t) => {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${t.key}&autoload=false`;
    script.onload = () => {
      window.daum.maps.load(function loadCallback() {
        const option = t.option || {
          center: t.source,
        };

        const { center } = option;
        const { lat, lng } = center;
        const centerCoord = new window.daum.maps.LatLng(lat, lng);
        const newOption = fp.set('center', centerCoord)(option);

        const that = fp.set('map', t.initDaumOption(newOption))(t);

        that.renderMap();
      });
    };

    document.body.appendChild(script);
  },
};
