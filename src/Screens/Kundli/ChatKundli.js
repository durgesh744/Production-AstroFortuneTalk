import { View, Text } from 'react-native'
import React from 'react'
import { connect } from 'react-redux'

const ChatKundli = ({ navigation }) => {
  return (
    <View>
      <Text>ChatKundli</Text>
    </View>
  )
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(ChatKundli)