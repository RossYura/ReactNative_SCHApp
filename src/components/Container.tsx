import React from 'react';
import {
  ScrollView,
  ScrollViewProps, StyleSheet, View, ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles';
import Helpers from '../utils/helpers';

interface FixedContainerProps extends ViewProps {
  scrollable?: false;
  paddedFooter?: boolean;
  contentContainerStyle?: undefined;
}
interface ScrollableContainerProps extends ScrollViewProps {
  scrollable: true;
  paddedFooter?: undefined;
}
const Container: React.FC<FixedContainerProps | ScrollableContainerProps> = (props) => {
  const {
    children, style, scrollable, paddedFooter, contentContainerStyle,
  } = props;
  const ContainerElement = scrollable ? ScrollView : View;
  const headerHeight = Helpers.getHeaderHeight(useSafeAreaInsets());

  return (
    <ContainerElement
      style={[
        scrollable ? styles.scrollViewContainer : styles.fixedContainer,
        style,
        paddedFooter ? { paddingBottom: headerHeight } : undefined,
      ]}
      contentContainerStyle={scrollable ? [styles.scrollViewContentContainer, contentContainerStyle] : undefined}
    >
      {children}
    </ContainerElement>
  );
};

export default Container;

const styles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: Colors.white,
  },
  scrollViewContentContainer: {
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  fixedContainer: {
    flex: 1,
    display: 'flex',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
