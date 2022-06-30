/*const _admincontroller = require('../controllers/AdminController');
 
jest.setTimeout(20000);
test('Prueba de login',async()=>{

  var req={body:{ email: 'samuel.arevalo@espoch.edu.e', password: 'Xtremo99' }};
  var res;
  const data = await _admincontroller.login_admin(req,res);
  return expect(data).resolves.toEqual(res.status(200).send({message: 'El correo electrónico no existe', data: undefined}));

});

jest.setTimeout(20000);
test('Listar etiquetas',async()=>{
  var req={user:{ email: 'samuel.arevalo@espoch.edu.e', password: 'Xtremo99' }};
  var res;
  const data = await _admincontroller.listar_etiquetas_admin(req,res);
  return expect(data).resolves.tobe(res.status(500).send({message: 'NoAccess'}));

});*/

const { parse } = require('handlebars');
const mongoose = require('mongoose');
const supertest = require('supertest');
const {app,sv} = require('../app');
const api = supertest(app);
let token = '';
let id='';
beforeAll(async () => {
  const response = await api
  .post('/api/login_admin')
  .send({email:'samuel.arevalo@espoch.edu.ec',password:'Xtremo99'})
  expect(response.status).toEqual(200);
  expect(response.body.data).not.toEqual(undefined);
  expect(response.body.token).not.toEqual(undefined);
  token = response.body.token;

});

test('Login aceptado', async ()=>{
  const response = await api
  .post('/api/login_admin')
  .send({email:'samuel.arevalo@espoch.edu.ec',password:'Xtremo99'})
  expect(response.status).toEqual(200);
  expect(response.body.data).not.toEqual(undefined);
  expect(response.body.token).not.toEqual(undefined);
})
test('Login rechazado sin email', async ()=>{
  const response = await api
  .post('/api/login_admin')
  .send({email:'samuel.arevalo@espoch.edu.',password:'Xtremo'})
  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual('El correo electrónico no existe');
  expect(response.body.data).toEqual(undefined);
})
test('Login rechazado sin pss', async ()=>{
  const response = await api
  .post('/api/login_admin')
  .send({email:'samuel.arevalo@espoch.edu.ec',password:'Xtremo'})
  expect(response.status).toEqual(200);
  expect(response.body.message).toEqual('Las credenciales no coinciden');
  expect(response.body.data).toEqual(undefined);
})


test('Listar etiquedas', async()=>{
  const response2 = await api 
  .get('/api/listar_etiquetas_admin')
  .set('Authorization', `${token}`)

  console.log(response2.body.message);
  expect(response2.status).toEqual(200);
  
  expect(response2.body.data).not.toEqual(undefined);
})
test('Listar etiquedas sin token', async()=>{
  const response2 = await api 
  .get('/api/listar_etiquetas_admin')
  .set('Authorization', `No${token}` )

  console.log(response2.body.message);
  expect(response2.status).toEqual(403);
  
  expect(response2.body.message).toEqual('InvalidToken');
})
describe('Prueba de integración agregar eliminar etiqueta', ()=>{

  test('agregar etiqueta admin', async()=>{
    const response2 = await api 
    .post('/api/agregar_etiqueta_admin')
    .set('Authorization', `${token}`)
    .send({titulo:'Prueba test',slug:'Prueba test'})
    expect(response2.status).toEqual(200);
    expect(response2.body.data).not.toEqual(undefined);
    id=response2.body.data._id;
  })
  test('agregar etiqueta admin repetido', async()=>{
    const response2 = await api 
    .post('/api/agregar_etiqueta_admin')
    .set('Authorization', `${token}`)
    .send({titulo:'Prueba test',slug:'Prueba test'})
    expect(response2.status).toEqual(200);
    expect(response2.body.message).toEqual('Etiqueta ya existente');
    expect(response2.body.data).toEqual(undefined);
  })
  test('eliminar etiqueta admin', async()=>{
    const response3 = await api 
    .delete('/api/eliminar_etiqueta_admin/'+id)
    .set('Authorization', `${token}`)
  
    expect(response3.status).toEqual(200);
    expect(response3.body.data).not.toEqual(undefined);
  })
  
  
})

