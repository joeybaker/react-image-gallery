import React, {Component, PropTypes, cloneElement} from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import autobind from 'autobind-decorator'
import pureRender from 'pure-render-decorator'
import {List} from 'immutable'
import Swipeable from 'react-swipeable'
import SlideButton from './slide-button.js'
import styles from './image-gallery.css'

/* TODO
* [x] immutable props for items
* [x] theme prop including not loading default css if theme provided
* [x] pureRender
* [x] deal with binding props
* [x] ARIA audit
* [x] allow custom image element
* [ ] fix build so that dist has the full thing
*/

const DEFULLT_SLIDE_INTERVAL = 4000
const MAX_POSSIBLE_SLIDING_SLIDES = 3

@pureRender
export default class ImageGallery extends Component {
  static propTypes = {
    items: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
      image: PropTypes.string.isRequired
      , alt: PropTypes.string.isRequired
      , thumbnail: PropTypes.string
      , thumbnailAlt: PropTypes.string
      , imageClass: PropTypes.string
      , thumbnailClass: PropTypes.string
      , description: PropTypes.string
    }))
    , showThumbnails: PropTypes.bool
    , showBullets: PropTypes.bool
    , showNav: PropTypes.bool
    , showIndex: PropTypes.bool
    , indexSeparator: PropTypes.string
    , autoPlay: PropTypes.bool
    , lazyLoad: PropTypes.bool
    , slideInterval: PropTypes.number
    , onSlide: PropTypes.func
    , onClick: PropTypes.func
    , startIndex: PropTypes.number
    , defaultImage: PropTypes.string
    , disableScrolling: PropTypes.bool
    , server: PropTypes.bool
    , theme: PropTypes.shape({
      container: PropTypes.string
    })
    , Img: PropTypes.node
  }

  static defaultProps = {
    lazyLoad: true
    , showThumbnails: true
    , showBullets: false
    , showNav: true
    , showIndex: false
    , indexSeparator: ' / '
    , autoPlay: false
    , slideInterval: DEFULLT_SLIDE_INTERVAL
    , startIndex: 0
    , disableScrolling: false
    , server: false
    , theme: styles
    , items: new List()
  }

  constructor (props) {
    super()
    this.state = {
      currentIndex: props.startIndex
      , thumbnailsTranslateX: 0
      , containerWidth: 0
    }
  }

  componentDidMount () {
    this._handleResize()
    if (this.props.autoPlay) {
      this.play()
    }
    window.addEventListener('resize', this._handleResize)
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.containerWidth !== this.state.containerWidth ||
        prevProps.showThumbnails !== this.props.showThumbnails) {
      // adjust thumbnail container when window width is adjusted
      // when the container resizes, thumbnailsTranslateX
      // should always be negative (moving right),
      // if container fits all thumbnails its set to 0

      this._setThumbnailsTranslateX(
        -this._getScrollX(this.state.currentIndex > 0 ? 1 : 0) *
        this.state.currentIndex)
    }

    if (prevState.currentIndex !== this.state.currentIndex) {
      // call back function if provided
      if (this.props.onSlide) {
        this.props.onSlide(this.state.currentIndex)
      }

      // calculates thumbnail container position
      if (this.state.currentIndex === 0) {
        this._setThumbnailsTranslateX(0)
      }
      else {
        const indexDifference = Math.abs(
          prevState.currentIndex - this.state.currentIndex)
        const scrollX = this._getScrollX(indexDifference)
        if (scrollX > 0) {
          if (prevState.currentIndex < this.state.currentIndex) {
            this._setThumbnailsTranslateX(
              this.state.thumbnailsTranslateX - scrollX)
          }
          else if (prevState.currentIndex > this.state.currentIndex) {
            this._setThumbnailsTranslateX(
              this.state.thumbnailsTranslateX + scrollX)
          }
        }
      }
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this._handleResize)
    if (this._intervalId) {
      window.clearInterval(this._intervalId)
      this._intervalId = null
    }
  }

  @autobind
  slideToIndex (index, event) {
    const slideCount = this.props.items.size - 1

    if (index < 0) {
      this.setState({currentIndex: slideCount})
    }
    else if (index > slideCount) {
      this.setState({currentIndex: 0})
    }
    else {
      this.setState({currentIndex: index})
    }
    if (event) {
      if (this._intervalId) {
        // user event, reset interval
        this.pause()
        this.play()
      }
      event.preventDefault()
    }
  }

  play () {
    if (this._intervalId) {
      return
    }
    this._intervalId = window.setInterval(() => {
      if (!this.state.hovering) {
        this.slideToIndex(this.state.currentIndex + 1)
      }
    }, this.props.slideInterval)
  }

  pause () {
    if (this._intervalId) {
      window.clearInterval(this._intervalId)
      this._intervalId = null
    }
  }

  _setThumbnailsTranslateX (x) {
    this.setState({thumbnailsTranslateX: x})
  }

  @autobind
  _handleResize () {
    this.setState({containerWidth: this.refs.imageGallery.offsetWidth})
  }

  _getScrollX (indexDifference) {
    if (this.props.disableScrolling) {
      return 0
    }
    const {thumbnails} = this.refs
    if (thumbnails) {
      if (thumbnails.scrollWidth <= this.state.containerWidth) {
        return 0
      }

      const totalThumbnails = thumbnails.children.length

      // total scroll-x required to see the last thumbnail
      const totalScrollX = thumbnails.scrollWidth - this.state.containerWidth

      // scroll-x required per index change
      const perIndexScrollX = totalScrollX / (totalThumbnails - 1)

      return indexDifference * perIndexScrollX
    }
  }

  @autobind
  _handleMouseOver () {
    this.setState({hovering: true})
  }

  @autobind
  _handleMouseLeave () {
    this.setState({hovering: false})
  }

  _getAlignmentClassName (index) {
    const {theme} = this.props
    const currentIndex = this.state.currentIndex
    let alignment = ''

    switch (index) {
    case (currentIndex - 1):
      alignment = theme.slideLeft
      break
    case (currentIndex):
      alignment = theme.slideCenter
      break
    case (currentIndex + 1):
      alignment = theme.slideRight
      break
    default:
      alignment = theme.slide
      break
    }

    const {size} = this.props.items

    if (size >= MAX_POSSIBLE_SLIDING_SLIDES) {
      if (index === 0 && currentIndex === size - 1) {
        // set first slide as right slide if were sliding right from last slide
        alignment = theme.slideRight
      }
      else if (index === size - 1 && currentIndex === 0) {
        // set last slide as left slide if were sliding left from first slide
        alignment = theme.slideLeft
      }
    }

    return alignment
  }

  @autobind
  _handleImageLoad (event) {
    const {theme} = this.props
    if (event.target.className.indexOf('loaded') === -1 && theme.imageLoaded) {
      event.target.className += theme.imageLoaded
    }
  }

  @autobind
  _handleImageError (event) {
    if (this.props.defaultImage && event.target.src.indexOf(this.props.defaultImage) === -1) {
      event.target.src = this.props.defaultImage
    }
  }

  render () {
    const {items, theme, Img} = this.props
    const {currentIndex} = this.state
    const thumbnailStyle = {
      MozTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)'
      , WebkitTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)'
      , OTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)'
      , msTransform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)'
      , transform: 'translate3d(' + this.state.thumbnailsTranslateX + 'px, 0, 0)'
    }

    const slides = []
    const thumbnails = []
    const bullets = []

    items.map((item, index) => {
      const alignment = this._getAlignmentClassName(index)

      const imgProps = {
        className: this.props.server ? theme.slideLoaded : ''
        , src: item.get('image')
        , alt: item.get('alt')
        , onLoad: this._handleImageLoad
        , onError: this._handleImageError
      }

      const slide = (
        <div
          key={index}
          className={`${alignment} ${item.get('imageClass') || ''}`}
          onClick={this.props.onClick}
          onTouchStart={this.props.onClick}
        >
          {Img ? cloneElement(Img, imgProps) : <img {...imgProps} />}
          {item.get('description')}
        </div>
      )

      if (this.props.lazyLoad) {
        if (alignment) {
          slides.push(slide)
        }
      }
      else {
        slides.push(slide)
      }

      const isActive = currentIndex === index

      if (this.props.showThumbnails) {
        const thumbnailProps = {
          src: item.get('thumbnail') || item.get('image')
          , alt: item.get('thumbnailAlt') || `${item.get('alt') || ''} thumbnail`
          , className: isActive
            ? theme.thumbnailImageActive
            : theme.thumbnailImage
          , onError: this._handleImageError
        }

        thumbnails.push(
          <SlideButton
            index={index}
            key={index}
            className={`
              ${isActive
                ? theme.thumbnailActive
                : theme.thumbnail} ${item.get('thumbnailClass') || ''}`}
            onClick={this.slideToIndex}
            label={`move to ${item.get('alt')}`}
          >
            {Img
              ? cloneElement(Img, thumbnailProps)
              : <img {...thumbnailProps} />
            }
          </SlideButton>
        )
      }

      if (this.props.showBullets) {
        bullets.push(
          <SlideButton
            key={index}
            index={index}
            className={isActive ? theme.bulletActive : theme.bullet}
            onClick={this.slideToIndex}
            label={`move to ${item.get('alt')}`}
          />
        )
      }
    })

    const swipePrev = this.slideToIndex.bind(this, currentIndex - 1)
    const swipeNext = this.slideToIndex.bind(this, currentIndex + 1)
    const itemsTotal = this.props.items.size

    return (
      <div ref="imageGallery" className={theme.container}>
        <div
          onMouseOver={this._handleMouseOver}
          onMouseLeave={this._handleMouseLeave}
          className={theme.content}
        >
          {
            itemsTotal >= 2
              ? [
                this.props.showNav &&
                  [
                    <button
                      key="leftNav"
                      className={theme.leftNav}
                      onTouchStart={swipePrev}
                      onClick={swipePrev}
                      aria-label="Previous"
                    />
                    , <button
                        key="rightNav"
                        className={theme.rightNav}
                        onTouchStart={swipeNext}
                        onClick={swipeNext}
                        aria-label="Next"
                      />
                  ]
                , <Swipeable
                    key="swipeable"
                    onSwipedLeft={swipeNext}
                    onSwipedRight={swipePrev}
                  >
                  <div className={theme.slides}>
                    {slides}
                  </div>
                </Swipeable>
              ]
            : <div className={theme.slides}>
                {slides}
              </div>
          }
          {
            this.props.showBullets &&
              <div className={theme.bullets}>
                <ul className={theme.bulletsContainer}>
                  {bullets}
                </ul>
              </div>
          }
          {
            this.props.showIndex &&
              <div className={theme.index}>
                <span className={theme.indexCurrent}>
                  {this.state.currentIndex + 1}
                </span>
                <span className={theme.indexSeparator}>
                  {this.props.indexSeparator}
                </span>
                <span className={theme.indexTotal}>
                  {itemsTotal}
                </span>
              </div>
          }
        </div>

        {
          this.props.showThumbnails &&
            <div className={theme.thumbnails}>
              <ul
                ref="thumbnails"
                className={theme.thumbnailsContainer}
                style={thumbnailStyle}
              >
                {thumbnails}
              </ul>
            </div>
        }
      </div>
    )
  }
}
