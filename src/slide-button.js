import React, {Component, PropTypes} from 'react'
import pureRender from 'pure-render-decorator'
import autobind from 'autobind-decorator'

const KEY_CODE_ENTER = 13
const KEY_CODE_SPACE = 32

@pureRender
export default class SlideButton extends Component {
  static propTypes = {
    children: PropTypes.node
    , index: PropTypes.number.isRequired
    , className: PropTypes.string
    , label: PropTypes.string.isRequired
    , onClick: PropTypes.func.isRequired
  }

  @autobind
  onClick (e) {
    const {onClick, index} = this.props
    if (onClick) {
      onClick(index, e)
    }
  }

  @autobind
  onKeyDown (e) {
    const {onClick, index} = this.props
    const {keyCode} = e
    if ((keyCode === KEY_CODE_ENTER || keyCode === KEY_CODE_SPACE) && onClick) {
      onClick(index, e)
    }
  }

  render () {
    const {children, className, label} = this.props

    return (
      <li
        role="button"
        tabIndex="0"
        className={className}
        onTouchStart={this.onClick}
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}
        aria-label={label}
      >
        {children}
      </li>
    )
  }
}
