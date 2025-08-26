import { Routes } from '@angular/router';
import { Login } from './shared/login/login';
import { Home } from './shared/home/home';
import { Signup } from './shared/signup/signup';
import { Cart } from './shared/cart/cart';
import { Shop } from './shared/shop/shop';
import { Checkout } from './shared/checkout/checkout';
import { DetailsOfProduct } from './shared/details-of-product/details-of-product'; // <-- add import

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Home
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: 'shop',
    component: Shop
  },
  {
    path: 'checkout',
    component: Checkout
  },
  {
    path: 'product/:id',           // <-- new route for product details
    component: DetailsOfProduct
  },
  {
    path: '**',
    redirectTo: ''                 // fallback to home if route not found
  }
];
