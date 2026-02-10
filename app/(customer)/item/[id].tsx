import { AntDesign, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Import your existing card component and data
import ItemCards from "@/components/ui/itemCards";
import data from "../../data/category.json";

export default function ItemDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [show, setShow] = React.useState(false);
    const allSubcategories = data.subcategories;
    const allItems = allSubcategories.flatMap((s) => s.items);

    const item = allItems.find((it) => it.id === id);

    const [qty, setQty] = useState(0);

    const similarItems = useMemo(() => {
        return allItems
            .filter((it) => it.id !== id)
            .slice(0, 8);
    }, [id]);

    if (!item) {
        return (
            <View style={styles.centered}>
                <Text>Item not found.</Text>
            </View>
        );
    }

    const discounted = item.mrp && item.mrp > item.price;
    const discountPercent = discounted
        ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
        : 0;

    return (
        <View style={styles.wrapper}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.headerBtn}>
                    <AntDesign name="left" size={20} color="#111" />
                </Pressable>

                <Text numberOfLines={1} style={styles.headerTitle}>
                    {/* {item.name} */}
                    Item Detail
                </Text>

                <Pressable style={styles.headerBtn}>
                    <Feather name="share" size={20} color="#111" />
                </Pressable>
            </View>

            {/* MAIN CONTENT */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* IMAGE */}
                <Animated.View entering={FadeIn} style={styles.imageWrap}>
                    {/* <Image
            source={{ uri: item.image }}
            style={styles.mainImage}
            resizeMode="contain"
          /> */}

                    {discounted && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                        </View>
                    )}
                </Animated.View>

                {/* DETAILS */}
                <View style={styles.detailBox}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemUnit}>{item.unit}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{item.price}</Text>
                        {discounted && (
                            <Text style={styles.mrp}>₹{item.mrp}</Text>
                        )}
                    </View>

                    {/* ADD / STEPPER */}
                    <View style={styles.addRow}>
                        {qty === 0 ? (
                            //   <Pressable
                            //     onPress={() => setQty(1)}
                            //     style={styles.addButton}
                            //   >
                            //     <Text style={styles.addButtonText}>Add</Text>
                            //   </Pressable>

                            <Pressable style={styles.addBtn}>
                                <Text style={styles.addBtnText}>Add</Text>
                            </Pressable>

                        ) : (
                            <View style={styles.stepper}>
                                <Pressable
                                    onPress={() => setQty(Math.max(0, qty - 1))}
                                    style={styles.stepperBtn}
                                >
                                    <Text style={styles.stepperText}>−</Text>
                                </Pressable>
                                <Text style={styles.qtyText}>{qty}</Text>
                                <Pressable
                                    onPress={() => setQty(qty + 1)}
                                    style={styles.stepperBtn}
                                >
                                    <Text style={styles.stepperText}>＋</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>

                {/* DESCRIPTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <Text style={styles.sectionText}>
                        This is a fresh and premium quality {item.name}. Perfect for daily use.
                    </Text>
                </View>

                {/* REVIEWS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Customer Reviews</Text>

                    {/* Single Review */}
                    <View style={styles.reviewBox}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewName}>Aman Gupta</Text>
                            <View style={styles.reviewStars}>
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                            </View>
                        </View>

                        <Text style={styles.reviewText}>
                            Good quality, fresh and neatly packed. Will order again.
                        </Text>
                    </View>

                    {/* Another Review */}
                    <View style={styles.reviewBox}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewName}>Priya Sharma</Text>
                            <View style={styles.reviewStars}>
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                                <AntDesign name="star" size={14} color="#FFB300" />
                            </View>
                        </View>

                        <Text style={styles.reviewText}>
                            Decent product for the price. Fresh but could be better.
                        </Text>
                    </View>
                </View>

                {/* SIMILAR ITEMS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Similar Products</Text>

                    <FlatList
                        data={similarItems}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                        keyExtractor={(it) => it.id}
                        renderItem={({ item }) => (
                            <ItemCards {...item} />
                        )}
                    />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

           
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: "#FFF" },
    addBtn: {
        backgroundColor: '#0B72E7',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addBtnDisabled: {
        backgroundColor: '#BFC7D1',
    },
    addBtnText: {
        color: '#fff',
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    header: {
        height: 58,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E5E7EB",
    },
    headerBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    imageWrap: {
        width: "100%",
        height: 260,
        backgroundColor: "#F8FAFC",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    mainImage: { width: "85%", height: "85%" },

    discountBadge: {
        position: "absolute",
        top: 16,
        left: 16,
        backgroundColor: "#0B72E7",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    discountText: { color: "#fff", fontWeight: "700", fontSize: 12 },

    detailBox: { padding: 16 },
    itemName: { fontSize: 20, fontWeight: "700", color: "#111" },
    itemUnit: { fontSize: 14, color: "#6B7280", marginTop: 4 },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 10,
    },
    price: { fontSize: 22, fontWeight: "700", color: "#059669" },
    mrp: {
        fontSize: 16,
        color: "#9CA3AF",
        textDecorationLine: "line-through",
    },

    addRow: { marginTop: 16 },
    addButton: {
        backgroundColor: "#0B72E7",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    addButtonText: { color: "#FFF", fontWeight: "700" },

    stepper: {
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        padding: 4,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    stepperBtn: {
        backgroundColor: "#fff",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    stepperText: { fontSize: 16, fontWeight: "700" },
    qtyText: { fontSize: 16, fontWeight: "700" },

    section: { padding: 16 },
    sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
    sectionText: { fontSize: 14, color: "#374151", lineHeight: 20 },

    reviewBox: {
        padding: 12,
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    reviewName: { fontWeight: "700", fontSize: 14 },
    reviewStars: { flexDirection: "row", gap: 2 },
    reviewText: {
        marginTop: 6,
        fontSize: 13,
        color: "#444",
        lineHeight: 18,
    },

    centered: { flex: 1, alignItems: "center", justifyContent: "center" },
});
