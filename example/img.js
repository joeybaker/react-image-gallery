import React, {Component} from 'react'
import pureRender from 'pure-render-decorator'

@pureRender
export default class Img extends Component {
  render () {
    return <img {...this.props} />
  }
}
