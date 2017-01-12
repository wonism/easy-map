# easy-map
> 🌏 Render a map on browser easily.

## installation
Just download the `js` and include it in your `HTML`.
```html
<!-- add easy.map in your html -->
<script type="text/javascript" src="PATH/TO/easy-map.min.js"></script>

<!-- if you use AMD or CommonJS -->
<script>
  require(["PATH/TO/easy-map"], function (EasyMap) {
    // Do something..
  });

  /* or */

  var EasyMap = require("easy-map");
</script>
```

### NPM
```sh
$ yarn add easy-map
# or
$ npm i easy-map
```

## Demo
```sh
$ npm run demo
# then access http://localhost:8888
```

## How to use
### Prerequisite
- You need a `Map Key` to use `map API`.
  - You can get the key on [Google maps API page](https://developers.google.com/maps/web)

### Parameters
| Parameter                         | Type     | Remarks |
|:----------------------------------|:---------|:--------|
| mapType                           | string   | Required (It must be included in `['google']`) |
| element                           | DOM Node | Required |
| key                               | string   | Required |
| source                            | object   | Specific location's information |
| source.lat                        | number   | Specific location's latitude |
| source.lng                        | number   | Specific location's longitude |
| source.marker                     | object   | Marker on Specific location |
| source.marker.icon                | string   | Write icon image's path |
| source.marker.width               | number   | Marker's width (px) |
| source.marker.height              | number   | Marker's height (px) |
| source.marker.verticalAlign       | string   | `top, bottom, middle` |
| source.marker.horizontalAlign     | string   | `right, left, center` |
| source.infoWindow                 | object   | Marker's infoWindow |
| source.infoWindow.content         | string   | infoWindow's content |
| source.infoWindow.maxWidth        | number   | infoWindow's max width (px) |
| source.infoWindow.backgroundColor | string   | infoWindow's background color (`hex code` or `color name`)<br />*ONLY FOR NAVER* |
| source.infoWindow.borderColor     | string   | infoWindow's border color (`hex code` or `color name`)<br />*ONLY FOR NAVER* |
| source.infoWindow.borderWidth     | number   | infoWindow's border width (px)<br />*ONLY FOR NAVER* |
| source.infoWindow.anchorSize      | object   | infoWindow's anchor width<br />`new naver.maps.Size(30, 30)`<br />*ONLY FOR NAVER* |
| source.infoWindow.anchorSkew      | boolean  | infoWindow's anchor shape<br />*ONLY FOR NAVER* |
| source.infoWindow.pixelOffset     | object   | infoWindow's offset<br />`new naver.maps.Point(20, -20)`<br />*ONLY FOR NAVER* |
| coords                            | array    | Set of coordinates |
| coords[n]                         | object   | Same as source |
| closeInfoWindowAuto               | boolean  | Close automately when click a marker |
| clickedNestedMarker               | function | Callback function when click nested markers |
| ===                               | ===      | === |
| coords[n].infoWindow.content      | string   | If you write {{distance m}}, you can get the distance between coores[n] and source<br />Available unites : [`m`, `km`, `ft`, `yd`] |

### Basic Usage
__Google Map__
```js
const easyMap = new EasyMap({
  mapType: 'google',
  key: 'AIzaSyBL4Ugej1KvkfIrU2qOhoAkE85rKEcTApo',
  element: document.getElementById('map'),
  source: {
    lat: 37.5666103,
    lng: 126.9783882,
    marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 48, height: 48, verticalAlign: 'top' },
    infoWindow: { content: '<div class="info-window">Source Marker</div>', maxWidth: 50 }
  },
  coords: [
    {
      lat: 37.5658528,
      lng: 126.9779845,
      name: 'Marker 1',
      marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 36, height: 36, verticalAlign: 'middle' },
      infoWindow: { content: '<div class="info-window">Marker 1<br>distance is {{distance m}}</div>', maxWidth: 50 }
    },
    {
      lat: 37.5658528,
      lng: 126.9779845,
      name: 'Marker 2',
      marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 36, height: 36, verticalAlign: 'middle' },
      infoWindow: { content: '<div class="info-window">Marker 2<br>distance is {{distance km}}</div>', maxWidth: 50 }
    },
  ],
  closeInfoWindowAuto: true,
  clickedNestedMarker: function (cb, ids, strs) {
    let userInput = prompt(`You clicked nested markers! Select on.\n${ strs }`, '');

    cb(+userInput);
  },
});

easyMap.start();
```

__Naver Map__
```js
const easyMap = new EasyMap({
  mapType: 'naver',
  key: 'ZINRRHtKwGpXNxXjcqwv',
  element: document.getElementById('map'),
  source: {
    lat: 37.5666103,
    lng: 126.9783882,
    marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 48, height: 48, verticalAlign: 'top' },
    infoWindow: { content: '<div class="info-window">Source Marker</div>', maxWidth: 50 }
  },
  coords: [
    {
      lat: 37.5658528,
      lng: 126.9779845,
      name: 'Marker 1',
      marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 36, height: 36, verticalAlign: 'middle' },
      infoWindow: { content: '<div class="info-window">Marker 1<br>distance is {{distance m}}</div>', maxWidth: 50 }
    },
    {
      lat: 37.5658528,
      lng: 126.9779845,
      name: 'Marker 2',
      marker: { icon: '//assets-cdn.github.com/images/modules/contact/heartocat.png', width: 36, height: 36, verticalAlign: 'middle' },
      infoWindow: { content: '<div class="info-window">Marker 2<br>distance is {{distance km}}</div>', maxWidth: 50 }
    },
  ],
  closeInfoWindowAuto: true,
  clickedNestedMarker: function (cb, ids, strs) {
    let userInput = prompt(`You clicked nested markers! Select on.\n${ strs }`, '');

    cb(+userInput);
  },
});

easyMap.start();
```

## Browsers support
__Google Maps__
- [Link](https://developers.google.com/maps/documentation/javascript/browsersupport?hl=en)

__Naver Maps__
- [Link](https://navermaps.github.io/maps.js/)

## Change log
__1.0.0__
- Initial release

__1.0.2__
- Add naver map
- Bug fix

__1.0.3__
- Bug fix
- Change coding styles in `switch-case` (Use braces in switch-case).

## Licence
Copyright (c) 2017 wonism

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

