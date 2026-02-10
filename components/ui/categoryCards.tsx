import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Category = {
    id: string,
    name: string,
    description: string,
    image: string,
    subcategories: any[]
}

function CategoryCards(props: Category) {
    return (
        <Link style={styles.wraaper}  href={{
          pathname: `/(customer)/category/[id]`,
          params: { id: props.id }
        }}>
            <View style={styles.imageWrapper}>
                <img style={styles.img} src={props.image} alt={props.name} />
            </View>
            <Text style={styles.text}>{props.name}</Text>
        </Link>
    )
}


const styles = StyleSheet.create({
    wraaper: {
        width: 80,
        backgroundColor: "gray",
        minHeight: 80
    },
    imageWrapper: {
        width: "auto",
        height: 60,
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
    text: {
        fontSize: 10,
        textAlign: "center",
        fontWeight: 700,
        color: "#242424"
    }
})

export default CategoryCards