// index.js
const Database = require('./Database');

async function main() {
  const db = new Database('postgres'); // veya 'mongo'
  await db.connect();

  try {
    const newUser = await db.create('users', { name: 'John Doe', age: 30 });
    console.log('Kullanıcı Oluşturuldu:', newUser);

    const users = await db.read('users', { age: 30 });
    console.log('Kullanıcılar Bulundu:', users);

    const updatedUser = await db.update('users', { name: 'John Doe' }, { age: 31 });
    console.log('Kullanıcı Güncellendi:', updatedUser);

    const deletedUser = await db.delete('users', { name: 'John Doe' });
    console.log('Kullanıcı Silindi:', deletedUser);
  } catch (error) {
    console.error('Bir hata oluştu:', error);
  } finally {
    await db.disconnect();
  }
}

main();
