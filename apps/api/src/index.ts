import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Sistema Proveedores API corriendo en puerto ' + PORT);
  console.log('ENV: ' + (process.env.NODE_ENV || 'development'));
});
