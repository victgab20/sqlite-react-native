import React from 'react';
import { View, Text, StyleSheet, Button, FlatList, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';


async function openDatabase(item){

const db = await SQLite.openDatabaseAsync('database');

await db.execAsync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS item (id INTEGER PRIMARY KEY NOT NULL, value VARCHAR(255) NOT NULL);
  `);
  const result = await db.runAsync('INSERT INTO item (value) VALUES (?)', item);
  const allRows = await db.getAllAsync('SELECT * FROM item');
  console.log(allRows)
  return allRows;
}



export default function App() {
  const [items, setItems] = useState([]);
  const [texInput, setTextInput] = useState('')

  
  const handlePress = async () => {
    const rows = await openDatabase(texInput);
    console.log(texInput);
    setTextInput('');
    setItems(rows)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemplo de SQLite com Expo</Text>
      <TextInput
        placeholder="Digite um pokemon"
        value={texInput}
        onChangeText={setTextInput}
        style={styles.input}
      />
      <Button title="ADICIONAR"
      onPress={handlePress}/>
      <View style={{height: '40%', width: '40%'}}>
        <FlatList
          data={items}
          style={{
            borderBlockColor: 'red'
          }}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.box}>
              <Text style={{width: '30px'}}>{item.value}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  box:{
    fontSize: 20,
    borderWidth: 2,
    padding: '5%',
    width: '80px',
  },
  input: {
    borderWidth: 2,
    height: '5%',
    width: '50%'
  }
});
