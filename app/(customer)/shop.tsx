import {
  AntDesign,
  EvilIcons,
  Feather,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { categories } from "../data/category.json";

function Shop() {
  const [searchText, setSearchText] = useState("");

  const bestDeals = [
    {
      id: 1,
      name: "Surf Excel Easy Wash Detergent Powder",
      price: 12,
      originalPrice: 14,
      // image: require("../assets/products/detergent.png"),
    },
    {
      id: 2,
      name: "Fortune Athar Dal (Toor Dal)",
      price: 10,
      originalPrice: 12,
      // image: require("../assets/products/dal.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <EvilIcons name="location" size={24} color="#10B981" />
          <View style={styles.locationInfo}>
            <View style={styles.locationTitleRow}>
              <Text style={styles.headerTitle}>Home</Text>
              <AntDesign name="down" size={10} color="#000" />
            </View>
            <Text style={styles.locationSubtitle}>
              751 High St, Carina, Melbourne 10279
            </Text>
          </View>
        </View>
        <Pressable style={styles.bagIcon}>
          <SimpleLineIcons name="bag" size={20} color="#000" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Feather name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              onChangeText={setSearchText}
              value={searchText}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <Pressable
            style={styles.filterButton}
            onPress={() => router.push("/(customer)/(cart)/check-out")}
          >
            <Feather name="filter" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Shop by Category */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <Link href="/" asChild>
              <Pressable>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.categoryGrid}>
            {categories.map((category, index) => (
              <Pressable key={index} style={styles.categoryCard}>
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={{ uri: category.image }}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>
              World Food Festival. Bring the world to your kitchen!
            </Text>
            <Pressable style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Buy Now</Text>
            </Pressable>
          </View>
          {/* <Image
            source={require("../assets/promo/coca-cola.png")}
            style={styles.promoImage}
            resizeMode="contain"
          /> */}
        </View>

        {/* Best Deal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Deal</Text>
            <Link href="/" asChild>
              <Pressable>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.dealsRow}>
            {bestDeals.map((deal) => (
              <View key={deal.id} style={styles.dealCard}>
                <Pressable style={styles.favoriteIcon}>
                  <Ionicons name="heart-outline" size={20} color="#000" />
                </Pressable>
                {/* <Image
                  source={deal?.image}
                  style={styles.dealImage}
                  resizeMode="contain"
                /> */}
                <Text style={styles.dealName} numberOfLines={2}>
                  {deal.name}
                </Text>
                <View style={styles.dealPriceRow}>
                  <View>
                    <Text style={styles.dealPrice}>${deal.price}</Text>
                    <Text style={styles.dealOriginalPrice}>
                      ${deal.originalPrice}
                    </Text>
                  </View>
                  <Pressable style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Ionicons name="home" size={24} color="#10B981" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color="#9CA3AF" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <SimpleLineIcons name="bag" size={22} color="#9CA3AF" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    // paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationInfo: {
    marginLeft: 4,
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  locationSubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  bagIcon: {
    padding: 8,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000",
  },
  filterButton: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "500",
  },

  // Category Grid
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
  categoryCard: {
    width: "22%",
    alignItems: "center",
  },
  categoryImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryName: {
    fontSize: 11,
    color: "#000",
    textAlign: "center",
    lineHeight: 14,
  },

  // Promo Banner
  promoBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  promoContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    lineHeight: 22,
    marginBottom: 12,
  },
  promoButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  promoImage: {
    width: 120,
    height: 120,
    marginLeft: 8,
  },

  // Deals
  dealsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  dealCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    position: "relative",
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  dealImage: {
    width: "100%",
    height: 100,
    marginBottom: 8,
  },
  dealName: {
    fontSize: 13,
    color: "#000",
    marginBottom: 8,
    lineHeight: 16,
    minHeight: 32,
  },
  dealPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dealPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  dealOriginalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  addButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  // Bottom spacing
  bottomSpacing: {
    height: 20,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  navItem: {
    padding: 8,
  },
});

export default Shop;
