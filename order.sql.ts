import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Orders } from './model';
import moment from 'moment';

const ordersTable = 'orders';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'product.db', location: 'default' });
};

export const createOrderTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${ordersTable}(id INTEGER PRIMARY KEY AUTOINCREMENT, productId int, price int, quantity int, created_at TEXT);`;

  await db.executeSql(query);
};

export const getOrders = async (db: SQLiteDatabase, search?: string): Promise<Orders[]> => {
  try {
    const orders: Orders[] = [];
    let query = `SELECT * FROM ${ordersTable};`
    const results = await db.executeSql(query);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        orders.push(result.rows.item(index))
      }
    });
    return orders;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Products !!!');
  }

};


export const storeOrder  = async (db: SQLiteDatabase, order: any) => {
  let currentDate = moment().format('YYYY/MM/DD')
  const insertQuery =
    `INSERT OR REPLACE INTO ${ordersTable}(productId, price, quantity, created_at) values ('${order.productId}', '${ order.price}', '${order.quantity}', '${currentDate}')`;
    console.log("insertQuery", insertQuery);
    
  return db.executeSql(insertQuery);
};


