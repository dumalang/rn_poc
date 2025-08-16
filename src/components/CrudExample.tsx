import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Item } from '../database/entities/Item';
import { ensureDataSource } from '../database/AppDataSource';

export default function CrudExample() {
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ensureDataSource();
        setDbReady(true);
        await fetchItems();
      } catch (e: any) {
        Alert.alert('DB Error', e?.message || String(e));
      }
    })();
  }, []);

  const fetchItems = async () => {
    const ds = await ensureDataSource();
    const repo = ds.getRepository(Item);
    const all = await repo.find({ order: { id: 'DESC' } });
    setItems(all);
  };

  const handleAddOrUpdate = async () => {
    if (!text.trim()) return;
    const ds = await ensureDataSource();
    const repo = ds.getRepository(Item);

    if (editId !== null) {
      // Update
      const item = await repo.findOneBy({ id: editId });
      if (item) {
        item.name = text;
        item.updated_at = new Date();
        await repo.save(item);
      }
      setEditId(null);
    } else {
      // Create
      const newItem = repo.create({
        name: text,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await repo.save(newItem);
    }
    setText('');
    await fetchItems();
  };

  const handleEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setText(item.name || '');
      setEditId(id);
    }
  };

  const handleDelete = async (id: number) => {
    const ds = await ensureDataSource();
    const repo = ds.getRepository(Item);
    await repo.delete(id);
    await fetchItems();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Simple CRUD (TypeORM)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={text}
        onChangeText={setText}
      />
      <Button
        title={editId !== null ? 'Update' : 'Add'}
        onPress={handleAddOrUpdate}
        disabled={!text.trim() || !dbReady}
      />
      <FlatList
        style={{ marginTop: 20 }}
        data={items}
        keyExtractor={item => item?.id?.toString() || Date.now().toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item.id || 0)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id || 0)}>
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
