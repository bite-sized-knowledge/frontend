import React, {useState} from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {BaseButton} from '../button';
import {typography} from '@/styles/tokens/typography';
import {useTheme} from '@/context/ThemeContext';
import Icons from '@/assets/icons';

interface YearSpinnerProps {
  visible: boolean; // 모달 표시 여부
  initialYear?: number; // 초기 선택 값 (기본값 2000)
  onClose: () => void; // 닫기
  onSelect: (year: number) => void; // 선택 완료 시 호출되는 콜백
}

const YearSpinner: React.FC<YearSpinnerProps> = ({
  visible,
  initialYear = 2000,
  onClose,
  onSelect,
}) => {
  const {theme} = useTheme();
  // 내부에서 현재 선택된 년도를 관리
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);

  // 예시로 1998 ~ 2002까지 생성 (필요에 따라 범위 조정 가능)
  const years = Array.from({length: 50}, (_, i) => 1998 + i);

  const handlePressSelect = () => {
    onSelect(selectedYear);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* 반투명 배경 */}
      <View style={styles.overlay}>
        {/* 흰색 박스 컨테이너 */}
        <View style={[styles.container, {backgroundColor: theme.background}]}>
          {/* 스피너(피커) 영역 */}
          <View style={styles.header}>
            <Icons.Close width={24} height={24} onPress={onClose} />
          </View>
          <Picker
            selectedValue={selectedYear}
            onValueChange={value => setSelectedYear(value)}
            style={styles.picker}
            itemStyle={[styles.pickerItem, typography.subHead]}>
            {years.map(year => (
              <Picker.Item key={year} label={`${year}`} value={year} />
            ))}
          </Picker>

          {/* '선택' 버튼 */}
          <BaseButton
            title={'선택'}
            onPress={handlePressSelect}
            textStyle={{color: 'white'}}
            style={[
              styles.button,
              {
                backgroundColor: theme.main,
              },
            ]}
          />
        </View>
      </View>
    </Modal>
  );
};

export default YearSpinner;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 어두운 배경
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    minWidth: 320,
    minHeight: 384,
    borderRadius: 20,
    alignItems: 'center',
  },
  header: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    padding: 12,
  },
  picker: {
    minWidth: 280,
    minHeight: 240,
  },
  pickerItem: {
    minHeight: 240,
  },
  button: {
    minWidth: 280,
    margin: 20,
  },
});
