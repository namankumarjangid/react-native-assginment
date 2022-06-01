import {Text, View, ScrollView, StyleSheet, FlatList} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {TextInput, DataTable} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {getDBConnection, getSingleProduct} from './db-service';
import {getOrders} from './order.sql';
import {Orders} from './model';

const DetailScreen = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [preDate, setPreDate] = useState();
  const [preOpen, setPreOpen] = useState(false);
  const [defaultDate, setDefaultDate] = useState();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var previousDate =
      new Date().getFullYear() +
      '-' +
      (new Date().getMonth() + 1) +
      '-1 ' +
      new Date().getHours() +
      ':' +
      new Date().getMinutes();

    const d = new Date(previousDate);
    let text = d.toISOString();

    // console.log({text});

    setDefaultDate(text);
  });

  const orderData = useCallback(async () => {
    const db = await getDBConnection();
    let orders: any = await getOrders(db);
    let formattedOrders = {};
    await orders.map(async (order, index) => {
      let single = await getSingleProduct(db, order.productId);
      let created_at = order.created_at;
      formattedOrders[created_at] = formattedOrders[created_at]
        ? [...formattedOrders[created_at]]
        : [];
      formattedOrders[created_at].push({
        ...order,
        productName: single?.[0]?.name,
      });
      return {...order, productName: single?.[0]?.name};
    });
    setProductData(formattedOrders);

    setLoading(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 1000);
    orderData();
  }, [orderData]);

  const renderItem = ({item}) => {
    return (
      <DataTable.Row>
        <DataTable.Cell>{item.productName}</DataTable.Cell>
        <DataTable.Cell>{item.created_at}</DataTable.Cell>
        <DataTable.Cell
          style={{alignItems: 'center', justifyContent: 'center'}}>
          {item.price}
        </DataTable.Cell>
      </DataTable.Row>
    );
  };

  const selectOrderDate = (date) => {
      setOpen(false);
      setDate(date);
      var End_Date = moment(date).format('DD/MM/YYYY')
      
      
      Object.entries(productData).filter((product, key) => {
        if(new Date(product[0]).setHours(0,0,0,0) <= date.setHours(0,0,0,0)) {
          console.log('productproduct=====', product)
          setProductData(product)
          return product
        }
      })
  }

  return (
    <ScrollView>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          <Text
            style={{width: '20%', margin: 10, fontSize: 20, lineHeight: 40}}>
            Date
          </Text>
          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{width: '48%', padding: 20}}
              onPress={() => setPreOpen(true)}>
              Start Date:{' '}
              {preDate
                ? moment(preDate).format('DD/MM/YYYY')
                : moment(defaultDate).format('DD/MM/YYYY')}
            </Text>
            <DatePicker
              modal
              open={preOpen}
              date={date}
              onConfirm={preDate => {
                setPreOpen(false);
                setPreDate(preDate);
              }}
              onCancel={() => {
                setPreOpen(false);
              }}
              maximumDate={new Date()}
            />
            <Text
              style={{width: '48%', padding: 20}}
              onPress={() => setOpen(true)}>
              End Date: {moment(date).format('DD/MM/YYYY')}
            </Text>
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={date => selectOrderDate(date)}
              onCancel={() => {
                setOpen(false);
              }}
              maximumDate={new Date()}
            />
          </View>
        </View>
        {console.log({productData})}
        {Object.entries(productData).map(([key, value]) => {
          return (
            <View key={key}>
              <Text style={{fontSize: 20, lineHeight: 40}}>{key}</Text>
              <DataTable style={{backgroundColor: '#fff'}}>
                <DataTable.Header style={{alignItems: 'center'}}>
                  <DataTable.Title>
                    <Text style={styles.headerRow}>Name</Text>
                  </DataTable.Title>
                  <DataTable.Title>
                    <Text style={styles.headerRow}>Date</Text>
                  </DataTable.Title>
                  <DataTable.Title style={styles.rowSection}>
                    <Text style={styles.headerRow} numeric>
                      Quantity
                    </Text>
                  </DataTable.Title>
                </DataTable.Header>

                <FlatList
                  data={value}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                />
                {/* <Text>{JSON.stringify(value)}</Text> */}
              </DataTable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  headerRow: {
    fontSize: 20,
  },
  rowSection: {
    justifyContent: 'center',
  },
  row: {
    fontSize: 15,
  },
});
