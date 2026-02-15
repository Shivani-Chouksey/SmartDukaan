// import { Link } from 'expo-router'
// import React from 'react'
// import { StyleSheet, Text, View } from 'react-native'

// type Category = {
//     id: string,
//     name: string,
//     description: string,
//     image: string,
//     subcategories: any[]
// }

// function CategoryCards(props: Category) {
//     return (
//         <Link style={styles.wraaper}  href={{
//           pathname: `/(customer)/category/[id]`,
//           params: { id: props.id }
//         }}>
//             <View style={styles.imageWrapper}>
//                 <img style={styles.img} src={props.image} alt={props.name} />
//             </View>
//             <Text style={styles.text}>{props.name}</Text>
//         </Link>
//     )
// }

// const styles = StyleSheet.create({
//     wraaper: {
//         width: 80,
//         backgroundColor: "gray",
//         minHeight: 80
//     },
//     imageWrapper: {
//         width: "auto",
//         height: 60,
//     },
//     img: {
//         width: "100%",
//         height: "100%",
//         objectFit: "cover"
//     },
//     text: {
//         fontSize: 10,
//         textAlign: "center",
//         fontWeight: 700,
//         color: "#242424"
//     }
// })

// export default CategoryCards
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  onPress?: () => void;
}

const CategoryCards: React.FC<CategoryCardProps> = ({
  name,
  image,
  onPress,
}) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    width: 80,
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 11,
    color: "#000",
    textAlign: "center",
    lineHeight: 14,
  },
});

export default CategoryCards;
