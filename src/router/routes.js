import Login from '../views/login';
import Register from '../views/register';
import Admin from '../views/admin';
import AddSource from '../views/add-source';
import AddBook from '../views/add-book';

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
    name: 'admin',
    path: '/admin',
    component: Admin,
  },
  {
    name: 'add-source',
    path: '/admin/add-source',
    component: AddSource,
  },
  {
    name: 'add-book',
    path: '/admin/add-book',
    component: AddBook,
  },
];
