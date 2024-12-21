import { RadioCard } from '@/components/RadioCard';
import RowSteps from '@/components/RowSteps';
import {
  Button,
  Form,
  Input,
  RadioGroup,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import { usePrivy } from '@privy-io/react-auth';
import { AnimatePresence, motion } from 'framer-motion';
import { Link2OffIcon, UserIcon, Wallet2Icon } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

export function OnboardingPage() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [currentStep, setCurrentStep] = useState(0);
  const { user, connectWallet } = usePrivy();
  const privyEmail = user?.email?.address || user?.google?.email;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        break;
      case 1:
        setCurrentStep(2);
        break;
      case 2:
        // Submit form
        break;
      default:
        break;
    }
  };

  return (
    <Form
      validationBehavior="native"
      onSubmit={handleSubmit}
      className="flex flex-col max-w-2xl mx-auto py-12"
    >
      <div className="mx-auto mb-4">
        <RowSteps
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          isReadOnly
          steps={[
            {
              title: 'Початок',
            },
            {
              title: 'Особисті Дані',
            },
            {
              title: 'Підключення Гаманця',
            },
          ]}
        />
      </div>
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key={0}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-12">
              <h1 className="flex items-center gap-2 mb-2 text-2xl font-bold">
                <UserIcon />
                Початкові налаштування
              </h1>
              <p className="text-default-500">
                Давайте почнемо з налаштування вашого облікового запису!
              </p>
            </div>

            <h2 className="text-xl mb-4">Яка роль вам більше підходить?</h2>
            <RadioGroup classNames={{ base: 'flex' }} isRequired>
              <RadioCard
                value="user"
                description="Найкращий вибір для тих, хто хоче просто використовувати платформу"
              >
                Користувач
              </RadioCard>
              <RadioCard
                value="author"
                description="Підходить для тих, хто хоче публікувати власний контент"
              >
                Автор
              </RadioCard>
              <RadioCard
                value="publisher"
                description="Підійде для організацій, які публікують книги від імені авторів"
              >
                Видавництво
              </RadioCard>
            </RadioGroup>
          </motion.div>
        )}
        {currentStep === 1 && (
          <motion.div
            key={1}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-12">
              <h1 className="flex items-center gap-2 mb-2 text-2xl font-bold">
                <UserIcon />
                Особисті Дані
              </h1>
              <p className="text-default-500">
                Продовжимо з налаштування вашого облікового запису
              </p>
            </div>

            <Input
              label="Повне ім'я"
              labelPlacement="outside"
              type="text"
              name="fullName"
              variant="bordered"
              placeholder=" "
              isRequired
              description="Як ми можемо звертатися до Вас?"
              autoComplete="name"
              className="mb-12"
            />
            <Input
              label="Електронна адреса"
              labelPlacement="outside"
              type="email"
              name="email"
              variant="bordered"
              placeholder=" "
              isRequired={!privyEmail}
              isDisabled={!!privyEmail}
              readOnly={!!privyEmail}
              defaultValue={privyEmail}
              description="Ваша електронна адреса для зв'язку"
              autoComplete="email"
              className="mb-4"
            />
            <Textarea
              label="Опис"
              labelPlacement="outside"
              type="text"
              name="fullName"
              variant="bordered"
              minRows={5}
              placeholder={`- Автор всесвіту "Крила часу"\n- Люблю подорожувати\n- Захоплююсь автоматизацією письма`}
              description="Розкажіть трохи про себе, щоб інші користувачі знали Вас краще"
              className="mb-12"
            />
          </motion.div>
        )}
        {currentStep === 2 && (
          <motion.div
            key={2}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-12">
              <h1 className="flex items-center gap-2 mb-2 text-2xl font-bold">
                <Wallet2Icon />
                Підключення Гаманця
              </h1>
              <p className="text-default-500">
                Давайте підключимо ваш гаманець для зручності використання
                платформи
              </p>
            </div>

            <div className="flex">
              {!address && (
                <Button
                  size="lg"
                  color="primary"
                  className="mx-auto"
                  startContent={<Wallet2Icon />}
                  onClick={connectWallet}
                >
                  Підключити Гаманець
                </Button>
              )}
              {address && (
                <div className="flex items-center gap-2">
                  <span className="text-default-500">Підключено гаманець:</span>
                  <span className="text-default-700">{address}</span>
                  <Tooltip
                    color="danger"
                    placement="bottom"
                    content="Відключити гаманець"
                  >
                    <Button
                      variant="light"
                      color="danger"
                      size="sm"
                      className="py-0 px-0 h-auto"
                      isIconOnly
                      startContent={<Link2OffIcon width={16} height={16} />}
                      onPress={() => disconnect()}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-3 justify-end ml-auto mt-auto pt-4">
        <span className="text-default-500">Крок {currentStep + 1} з 3</span>
        <Button
          type="submit"
          variant={currentStep === 2 && !address ? 'flat' : 'solid'}
          color="primary"
        >
          {currentStep !== 2 && 'Далі'}
          {currentStep === 2 && !!address && 'Завершити'}
          {currentStep === 2 && !address && 'Завершити (пропустити)'}
        </Button>
      </div>
    </Form>
  );
}
