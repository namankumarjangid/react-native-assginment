import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Product } from './model';

const productTable = 'products';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'product.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${productTable}(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20));`;

  await db.executeSql(query);
};

export const getProducts = async (db: SQLiteDatabase, search?: string): Promise<Product[]> => {
  try {
    const products: Product[] = [];
    let query: string
    if (search && search.length > 0) {
      query = `SELECT * FROM ${productTable} WHERE name like '%${search}%';`
    } else {
      query = `SELECT * FROM ${productTable};`
    }

    const results = await db.executeSql(query);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        products.push(result.rows.item(index))
      }
    });
    return products;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Products !!!');
  }
};

export const getSingleProduct = async (db: SQLiteDatabase, productId : number): Promise<Product[]> => {
  try {
    let products: Product[] = [];
    let  query = `SELECT * FROM ${productTable} WHERE id = ${productId};`
    

    const results = await db.executeSql(query);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        products.push(result.rows.item(index))
      }
    });
    return products;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Product !!!');
  }
};

export const deleteSingleProduct = async (db: SQLiteDatabase, productId : number): Promise<Product[]> => {
  try {
    let products: Product[] = [];
    let  query = `DELETE FROM ${productTable} WHERE id = ${productId};`
    

    const results = await db.executeSql(query);

    // results.forEach(result => {
    //   for (let index = 0; index < result.rows.length; index++) {
    //     products.push(result.rows.item(index))
    //   }
    // });
    return products;
  } catch (error) {
    console.error(error);
    throw Error('Failed to delete Product !!!');
  }
};

export const saveProduct = async (db: SQLiteDatabase, Product: Product[]) => {

  const insertQuery =
    `INSERT OR REPLACE INTO ${productTable}(id, name) values` +
    Product.map(i => `(${i.id}, '${i.name}')`).join(',');

  console.log('insertQueryinsertQueryinsertQuery', insertQuery);


  return db.executeSql(insertQuery);
};

export const storeProduct = async (db: SQLiteDatabase, productName: string) => {

  const insertQuery =
    `INSERT OR REPLACE INTO ${productTable}(name) values ('${productName}')`;
    console.log(insertQuery);
    
  return db.executeSql(insertQuery);
};


export const removeTable = async (db: SQLiteDatabase) => {
  let [results] = await db.executeSql('SELECT name FROM sqlite_master WHERE type="table" ORDER BY name');
  var len = results.rows.length;
  for (let i = 0; i < len; i++) {
    let tableName = results.rows.item(i).name;
    
    if (tableName !== 'sqlite_sequence' && tableName !== 'android_metadata') {
      console.warn('tableName', tableName);
      // await db.executeSql(`DELETE FROM ${results.rows.item(i).name}`);
      await db.executeSql(`DROP TABLE ${results.rows.item(i).name}`);
    }
  }
}