// @flow

import React, {Component} from 'react'
import Helmet from 'react-helmet'
import {
  StyleSheet,
  Text,
  View
} from '../lib/react-native-web'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

export default class MainComponent extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Helmet
          title='My Title'
          meta={[
            {name: 'description', content: 'Helmet application'}
          ]}
        />
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    )
  }
}
