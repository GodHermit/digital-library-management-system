import { TARGET_CHAIN } from '@/configs/wagmi';
import { Button } from '@heroui/react';

export function FAQPage() {
  return (
    <>
      <h1>ЧаПи (FAQ)</h1>
      <h2>Оплата та доставка</h2>
      <p>
        Оплата проводиться через крипто-мережу {TARGET_CHAIN.name} за допомогою
        токенів {TARGET_CHAIN.nativeCurrency.symbol}.
      </p>
      <p>
        Доставка не можлива, оскільки ми надаємо доступ до цифрової копії книги.
        Після оплати ви отримаєте миттєвий доступ до придбаних електронних
        матеріалів у вашій квитанції.
      </p>
      <h2>Як я можу зв’язатися з вами, якщо у мене виникли запитання?</h2>
      <p>
        Якщо у вас є запитання, ви можете скористатися формою зворотного
        зв’язку, щоб зв’язатися з нами. Ми відповімо на ваше запитання якомога
        швидше.
      </p>
      <Button
        as={'a'}
        href="https://tally.so/r/3jEMvQ"
        target="_blank"
        className="no-underline"
        color="primary"
      >
        Залишити запитання
      </Button>
    </>
  );
}
