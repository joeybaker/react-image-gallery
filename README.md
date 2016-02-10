<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [@joeybaker/react-image-gallery](#@joeybakerreact-image-gallery)
  - [Install](#install)
  - [Demo & Examples](#demo-&-examples)
  - [Use](#use)
    - [CSS Modules](#css-modules)
    - [JS](#js)
- [Props](#props)
- [functions](#functions)
- [Notes](#notes)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# @joeybaker/react-image-gallery

Responsive image gallery, slideshow, carousel

**THIS IS A FORK**
It adds:

* immutable props for `items` so that we can pure render
* a `theme` prop which allows you to add your own CSS if you don't like the defaults
* [css-modules](https://github.com/css-modules/) compatible CSS
* pureRender all the way down, for performance
* fully ARIA compliant
* allows a custom image element, so you can provide `srcSet` or use `<picture>` or whatever you'd like. Responsive images for the win!

## Install

```sh
npm install @joeybaker/react-image-gallery
```

## Demo & Examples

**NOTE**: this is the original demo, it shows all the user-facing functionality this fork.

Live demo: [`linxtion.com/demo/react-image-gallery`](http://linxtion.com/demo/react-image-gallery)

To build the example locally, run:

```
npm install
```
```
npm start
```

Then open [`localhost:9966`](http://localhost:9966) in a browser.


## Use

### CSS Modules
Use [CSS Modules](https://github.com/css-modules/) to build.

### JS

```js
var ImageGallery = require('react-image-gallery')

var images = [
  {
    image: PropTypes.string.isRequired
    , alt: PropTypes.string.isRequired
    , thumbnail: PropTypes.string
    , thumbnailAlt: PropTypes.string
    , imageClass: PropTypes.string
    , thumbnailClass: PropTypes.string
    , description: PropTypes.string
  }
]

handleSlide: function(index) {
  console.log('Slid to ' + index);
}

render: function() {
  return (
    <ImageGallery
      items={images}
      autoPlay={true}
      slideInterval={4000}
      onSlide={this.handleSlide}
    />
  )
}

```

# Props

* `items`: (required) Immutable list of images,
* `lazyLoad`: Boolean, default `true`
* `showThumbnails`: Boolean, default `true`
* `showNav`: Boolean, default `true`
* `showBullets`: Boolean, default `false`
* `showIndex`: Boolean, default `false`
* `server`: Boolean, default `false`
* `indexSeparator`: String, default `' / '`, ignored if `showIndex` is false
* `autoPlay`: Boolean, default `false`
* `slideInterval`: Integer, default `4000`
* `startIndex`: Integer, default `0`
* `defaultImage`: String, default `undefined`
* `disableScrolling`: Boolean, default `false`
* `onSlide`: Function, `callback(index)`
* `onClick`: Function, `callback(event)`
* `Img`: React Element


# functions

* `play()`: continuous plays if image is not hovered.
* `pause()`: pauses the slides.
* `slideToIndex(index)`: slide to a specific index.

# Notes

* Feel free to contribute and or provide feedback!

# License

MIT
