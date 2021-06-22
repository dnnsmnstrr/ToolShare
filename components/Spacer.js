import React from 'react'
import {View} from 'react-native'

const DEFAULT_HEIGHT = 20
const Spacer = ({width = 0, height = 0, flex}) => {
  if (!width && !height) {
    height = DEFAULT_HEIGHT
  }
  return <View style={{ width, height, flex: flex ? Number(flex) : null}} />
}

const EvenlySpace = ({ children, ...spacerProps }) => {
  return children.map((child, index) => (
    <React.Fragment key={index}>
      {child}
      {child && <Spacer {...spacerProps} />}
    </React.Fragment>
  ))
}
export { EvenlySpace }
export default Spacer
