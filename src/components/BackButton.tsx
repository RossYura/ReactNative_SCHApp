import React from 'react';
import useAudio from '../hooks/useAudio';
import SquareButton from './SquareButton';

const BackButton: React.FC<{ navigation: any, onClick?: () => void }> = (props) => {
  const { navigation, onClick } = props;
  const audio = useAudio();

  const onClickButton = () => {
    audio.playSoundEffect('buttonPress');
    navigation.goBack();
    if (onClick) onClick();
  };

  return (
    <SquareButton
      onPress={() => onClickButton()}
      icon={{
        name: 'corner-down-left',
      }}
    />
  );
};

export default BackButton;
