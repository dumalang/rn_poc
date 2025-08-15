import React, { JSX, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";

interface Item {
  id: number;
  name: string;
}

export default function CrudExample(): JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleAddOrUpdate = () => {
    if (text.trim() === "") return;

    if (editId !== null) {
      // Update
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editId ? { ...item, name: text } : item
        )
      );
      setEditId(null);
    } else {
      // Create
      setItems(prevItems => [
        ...prevItems,
        { id: Date.now(), name: text }
      ]);
    }
    setText("");
  };

  const handleEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setText(item.name);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Simple CRUD (TypeScript)</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={text}
        onChangeText={setText}
      />
      <Button
        title={editId !== null ? "Update" : "Add"}
        onPress={handleAddOrUpdate}
      />

      <FlatList
        style={{ marginTop: 20 }}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item.id)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff"
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  edit: {
    color: "blue",
    marginRight: 15
  },
  delete: {
    color: "red"
  }
});
