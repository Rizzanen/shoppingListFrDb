import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Keyboard,
  FlatList,
} from "react-native";
import { getDatabase, push, ref, onValue, remove } from "firebase/database";
import React, { useState, useEffect } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfazN2OXyd9VWzbL6nLBZvg9G8LSR2BPc",
  authDomain: "shoppinglist-frdb.firebaseapp.com",
  databaseURL:
    "https://shoppinglist-frdb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shoppinglist-frdb",
  storageBucket: "shoppinglist-frdb.appspot.com",
  messagingSenderId: "708142818619",
  appId: "1:708142818619:web:24ea2014f23555f61c031e",
  measurementId: "G-W34M2C2CP4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

ref(database, "items/");

export default function App() {
  const [listItems, setListItems] = useState([]);
  const [product, setProduct] = useState({
    product: "",
    amount: "",
  });

  useEffect(() => {
    const itemsRef = ref(database, "items/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();

      const items = [];

      //Iterate through the snapshot keys values so we can set the automatically made unique key as "id" and then add the values of the key as part of the same object.
      //this allows the product to be later deleted from the database with the "id" propertys value.
      Object.keys(data).forEach((key) => {
        items.push({ id: key, ...data[key] });
      });

      setListItems(items);
    });
  }, []);

  const handleProductInputChange = (text) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      product: text,
    }));
  };

  const handleAmountInputChange = (text) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      amount: text,
    }));
  };

  const save = () => {
    push(ref(database, "items/"), product);
    setProduct({
      product: "",
      amount: "",
    });
    Keyboard.dismiss();
  };

  const deleteItem = (id) => {
    console.log("deleting item with id: " + id);
    remove(ref(database, `/items/${id}`));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          marginTop: "10%",
          borderWidth: 2,
          borderColor: "black",
          width: "60%",
          height: 40,
          fontSize: 18,
        }}
        placeholder="Product"
        value={product.product}
        onChangeText={(text) => {
          handleProductInputChange(text);
        }}
      />
      <TextInput
        style={{
          marginTop: "2%",
          borderWidth: 2,
          borderColor: "black",
          width: "60%",
          height: 40,
          fontSize: 18,
        }}
        placeholder="Amount"
        value={product.amount}
        onChangeText={(text) => {
          handleAmountInputChange(text);
        }}
      />
      <Pressable
        style={{
          backgroundColor: "blue",
          padding: 10,
          marginTop: 10,
        }}
        onPress={save}
      >
        <Text style={{ color: "white" }}>Save</Text>
      </Pressable>
      <View
        style={{
          flex: 1,
          marginTop: 30,
        }}
      >
        <Text style={{ fontSize: 25 }}>Shopping List</Text>
        <FlatList
          data={listItems}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>{item.product + " " + item.amount} </Text>
              <Pressable
                style={{ backgroundColor: "green", padding: 5 }}
                onPress={() => deleteItem(item.id)}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Bought
                </Text>
              </Pressable>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{
            maxHeight: 300,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
