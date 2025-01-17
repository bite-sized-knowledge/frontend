import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const CATEGORIES = [
  {id: 'web', label: 'Web'},
  {id: 'mobile', label: 'Mobile'},
  {id: 'hardware', label: 'Hardware & IoT'},
  {id: 'ai', label: 'AI & ML & Data'},
  {id: 'security', label: 'Security & Network'},
  {id: 'db', label: 'DB'},
  {id: 'devops', label: 'DevOps & Infra'},
  {id: 'game', label: 'Game'},
  {id: 'etc', label: '기획'},
  {id: 'design', label: 'Design'},
];

const InterestSelect = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryPress = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(item => item !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>안녕하세요!</Text>
        <Text style={styles.subtitle}>관심있는 주제는 무엇인가요?</Text>
        <Text style={styles.description}>*중복 선택 할 수 있어요.</Text>
      </View>

      <View style={styles.gridContainer}>
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category.id) && styles.selectedButton,
            ]}
            onPress={() => handleCategoryPress(category.id)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategories.includes(category.id) &&
                  styles.selectedCategoryText,
              ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          selectedCategories.length > 0 && styles.startButtonActive,
        ]}>
        <Text
          style={[
            styles.startButtonText,
            selectedCategories.length > 0 && styles.startButtonTextActive,
          ]}>
          시작하기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  startButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonActive: {
    backgroundColor: '#000',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
  },
  startButtonTextActive: {
    color: '#fff',
  },
});

export default InterestSelect;
