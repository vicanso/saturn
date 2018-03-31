import Login from '../views/login';
import Register from '../views/register';
import Detail from '../views/detail';

export default [
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
  {
    name: 'register',
    path: '/register',
    component: Register,
  },
  {
    name: 'detail',
    path: '/detail/:no',
    component: Detail,
  },
];
