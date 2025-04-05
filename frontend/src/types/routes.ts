export enum ROUTES {
  HOME = '/',
  SETTINGS = '/settings',
  FAQ = '/faq',
  CREDITS = '/credits',
  DONATE = '/donate',

  BOOKS = '/books',
  ADD_BOOK = '/books/new',
  BOOK = '/:id',

  USERS = '/users',
  USER = '/@me',
  USER_PUBLISHED_BOOKS = '/@me/published-books',

  ORDERS = '/orders',
  ORDER = '/orders/:id',

  SHOPPING_CART = '/shopping-cart',
  CHECKOUT = '/checkout',
  CHECKOUT_ORDER = '/checkout/:id',

  DEVELOPMENT_HELPER = '/development-helper',
}
