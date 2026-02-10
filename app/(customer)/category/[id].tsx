import ItemCards from "@/components/ui/itemCards";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import data from "../../data/category.json";

export default function CategoryItems() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const categories = data.categories;
  const subcategories = data.subcategories;

  const [selectedSub, setSelectedSub] = useState("sub-001");

  const categoryDetail = categories.find((cat) => cat.id === id);
  const subCategoryDetail = subcategories.find((s) => s.id === selectedSub);

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerIcon}>
          <AntDesign name="left" size={20} color="#111827" />
        </Pressable>

        <Text style={styles.headerTitle}>{categoryDetail?.name}</Text>

        <Pressable style={styles.headerIcon} onPress={()=>router.navigate('/(search)')}>
          <Feather name="search" size={20} color="#111827" />
        </Pressable>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* LEFT — Subcategory Menu */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.leftMenu}>
          {categoryDetail?.subcategories?.map((sub) => {
            const active = selectedSub === sub.id;
            return (
              <Pressable
                key={sub.id}
                onPress={() => setSelectedSub(sub.id)}
                style={[styles.subBtn, active && styles.subBtnActive]}
              >
                <View style={styles.subImgWrap}>
                  <Image
                    // source={{ uri: sub.image }}
                    style={styles.subImg}
                    resizeMode="cover"
                  />
                </View>
                <Text style={[styles.subText, active && styles.subTextActive]}>
                  {sub.name}
                </Text>

                {active && <View style={styles.activeIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* RIGHT — Items Grid */}
        <FlatList
          data={subCategoryDetail?.items || []}
          numColumns={2}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <ItemCards {...item} />
            </View>
          )}
        />
      </View>
    
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 60,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    backgroundColor: "#fff",
  },

  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  body: {
    flex: 1,
    flexDirection: "row",
  },

  /* Left Menu */
  leftMenu: {
    width: 110,
    backgroundColor: "#F9FAFB",
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.06)",
  },

  subBtn: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 12,
  },
  subBtnActive: {
    backgroundColor: "#E8F1FF",
  },

  subImgWrap: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  subImg: { width: "100%", height: "100%" },

  subText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
    color: "#4B5563",
  },
  subTextActive: {
    color: "#0B72E7",
  },

  activeIndicator: {
    position: "absolute",
    left: 0,
    width: 4,
    top: 12,
    bottom: 12,
    backgroundColor: "#0B72E7",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
``