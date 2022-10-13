import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import * as WebBrowser from 'expo-web-browser';
import Container from '../components/Container';
import { RootStackParamList } from '../types/global';
import { Colors, Spacing, Typography } from '../styles';
import Footer from '../components/Footer';
import Text from '../components/Text';
import VisionTests from '../config/vision_tests';
import useStore from '../hooks/useStore';

export default function ResultDetailsScreen(props: NativeStackScreenProps<RootStackParamList, 'ResultDetails'>) {
  const { route } = props;
  const { details } = route.params;
  const visionTest = useStore((state) => state.visionTest);

  return (
    <Container style={styles.container} paddedFooter>
      <StatusBar style="auto" />
      <ScrollView>
        <Text style={styles.title}>Ergebnisse im Detail</Text>
        { details.map((category) => (
          <View style={styles.category} key={category.title}>
            { category.title && (
            <Text style={styles.categoryTitle}>{category.title}</Text>
            )}
            { category.results.map((categoryResult) => (
              <View style={styles.result} key={categoryResult.description}>
                <Text
                  style={[
                    styles.resultDescription,
                    categoryResult.descriptionColor ? { color: categoryResult.descriptionColor } : undefined,
                  ]}
                >
                  {categoryResult.description}
                </Text>
                <View style={styles.resultRightWrapper}>
                  {categoryResult.leftColumn && (
                  <Text style={[
                    styles.resultLeftColumn,
                    categoryResult.leftColumnColor ? { color: categoryResult.leftColumnColor } : {},
                  ]}
                  >
                    {categoryResult.leftColumn}
                  </Text>
                  )}
                  <Text style={[
                    styles.resultRightColumn,
                    categoryResult.rightColumnColor ? { color: categoryResult.rightColumnColor } : {},
                  ]}
                  >
                    {categoryResult.rightColumn}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.titleBottom}>Was bedeutet das Ergebnis?</Text>
        <Text style={styles.explainerText}>
          {`${VisionTests[visionTest!].detailsHelperText}\n` || ''}
          {'In diesem Fall empfehlen wir den Besuch bei einem Augenarzt oder '}
          <Text style={styles.textLink} onPress={() => WebBrowser.openBrowserAsync('https://www.sehen.de/service/augenoptiker-suche/')}>Augenoptiker</Text>
          {` vor Ort, um die Sehstärke professionell testen zu lassen.\n
Dieser Sehtest tut nicht weh, ist schnell durchgeführt und ist meist kostenlos und unverbindlich.`}
        </Text>
      </ScrollView>
      <Footer hideCoins />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.m,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: Typography.sizes.l,
    fontWeight: 'bold',
    color: Colors.purple,
  },
  titleBottom: {
    fontSize: Typography.sizes.l,
    fontWeight: 'bold',
    color: Colors.purple,
    marginTop: Spacing.l,
  },
  category: {},
  categoryTitle: {
    fontSize: Typography.sizes.m,
    fontWeight: 'bold',
    color: Colors.purple,
    marginBottom: Spacing.xxs,
    marginTop: Spacing.m,
  },
  result: {
    borderBottomColor: Colors.coolGray,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xxs,
    paddingVertical: Spacing.xxs,
    width: Dimensions.get('window').width - Spacing.m * 2,
  },
  resultDescription: {
    color: Colors.purple,
    fontSize: Typography.sizes.m,
    flex: 2,
  },
  resultRightWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flex: 5,
    justifyContent: 'flex-end',
  },
  resultLeftColumn: {
    fontSize: Typography.sizes.m,
    color: Colors.dark,
    textAlign: 'right',
    paddingRight: Spacing.m,
  },
  resultRightColumn: {
    fontSize: Typography.sizes.m,
    color: Colors.dark,
    textAlign: 'right',
  },
  explainerText: {
    color: Colors.purple,
    marginTop: Spacing.xxs,
  },
  textLink: {
    textDecorationLine: 'underline',
  },
});
