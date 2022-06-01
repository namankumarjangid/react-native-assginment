import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet, KeyboardAvoidingView, ScrollView} from 'react-native'
import { TextInput } from 'react-native-paper';
import { getDBConnection, createTable, getProducts, saveProduct } from './db-service';
import Autocomplete from 'react-native-autocomplete-input';
import { storeOrder, createOrderTable } from './order.sql';
import { Orders } from './model';

const SaleScreen = ({ navigation }) => {
    const [search, setSearch] = useState()
    const [product, setProduct] = useState([])
    const [selectProduct, setselectProduct] = useState(null)
    const [orderprice, setOrderprice] = useState()
    const [quantity, setQuantity] = useState()
    const [itemNameShow, setItemNameShow] = useState(true)

    const loadDataCallback = useCallback(async () => {

        try {
            let db = await getDBConnection();
            await createOrderTable(db);
            
            const storedProducts = search && search.length > 0 ? await getProducts(db, search) : await getProducts(db);
            if (storedProducts.length > 0) {
                setProduct(storedProducts)
            } else {
                setProduct([])
            }
            console.log("storetodoitem", storedProducts)

        } catch (error) {
            console.error(error);
        }
    }, [search]);

    useEffect(() => {
        loadDataCallback();
    }, [loadDataCallback]);

    const setSearchAuto = (e) => {
        setSearch(e);
    }
    const saveOrder = async () => {

        if(!orderprice || !quantity){
            alert('Please enter all field')
            return
        }

        let db = await getDBConnection();
        let order= {
            productId: selectProduct.id,
            price: orderprice,
            quantity: quantity
        }
        await (storeOrder(db,order))
        .then(orders => {
            setOrderprice('')
            setQuantity('')
            alert("Listed Product Successfullly")
            navigation.navigate('HomeScreen')
            // ToastAndroid.show("Listed Product Successfullly", ToastAndroid.LONG)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <View>
            <View style={styles.container}>
                { itemNameShow && 
                    <View style={styles.autocompleteContainer}>
                        <Autocomplete
                            data={product}
                            value={search}
                            placeholder="Search Product Name"
                            onChangeText={(text) => setSearchAuto(text)}
                            flatListProps={{
                                keyExtractor: (_, idx) => idx,
                                renderItem: ({ item }) => (
                                    <TouchableOpacity style={{ height: 20 }} onPress={() => {
                                        setselectProduct(item)
                                        setItemNameShow(false)
                                    }}>
                                        <Text style={{ color: 'red' }}>{ search?.length > 0 ? item.name : ""}</Text>
                                    </TouchableOpacity>
                                )
                        }}/>
                    </View>
                }
            </View>
            {selectProduct && <KeyboardAvoidingView style={{
                borderWidth: 2,
                borderColor: '#ccc',
                borderRadius: 20,
                margin: 20
            }}>
                <Text style={{ padding: 10, color: 'red', fontWeight : 'bold', fontSize : 20, alignItems: 'center', justifyContent: 'center' }}>{selectProduct.name}</Text>
                <TextInput value={orderprice} onChangeText={value => setOrderprice(value)} label="Price" style={{ margin: 10 }} />
                <TextInput value={quantity} onChangeText={value => setQuantity(value)} label="Quantity" style={{ margin: 10 }} />
                <TouchableOpacity style={{ margin: 10, width: 100, padding: 10, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderRadius: 25,  }}>
                    <Text onPress={saveOrder} style={{ fontSize: 15, color: '#fff', fontWeight: 'bold' }}>Update</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#F5FCFF',
        flex: 1,

        // Android requiers padding to avoid overlapping
        // with content and autocomplete
        paddingTop: 50,

        // Make space for the default top bar
        ...Platform.select({
            web: {
                marginTop: 0,
            },
            default: {
                marginTop: 25,
            },
        }),
    },
    itemText: {
        fontSize: 15,
        margin: 2,
    },
    descriptionContainer: {
        // `backgroundColor` needs to be set otherwise the
        // autocomplete input will disappear on text input.
        backgroundColor: '#F5FCFF',
        marginTop: 8,
    },
    infoText: {
        textAlign: 'center',
    },
    autocompleteContainer: {
        // Hack required to make the autocomplete
        // work on Andrdoid
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        padding: 5,
    },
});

export default SaleScreen