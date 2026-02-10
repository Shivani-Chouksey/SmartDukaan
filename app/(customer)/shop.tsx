import CategoryCards from '@/components/ui/categoryCards'
import { AntDesign, EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { categories } from '../data/category.json'
function shop() {
  const [searchText, setSearchText] = useState('')
  return (
    <View style={styles.home}>
      {/* Header */}
      <View style={styles.header} >
        <View style={styles.left}>
          <View>
            <EvilIcons name="location" size={24} color="black" />

          </View>
          <View>
            <Text style={styles.center}>Home <AntDesign name="down" size={11} color="black" /></Text>
            <Text style={styles.locationtext}>Location </Text>

          </View>
        </View>
        <View>
          <SimpleLineIcons name="bag" size={18} color="black" />
        </View>
      </View>

      {/* Search and filter */}
      <View style={styles.searchFilter}>
        <View>
          <TextInput
            style={styles.searchInput}
            onChangeText={setSearchText}
            value={searchText}
            placeholder="Search"

          />
        </View>
        <Pressable style={styles.filterBtn}>
          <Feather name="filter" size={18} color="black" />
        </Pressable>
        <View>

        </View>
        <View>

        </View>
      </View>
      {/* Category */}
      <View>
        <View>
          <Text>Search by Category</Text>
          <Link href='/' >See All</Link>
        </View>
        <View style={styles.categoryWrapper}>
          {
            categories.length && categories.map((cate, i) => <CategoryCards key={i} {...cate}  />)
          }

        </View>
      </View>
       <View>
        <View>
          <Text>Best Deal</Text>
          <Link href='/' >See All</Link>
        </View>
        <View style={styles.categoryWrapper}>
          {/* {
                    SubCategoryItem && SubCategoryItem.items.map((item:any,index:string)=>  <ItemCards key={index} {...item}/>)
                  } */}

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchFilter: {

    padding: 2,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center"
  },
  searchInput: {
    borderRadius: 5,
    backgroundColor: "white",
    padding: 6,
    width: 300

  },
  filterBtn: {
    padding: 6,
    marginLeft: "auto",
    borderRadius: 5,
    backgroundColor: "white",
  },
  center: {
    textAlign: "center"
  },
  home: {
    padding: 8,
  },
  header: {
    backgroundColor: "gray",
    padding: 3,
    fontWeight: 600,
    flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between"

  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  locationtext: {
    color: '#6b6f76c5',
    fontSize: 10
  },
  categoryWrapper:{
    // flex:1,
    display:"flex",
    flexDirection:"row",
    gap:10,

  }
})
export default shop