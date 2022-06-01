import React, {useEffect, useCallback, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Image,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {
  getDBConnection,
  createTable,
  getProducts,
  saveProduct,
  storeProduct,
  deleteSingleProduct,
  removeTable,
} from './db-service';
import {Product} from './model';

const Separator = () => <View style={styles.separator} />;

const HomeScreen = ({navigation}) => {
  const [Product, setProduct] = useState([]);

  const loadDataCallback = useCallback(async () => {
    try {
      const products: Product[] = [
        {
          id: 0,
          name: '',
        },
      ];
      const db = await getDBConnection();
      // removeTable(db)
      await createTable(db);
      const storedProducts = await getProducts(db);
      console.log('storetodoitem', storedProducts);

      if (storedProducts.length > 0) {
        setProduct(storedProducts);
      } else {
        await saveProduct(db, products);
        setProduct(products);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const renderItem = ({item}) => (
    // <TouchableOpacity>
    <View
      style={{
        padding: 10,
        justifyContent: 'space-between',
        backgroundColor: '#a5c2bb',
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text style={{textAlign: 'left', color: 'black', fontSize: 14}}>
        {item.name}
      </Text>
      <TouchableOpacity
        onPress={() => deleteProduct(item.id)}>
        <Image
          resizeMode="contain"
          source={require('./delete-icon.png')}
          style={{backgroundColor: '#a5c2bb', borderRadius: 5, height: 20, width: 20}}
        />
      </TouchableOpacity>
    </View>
    // </TouchableOpacity>
  );

  const isDarkMode = useColorScheme() === 'dark';

  const [text, setText] = React.useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const savingProduct = async () => {
    if (!text && text === '') {
      alert('Please Enter Some Value');
      return;
    }
    Keyboard.dismiss();
    let productName = text;
    const db = await getDBConnection();
    await storeProduct(db, productName);
    loadDataCallback();
    setText('');
  };

  const deleteProduct = async (pid) => {
    const db = await getDBConnection();
    await deleteSingleProduct(db, pid);
    loadDataCallback();
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <KeyboardAvoidingView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SaleScreen')}>
                <View style={styles.sellHeader}>
                  <Text style={[styles.sellBody, styles.scol]}>
                    Sell Product
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('DetailScreen')}>
                <View style={styles.sellHeader}>
                   <Text style={[styles.sellBody, styles.vcol]}>
                    View Product
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={text}
              onChangeText={value => setText(value)}
              placeholder="Enter Product Name"
            />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#1ab0f0',
                  padding: 5,
                  width: 100,
                  borderRadius: 5,
                }}>
                <Text
                  onPress={savingProduct}
                  style={{color: 'white', textAlign: 'center'}}>
                  SAVE
                </Text>
              </TouchableOpacity>
            </View>
            <Separator />
          </View>
          <FlatList
            data={Product}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sellHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  },
  sellBody: {
    color: 'white',
    padding: 10,
    width: '100%',
    borderRadius: 5,
    textAlign: 'center',
  },
  scol: {
    backgroundColor: '#c73a14',
  },
  vcol: {
    backgroundColor: '#c7a312',
  },
});

export default HomeScreen;
