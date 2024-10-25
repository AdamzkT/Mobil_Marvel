import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, FlatList, Button, Alert } from 'react-native';
import { Ipcim } from './ipcim';

export default function App() {
  const [filmek, setFilmek] = useState([])

  const filmLekerdez = async () => {
    try {
      const response = await fetch(`${Ipcim}/film_lekerdez`);
      if (!response.ok) {
        throw new Error('Hiba a filmek lekérdezésekor: ' + response.statusText);
      }
      const data = await response.json();
      setFilmek(data);
    } catch (error) {
      Alert.alert('Hiba', error.message);
      console.error('Film lekérdezési hiba: ', error);
    }
  }

  const szavaz = async (id) => {
    try {
      const response = await fetch(`${Ipcim}/szavaz`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "bemenet": id
        })
      });
      if (!response.ok) {
        throw new Error('Hiba a szavazás során: ' + response.statusText);
      }
      Alert.alert('', 'Sikeres szavazás!');
    } catch (error) {
      Alert.alert('Hiba', error.message);
      console.error('Szavazási hiba: ', error);
    }
  }

  useEffect(() => {filmLekerdez()}, [])

  const Item = ({id, cim, kep}) => (
  <View style={{paddingBottom: 30, borderWidth: 1, borderColor: 'lightgray'}}>
    <Text style={styles.cim}>{cim}</Text>
    <Image source={{uri: `${Ipcim}/${kep}`}} style={{height: 500, width: '100%'}}/>
    <Button onPress={() => szavaz(id)} title='ERRE SZAVAZOK'/>
  </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 40}}>Marvel filmek</Text>
      <FlatList
        style={styles.lista}
        data={filmek}
        renderItem={({item}) => <Item id={item.film_id} cim={item.film_cim} kep={item.film_kep}/>}
        keyExtractor={item => item.film_id.toString()}
      />
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  cim: {
    textAlign: 'center',
    fontSize: 25,
    color: 'darkred',
    fontWeight: '600',
  },
  lista: {
    width: '80%',
  }
});
