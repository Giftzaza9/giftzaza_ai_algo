const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const profileRoute = require('./profile.route');
const productRoute = require('./product.route');
const apiRoute = require ('./api.route')
const docsRoute = require('./docs.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/profiles',
    route: profileRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/',
    route: apiRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  }
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
