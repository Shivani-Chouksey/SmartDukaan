import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

function index() {
  const [searchText, setSearchText] = useState();
  const [seachItemList, setSearchItemList] = useState([]);
  return (
    <View>
      <View>
        Back
      </View>
    <Pressable onPress={()=>router.push('/(customer)/modal')}>
        <MaterialCommunityIcons name="sort" size={24} color="black" />
    </Pressable>
      <View>
        <TextInput
          //  style={styles.searchInput}
          //  onChangeText={setSearchText}
          value={searchText}
          placeholder="Search"

        />
      </View>
      {
        searchText && <Text>Showing Result for - {searchText}</Text>
      }
      {
        seachItemList.length ? 'Rendor item':'Item Not Available'
      }
      <View>
        <Text>Recent Search</Text>
      </View>
      <View>
        <Text>Trending Now</Text>
      </View>
    </View>
  )
}

export default index