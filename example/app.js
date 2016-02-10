import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import autobind from 'autobind-decorator'
import {fromJS} from 'immutable'
import Perf from 'react-addons-perf'
import a11y from 'react-a11y'
a11y(React)

import ImageGallery from '../src/image-gallery.js'
import Img from './img.js'

Perf.start()
const images = fromJS([
  {
    image: 'http://lorempixel.com/1000/600/nature/1/'
    , alt: 'nature'
    , thumbnail: 'http://lorempixel.com/250/150/nature/1/'
    , imageClass: 'featured-slide'
    , thumbnailClass: 'featured-thumb'
    , description: 'Custom class for slides & thumbnails'
  }
  , {
    image: 'http://lorempixel.com/1000/600/nature/2/'
    , alt: 'nature again'
    , thumbnail: 'http://lorempixel.com/250/150/nature/2/'
    , description: 'Lorem ipsum dolor sit amet, consectetur adipiscing...'
  }
  , {
    image: 'http://lorempixel.com/1000/600/nature/3/'
    , alt: 'nature again 3'
    , thumbnail: 'http://lorempixel.com/250/150/nature/3/'
  }
  , {
    image: 'http://lorempixel.com/1000/600/nature/4/'
    , alt: 'nature again 4'
    , thumbnail: 'http://lorempixel.com/250/150/nature/4/'
  }
  , {
    image: 'http://lorempixel.com/1000/600/nature/5/'
    , alt: 'nature again 5'
    , thumbnail: 'http://lorempixel.com/250/150/nature/5/'
  }
  , {
    image: 'http://lorempixel.com/1000/600/nature/6/'
    , alt: 'nature again 6'
    , thumbnail: 'http://lorempixel.com/250/150/nature/6/'
  }
  , {
    image: 'http://lorempixel.com/1000/600/nature/7/'
    , alt: 'nature again 7'
    , thumbnail: 'http://lorempixel.com/250/150/nature/7/'
  }
])

const DEFAULT_SLIDE_INTERVAL = 4000

class App extends Component {

  state = {
    isPlaying: false
    , slideInterval: DEFAULT_SLIDE_INTERVAL
    , showThumbnails: true
    , showIndex: false
    , showNav: true
    , showBullets: true
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.slideInterval !== prevState.slideInterval) {
      // refresh setInterval
      this._pauseSlider()
      this._playSlider()
    }
  }

  @autobind
  _pauseSlider () {
    if (this.refs.imageGallery) {
      this.refs.imageGallery.pause()
      this.setState({isPlaying: false})
    }
  }

  @autobind
  _playSlider () {
    if (this.refs.imageGallery) {
      this.refs.imageGallery.play()
      this.setState({isPlaying: true})
    }
  }

  @autobind
  onChangeSlideInterval ({target: {value}}) {
    this.setState({slideInterval: value})
  }

  @autobind
  onChangeShowBullets ({target: {checked}}) {
    this.setState({showBullets: checked})
  }

  @autobind
  onChangeShowThumbnails ({target: {checked}}) {
    this.setState({showThumbnails: checked})
  }

  @autobind
  onChangeShowNav ({target: {checked}}) {
    this.setState({showNav: checked})
  }

  @autobind
  onChangeShowIndex ({target: {checked}}) {
    this.setState({showIndex: checked})
  }

  render () {
    return (
      <div className="app">
        <ImageGallery
          ref="imageGallery"
          items={images}
          lazyLoad={false}
          showBullets={this.state.showBullets}
          showThumbnails={this.state.showThumbnails}
          showIndex={this.state.showIndex}
          showNav={this.state.showNav}
          slideInterval={parseInt(this.state.slideInterval, 10)}
          autoPlay={this.state.isPlaying}
          Img={<Img />}
        />

        <div className="app-sandbox">

          <h2> Playground </h2>

          <ul>
            <li>
              <button
                className={'app-button ' + (this.state.isPlaying ? 'active' : '')}
                onClick={this._playSlider}
                aria-label="play"
              >
                Play
              </button>
            </li>
            <li>
              <button
                className={'app-button ' + (!this.state.isPlaying ? 'active' : '')}
                onClick={this._pauseSlider}
                aria-label="pause"
              >
                Pause
              </button>
            </li>
            <li>
              <label>
                <div>Slide interval</div>
                <input
                  type="text"
                  placeholder="SlideInterval"
                  value={this.state.slideInterval}
                  onChange={this.onChangeSlideInterval}
                />
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={this.state.showBullets}
                  onChange={this.onChangeShowBullets}
                />
                  show bullets?
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={this.state.showThumbnails}
                  onChange={this.onChangeShowThumbnails}
                />
                  show Thumbnails?
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={this.state.showNav}
                  onChange={this.onChangeShowNav}
                />
                  show Navigation?
              </label>
            </li>
            <li>
              <label>
                <input
                  type="checkbox"
                  checked={this.state.showIndex}
                  onChange={this.onChangeShowIndex}
                />
                  show Index?
              </label>
            </li>
          </ul>

        </div>
      </div>
    )
  }
}


(function renderApp () {
  ReactDOM.render(<App/>, document.getElementById('app'), () => {
    Perf.stop()
    console.info('Wasted')
    Perf.printWasted()
    // console.info('DOM')
    // Perf.printDOM()
  })
}())
