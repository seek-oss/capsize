import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createTextStyle } from '@capsizecss/react-native';

const { fontFamily, fontMetrics } =
  Platform.OS === 'ios'
    ? ({
        fontFamily: 'System',
        fontMetrics: {
          capHeight: 1443,
          ascent: 1950,
          descent: -494,
          lineGap: 0,
          unitsPerEm: 2048,
        },
      } as const)
    : ({
        fontFamily: 'Roboto',
        fontMetrics: {
          capHeight: 1456,
          ascent: 1900,
          descent: -500,
          lineGap: 0,
          unitsPerEm: 2048,
        },
      } as const);

const styles = StyleSheet.create({
  titleText: {
    fontFamily,
    fontWeight: 'bold',
    ...createTextStyle({
      fontMetrics,
      fontSize: 24,
      leading: 30,
    }),
  },
  bodyText: {
    fontFamily,
    ...createTextStyle({
      fontMetrics,
      fontSize: 17,
      leading: 24,
    }),
  },
  container: {
    padding: 16,
  },
  guide: {
    height: 24,
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
});

const App = () => (
  <SafeAreaView>
    <StatusBar />
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <View style={styles.guide} />

        <Text style={styles.titleText}>Hello world!</Text>

        <View style={styles.guide} />

        <Text style={styles.bodyText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>

        <View style={styles.guide} />
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default App;
