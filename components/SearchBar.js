import { TextInput, StyleSheet } from 'react-native';

function SearchBar({ searchText, handleSearchTextChange }) {
  return (
    <TextInput
      style={styles.searchBar}
      placeholder='Search'
      value={searchText}
      onChangeText={handleSearchTextChange}
    />
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
});
