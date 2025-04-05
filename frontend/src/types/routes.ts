export enum ROUTES {
  HOME = '/',
  ARTICLE = '/:articleId',
  SETTINGS = '/settings',
  FAQ = '/faq',
  CREDITS = '/credits',
  DONATE = '/donate',

  BOOKS = '/books',
  ADD_BOOK = '/books/new',
  BOOK = '/:bookId',

  USERS = '/users',
  USER = '/@me',
  USER_PUBLISHED_BOOKS = '/@me/published-books',

  DEVELOPMENT_HELPER = '/development-helper',
}
