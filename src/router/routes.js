import Login from '../views/login';
import Register from '../views/register';
import Admin from '../views/admin';
import AddSource from '../views/add-source';
import AddBook from '../views/add-book';
import UpdateBook from '../views/update-book';
import ModifyBook from '../views/modify-book';
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
  {
    name: 'update-book',
    path: '/admin/update-book',
    component: UpdateBook,
  },
  {
    name: 'modify-book',
    path: '/admin/modify-book',
    component: ModifyBook,
  },
  {
    name: 'detail',
    path: '/detail/:no',
    component: Detail,
  },
];
