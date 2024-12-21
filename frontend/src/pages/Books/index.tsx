import { useUserStore } from '@/stores/user';
import { UserRole } from '@/types/user';
import { Helmet } from 'react-helmet';
import { useShallow } from 'zustand/shallow';

export function BooksPage() {
  const user = useUserStore(useShallow((s) => s.user));

  return (
    <>
      <Helmet>
        {user?.role === UserRole.USER && <title>Каталог</title>}
        {user?.role === UserRole.ADMIN && <title>Інвентар</title>}
      </Helmet>
      {user?.role === UserRole.USER && <h1>Каталог</h1>}
      {user?.role === UserRole.ADMIN && <h1>Інвентар</h1>}
    </>
  );
}
