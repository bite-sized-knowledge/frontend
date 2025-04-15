import React, {createContext, useState} from 'react';
import {View} from 'react-native';
import CheckBox from './CheckBox';
import CheckBoxLabel from './CheckBoxLabel';

interface Agreement {
  id: string;
  title: string;
  isRequired: boolean;
  isChecked: boolean;
}

interface Props {
  children: React.ReactNode;
  agreements: Agreement[];
  onChangeAgreements: (agreements: Agreement[]) => void;
}

interface CheckBoxGroupContextType {
  agreements: Agreement[];
  toggleAgreement: (id: string) => void;
  toggleAll: (checked: boolean) => void;
  isAllChecked: boolean;
}

export const CheckBoxGroupContext =
  createContext<CheckBoxGroupContextType | null>(null);

export const CheckBoxGroup = ({
  children,
  agreements,
  onChangeAgreements,
}: Props) => {
  const [agreementList, setAgreementList] = useState<Agreement[]>(agreements);
  const isAllChecked = agreementList.every(item => item.isChecked);

  const toggleAgreement = (id: string) => {
    const newAgreements = agreementList.map(item =>
      item.id === id ? {...item, isChecked: !item.isChecked} : item,
    );
    setAgreementList(newAgreements);
    onChangeAgreements(newAgreements);
  };

  const toggleAll = (checked: boolean) => {
    const newAgreements = agreementList.map(item => ({
      ...item,
      isChecked: checked,
    }));
    setAgreementList(newAgreements);
    onChangeAgreements(newAgreements);
  };

  return (
    <CheckBoxGroupContext.Provider
      value={{
        agreements: agreementList,
        toggleAgreement,
        toggleAll,
        isAllChecked,
      }}>
      <View style={{gap: 16}}>{children}</View>
    </CheckBoxGroupContext.Provider>
  );
};

// 전체 동의 컴포넌트
const AllAgree = () => {
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8}}>
      <CheckBoxGroup.Label title="전체 동의" />
      <CheckBoxGroup.CheckBox isAll />
    </View>
  );
};

// 개별 약관 아이템 컴포넌트
const Item = ({
  id,
  title,
  isRequired,
}: {
  id: string;
  title: string;
  isRequired: boolean;
}) => {
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 8}}>
      <CheckBoxGroup.Label title={title} required={isRequired} />
      <CheckBoxGroup.CheckBox id={id} />
    </View>
  );
};

CheckBoxGroup.CheckBox = CheckBox;
CheckBoxGroup.Label = CheckBoxLabel;
CheckBoxGroup.AllAgree = AllAgree;
CheckBoxGroup.Item = Item;

export default CheckBoxGroup;
