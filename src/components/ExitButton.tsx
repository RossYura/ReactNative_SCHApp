import React from 'react';
import useAudio from '../hooks/useAudio';
import { Colors } from '../styles';
import SquareButton from './SquareButton';

const ExitButton: React.FC<{ navigation: any, onClick?: any, disableDefaultNavigation?: boolean }> = (props) => {
  const { navigation, onClick, disableDefaultNavigation } = props;
  const audio = useAudio();

  const onClickButton = () => {
    audio.playSoundEffect('buttonPress');
    if (!disableDefaultNavigation) navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    if (onClick) onClick();
  };

  return (
    <SquareButton
    // eslint-disable-next-line react/destructuring-assignment
      onPress={() => onClickButton()}
      icon={{
        name: 'x',
        color: Colors.red,
      }}
    />
  );
};

export default ExitButton;
