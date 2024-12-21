import { GeneralLayout } from '@/layouts/MainLayout';
import { Book } from '@/pages/Book';
import { ROUTES } from '@/types/routes';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './pages/Error';
import { SettingsPage } from './pages/Settings';
import { Providers } from './Providers';
import { DonatePage } from './pages/Donate';
import { UsersPage } from './pages/Users';
import { BooksPage } from './pages/Books';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <Providers>
        <GeneralLayout />
      </Providers>
    ),
    children: [
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
    ],
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider fallbackElement={<ErrorPage />} router={router} />;
}

export default App;
