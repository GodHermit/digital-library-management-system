import { GeneralLayout } from '@/layouts/MainLayout';
import { Book } from '@/pages/Book';
import { ROUTES } from '@/types/routes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BooksPage } from './pages/Books';
import { DonatePage } from './pages/Donate';
import { ErrorPage } from './pages/Error';
import { HomePage } from './pages/Home';
import { SettingsPage } from './pages/Settings';
import { UsersPage } from './pages/Users';
import { Providers } from './Providers';
import { DevelopmentHelper } from './pages/DevelopmentHelper';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Providers>
        <GeneralLayout />
      </Providers>
    ),
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.SETTINGS, element: <SettingsPage /> },
      { path: ROUTES.DONATE, element: <DonatePage /> },
      { path: ROUTES.HOME, element: <Book /> },
      { path: ROUTES.ARTICLE, element: <Book /> },
      {
        path: ROUTES.BOOKS,
        element: <BooksPage />,
        children: [{ path: ROUTES.ADD_BOOK, element: <Book /> }],
      },
      { path: ROUTES.BOOK, element: <Book /> },
      { path: ROUTES.USERS, element: <UsersPage /> },
      { path: ROUTES.USER, element: <Book /> },
      { path: ROUTES.USER_PUBLISHED_BOOKS, element: <Book /> },
      { path: ROUTES.DEVELOPMENT_HELPER, element: <DevelopmentHelper /> },
    ],
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider fallbackElement={<ErrorPage />} router={router} />;
}

export default App;