describe('Prueba de integración agregar obtener y eliminar producto ', ()=>{

  test('agregar etiqueta admin', async()=>{
    const response2 = await api 
    .post('/api/agregar_etiqueta_admin')
    .set('Authorization', `${token}`)
    .send({titulo:'Prueba test',slug:'Prueba test'})
    expect(response2.status).toEqual(200);
    expect(response2.body.data).not.toEqual(undefined);
    id=response2.body.data._id;
  })
  test('agregar etiqueta admin repetido', async()=>{
    const response2 = await api 
    .post('/api/agregar_etiqueta_admin')
    .set('Authorization', `${token}`)
    .send({titulo:'Prueba test',slug:'Prueba test'})
    expect(response2.status).toEqual(200);
    expect(response2.body.message).toEqual('Etiqueta ya existente');
    expect(response2.body.data).toEqual(undefined);
  })
  test('eliminar etiqueta admin', async()=>{
    const response3 = await api 
    .delete('/api/eliminar_etiqueta_admin/'+id)
    .set('Authorization', `${token}`)
  
    expect(response3.status).toEqual(200);
    expect(response3.body.data).not.toEqual(undefined);
  })
  
  
})



test('Obtener Configuracion', async()=>{
  const response2 = await api 
  .get('/api/obtener_config_admin')
  //.set('Authorization', `${token}`)

  expect(response2.status).toEqual(200);
  
  expect(response2.body.data).not.toEqual(undefined);
})




test('Listar Productos', async()=>{
  const response2 = await api 
  .get('/api/listar_productos_admin')
  .set('Authorization', `${token}`)
  
  console.log(response2.body.message);
  expect(response2.status).toEqual(200);
  
  expect(response2.body.data).not.toEqual(undefined);
})
test('Listar Productos sin token', async()=>{
  const response2 = await api 
  .get('/api/listar_productos_admin')
  .set('Authorization', `No${token}` )

  console.log(response2.body.message);
  expect(response2.status).toEqual(403);
  
  expect(response2.body.message).toEqual('InvalidToken');
})

test('listar etiquetas producto admin', async()=>{
  const response2 = await api 
  .get('/api/listar_etiquetas_producto_admin/61c003a61883d30198c8b066')
  .set('Authorization', `${token}`)
  
  console.log(response2.body.message);
  expect(response2.status).toEqual(200);
  
  expect(response2.body.data).not.toEqual(undefined);
})
test('listar etiquetas producto admin sin token', async()=>{
  const response2 = await api 
  .get('/api/listar_etiquetas_producto_admin/61c003a61883d30198c8b066')
  .set('Authorization', `No${token}` )

  console.log(response2.body.message);
  expect(response2.status).toEqual(403);
  
  expect(response2.body.message).toEqual('InvalidToken');
})

test('listar variedades admin', async()=>{
  const response2 = await api 
  .get('/api/listar_variedades_admin/625b08288b79d122142d5310')
  .set('Authorization', `${token}`)
  
  console.log(response2.body.message);
  expect(response2.status).toEqual(200);
  
  expect(response2.body.data).not.toEqual(undefined);
})
test('listar variedades admin sin token', async()=>{
  const response2 = await api 
  .get('/api/listar_variedades_admin/625b08288b79d122142d5310')
  .set('Authorization', `No${token}` )

  console.log(response2.body.message);
  expect(response2.status).toEqual(403);
  
  expect(response2.body.message).toEqual('InvalidToken');
})

test('listar inventario producto admin', async()=>{
  const response2 = await api 
  .get('/api/listar_inventario_producto_admin/61f062efb2f120193c7e0992')
  .set('Authorization', `${token}`)
  
  console.log(response2.body.message);
  expect(response2.status).toEqual(200);
  
  expect(response2.body.data).not.toEqual(undefined);
})
test('listar inventario producto admin sin token', async()=>{
  const response2 = await api 
  .get('/api/listar_inventario_producto_admin/61f06268b2f120193c7e096e')
  .set('Authorization', `No${token}` )

  console.log(response2.body.message);
  expect(response2.status).toEqual(403);
  
  expect(response2.body.message).toEqual('InvalidToken');
})

test('Listar variedad Producto', async()=>{
  const response2 = await api 
  .get('/api/listar_variedades_productos_admin')
  .set('Authorization', `${token}`)

  console.log(response2.body.message);
  expect(response2.status).toEqual(200);
  
  expect(response2.body.data).not.toEqual(undefined);
})
test('Listar variedad Productos sin token', async()=>{
  const response2 = await api 
  .get('/api/listar_variedades_productos_admin')
  .set('Authorization', `No${token}` )

  console.log(response2.body.message);
  expect(response2.status).toEqual(403);
  
  expect(response2.body.message).toEqual('InvalidToken');
})



afterAll(()=>{
  mongoose.connection.close()
  
})