import {createContext, useContext} from 'react';

interface Agreement {
  id: string;
  title: string;
  isRequired: boolean;
  isChecked: boolean;
}

interface CheckBoxGroupContextType {
  agreements: Agreement[];
  toggleAgreement: (id: string) => void;
  toggleAll: (checked: boolean) => void;
  isAllChecked: boolean;
}

const CheckBoxGroupContext = createContext<CheckBoxGroupContextType | null>(
  null,
);

export const useCheckBoxGroupContext = () => {
  const context = useContext(CheckBoxGroupContext);

  if (!context) {
    throw new Error('CheckBoxGroup 컴포넌트 내부에서만 사용 가능합니다.');
  }
  return context;
};

export type {Agreement, CheckBoxGroupContextType};
export default CheckBoxGroupContext;
