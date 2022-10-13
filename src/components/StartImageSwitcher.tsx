import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, View, Animated,
} from 'react-native';
import VisionTests from '../config/vision_tests';

const images = Object.values(VisionTests)
  .filter((visionTest) => !visionTest.hidden && !visionTest.disabled)
  .map((visionTest) => visionTest.imageNoShadow);

const getNextImage = (currentImage: number) => {
  let nextImage = currentImage + 1;
  if (nextImage >= images.length) nextImage = 0;
  return nextImage;
};

export default function StartImageSwitcher() {
  const [currentImage, setCurrentImage] = useState(0);
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        currentOpacity,
        {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        nextOpacity,
        {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        },
      ),
    ]).start(() => {
      setCurrentImage(getNextImage(currentImage));
      currentOpacity.setValue(1);
      nextOpacity.setValue(0);
    });
  }, [currentImage]);

  return (
    <View style={styles.imageWrapper}>
      {
      images.map((image, index) => {
        let opacity: number | Animated.Value = 0;
        if (index === currentImage) opacity = currentOpacity;
        else if (index === getNextImage(currentImage)) opacity = nextOpacity;
        return (
          <Animated.Image style={{ ...styles.image, opacity }} source={image} key={index} />
        );
      })
    }
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: '40%',
    height: undefined,
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    position: 'absolute',
  },
});
