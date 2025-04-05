import { useUserStore } from '@/stores/user';
import { EUserRole } from '@/types/user';
import { Helmet } from 'react-helmet';
import { useShallow } from 'zustand/shallow';

export function BooksPage() {
  const user = useUserStore(useShallow((s) => s.user));

  return (
    <>
      <Helmet>
        {user?.role === EUserRole.USER && <title>Каталог</title>}
        {user?.role === EUserRole.ADMIN && <title>Інвентар</title>}
      </Helmet>
      {user?.role === EUserRole.USER && <h1>Каталог</h1>}
      {user?.role === EUserRole.ADMIN && <h1>Інвентар</h1>}
    </>
  );
}
