import { BookGalleryItem } from "@/components/BookGalleryItem";
// import { useUserStore } from '@/stores/user';
// import { useShallow } from 'zustand/shallow';

export function HomePage() {
  // const user = useUserStore(useShallow((s) => s.user));

  return (
    <>
      <h1>Головна</h1>
      <h2>Нещодавно додані</h2>
      <section className="flex flex-wrap justify-between gap-x-4 gap-y-12">
        {Array.from({ length: 20 }).map((_, index) => (
          <BookGalleryItem key={index} />
        ))}
      </section>
    </>
  );
}
