import React from 'react';
import {
  Dimensions, Image, ImageSourcePropType, StyleSheet, View,
} from 'react-native';
import RadialGradient from 'react-native-radial-gradient';
import { Shadow } from 'react-native-shadow-2';
import Text from './Text';
import { Colors, Spacing } from '../styles';
import useStore from '../hooks/useStore';
import Avatars from '../config/avatars';

const cardWidth = Dimensions.get('window').width - (Spacing.m * 2);
const cardHeight = Dimensions.get('window').height > 667 ? cardWidth / 1.69 : cardWidth / 2;
const imageWidth = Dimensions.get('window').height > 667 ? cardWidth * 0.6 : cardWidth * 0.5;

interface BigCardProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
}
export default function BigCard(props: BigCardProps) {
  const { image, title, description } = props;
  const avatar = useStore((state) => state.avatar);
  let avatarImage: ImageSourcePropType | null = null;
  if (avatar && Avatars[avatar] && Avatars[avatar].headImage) {
    avatarImage = Avatars[avatar].headImage!;
  }

  return (
    <View style={styles.outerWrapper}>
      { (avatar && avatarImage) && (
        <View style={styles.avatarWrapper}>
          <Image source={avatarImage} style={styles.avatar} />
        </View>
      )}
      <View
        style={styles.wrapper}
      >
        <Shadow
          distance={Colors.shadows.blue.distance}
          startColor={Colors.shadows.blue.startColor}
          offset={[0, 10]}
          size={[cardWidth, cardHeight]}
          radius={styles.innerWrapper.borderRadius}
        >
          <View style={styles.innerWrapper}>
            <RadialGradient
              colors={[Colors.lightPurple, Colors.purple]}
              stops={[0, 1]}
              radius={cardHeight}
              center={[cardWidth / 2, cardHeight]}
              style={styles.card}
            />
          </View>
        </Shadow>
        <Image
          source={image}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    display: 'flex',
    width: cardWidth,
  },
  wrapper: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 10,
  },
  innerWrapper: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
  },
  card: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: imageWidth,
    height: undefined,
    aspectRatio: 1,
    position: 'absolute',
    top: -(Spacing.l),
    left: (cardWidth / 2) - ((imageWidth) / 2),
    zIndex: 100,
  },
  title: {
    fontSize: Dimensions.get('window').height > 667 ? 32 : 24,
    fontWeight: 'bold',
    color: Colors.purple,
    marginTop: Spacing.xl,
    textAlign: 'left',
    width: '100%',
  },
  description: {
    color: Colors.lightPurple,
    fontSize: Dimensions.get('window').height > 667 ? 16 : 14,
    width: '100%',
    marginTop: Spacing.s,
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderColor: Colors.green,
    borderWidth: 2,
    borderRadius: 48,
    position: 'absolute',
    right: -14,
    top: -14,
    zIndex: 10,
    backgroundColor: Colors.white,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});
