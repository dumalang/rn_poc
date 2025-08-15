import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import CrudExample from '../components/CrudExample.tsx';

const HomeScreen = ()=> {
  const isDarkMode = useColorScheme() === 'dark';

  // @ts-ignore
  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <CrudExample />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
