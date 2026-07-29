import 'dotenv/config';
import app from './app';

console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
console.log('DB host:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Sistema Proveedores API corriendo en puerto ' + PORT);
  console.log('ENV: ' + (process.env.NODE_ENV || 'development'));
  
});
