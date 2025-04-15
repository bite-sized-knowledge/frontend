import React from 'react';
import {Pressable} from 'react-native';
import Icons from '@/assets/icons';
import {useCheckBoxGroupContext} from './CheckBoxGroupContext';

interface Props {
  id?: string;
  isAll?: boolean;
}

const CheckBox = ({id, isAll}: Props) => {
  const {agreements, toggleAgreement, toggleAll, isAllChecked} =
    useCheckBoxGroupContext();

  const isChecked = isAll
    ? isAllChecked
    : agreements.find(item => item.id === id)?.isChecked || false;

  const handlePress = () => {
    if (isAll) {
      toggleAll(!isAllChecked);
    } else if (id) {
      toggleAgreement(id);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      {isChecked ? <Icons.BoxChecked /> : <Icons.Box />}
    </Pressable>
  );
};

export default CheckBox;
