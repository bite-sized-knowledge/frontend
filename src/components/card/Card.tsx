import React from 'react';
import {StyleSheet, View} from 'react-native';
import {elevation} from '../../styles/tokens/elevation';
import {CardHeader} from './CardHeader';
import {Blog} from '../../types/Blog';
import {CardBody} from './CardBody';
import {Article} from '../../types/Article';
import {CardFooter} from './CardFooter';
import {useTheme} from '../../context/ThemeContext';

interface CardProps {
  article: Article;
  blog: Blog;
  handleCardBodyClick: Function;
}

// TODO(권대현): 다크모드 대응 필요, 이벤트 작업 필요(이벤트 작업하면서 수정할 부분이 좀 생길듯)
export const Card: React.FC<CardProps> = ({
  article,
  blog,
  handleCardBodyClick,
}) => {
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.card,
        elevation.card,
        {backgroundColor: theme.background},
      ]}>
      <CardHeader blog={blog} />
      <CardBody article={article} handleCardBodyClick={handleCardBodyClick} />
      <CardFooter article={article} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    height: 396,
    borderRadius: 16,
  },
});
