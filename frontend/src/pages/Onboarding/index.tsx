import { RadioCard } from '@/components/RadioCard';
import RowSteps from '@/components/RowSteps';
import { userService } from '@/services/userService';
import { EUserType } from '@/types/user';
import {
  Alert,
  Button,
  Form,
  Input,
  RadioGroup,
  Textarea,
  Tooltip,
} from '@heroui/react';
import { usePrivy } from '@privy-io/react-auth';
import { AnimatePresence, motion } from 'framer-motion';
import { Link2OffIcon, UserIcon, UsersIcon, Wallet2Icon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAccount, useDisconnect } from 'wagmi';
import { IOnboardingForm } from './scheme';

export function OnboardingPage() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [currentStep, setCurrentStep] = useState(0);
  const { user, linkWallet } = usePrivy();
  const privyEmail = user?.email?.address || user?.google?.email;
  const form = useForm<IOnboardingForm>({
    defaultValues: {
      email: privyEmail,
    },
  });

  const userType = form.watch('userType');

  const handleSubmit = async (data: IOnboardingForm) => {
    switch (currentStep) {
      case 0:
        setCurrentStep(1);
        break;
      case 1:
        setCurrentStep(2);
        break;
      case 2:
        await userService.finishOnboarding(data);
        break;
      default:
        break;
    }
  };

  return (
    <Form
      validationBehavior="native"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mx-auto flex max-w-2xl flex-col py-12"
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
              <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                <UserIcon />
                Початкові налаштування
              </h1>
              <p className="text-default-500">
                Давайте почнемо з налаштування вашого облікового запису!
              </p>
            </div>

            <h2 className="mb-4 text-xl">Яка роль вам більше підходить?</h2>
            <Controller
              control={form.control}
              name="userType"
              rules={{
                required: "Цей вибір є обов'язковим",
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <RadioGroup
                  classNames={{ base: 'flex' }}
                  isRequired
                  validationBehavior="aria"
                  errorMessage={error?.message}
                  isInvalid={invalid}
                  {...field}
                >
                  <RadioCard
                    value={EUserType.DEFAULT}
                    description="Найкращий вибір для тих, хто хоче просто використовувати платформу"
                  >
                    Користувач
                  </RadioCard>
                  <RadioCard
                    value={EUserType.AUTHOR}
                    description="Підходить для тих, хто хоче публікувати власний контент"
                  >
                    Автор
                  </RadioCard>
                  <RadioCard
                    value={EUserType.PUBLISHER}
                    description="Підійде для організацій, які публікують книги від імені авторів"
                  >
                    Видавництво
                  </RadioCard>
                </RadioGroup>
              )}
            />
          </motion.div>
        )}
        {currentStep === 1 && (
          <motion.div
            key={1}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div>
              <div className="mb-12">
                <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                  <UserIcon />
                  Особисті Дані
                </h1>
                <p className="text-default-500">
                  Продовжимо з налаштування вашого облікового запису
                </p>
              </div>

              <Controller
                control={form.control}
                name="fullName"
                rules={{
                  required: "Це поле є обов'язковим",
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    label="Повне ім'я"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    placeholder=" "
                    isRequired
                    description="Як ми можемо звертатися до Вас?"
                    autoComplete="name"
                    className="mb-12"
                    validationBehavior="aria"
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    {...field}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="email"
                rules={{
                  required: "Це поле є обов'язковим",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Введіть дійсну електронну адресу',
                  },
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    label="Електронна адреса"
                    labelPlacement="outside"
                    type="email"
                    variant="bordered"
                    placeholder=" "
                    isRequired={!privyEmail}
                    isDisabled={!!privyEmail}
                    readOnly={!!privyEmail}
                    defaultValue={privyEmail}
                    description="Ваша електронна адреса для зв'язку"
                    autoComplete="email"
                    className="mb-4"
                    validationBehavior="aria"
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    {...field}
                  />
                )}
              />

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Textarea
                    label="Опис"
                    labelPlacement="outside"
                    type="text"
                    variant="bordered"
                    minRows={5}
                    placeholder={`- Автор всесвіту "Крила часу"\n- Люблю подорожувати\n- Захоплююсь автоматизацією письма`}
                    description="Розкажіть трохи про себе, щоб інші користувачі знали Вас краще"
                    className="mb-12"
                    validationBehavior="aria"
                    errorMessage={error?.message}
                    isInvalid={invalid}
                    {...field}
                  />
                )}
              />
            </div>
            {userType === EUserType.PUBLISHER && (
              <div>
                <div className="mb-12">
                  <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                    <UsersIcon />
                    Дані організації
                  </h1>
                  <p className="text-default-500">
                    Якщо ви представляєте видавництво, вкажіть дані вашої
                    організації
                  </p>
                </div>

                <Controller
                  control={form.control}
                  name="organization.name"
                  rules={{
                    required: "Це поле є обов'язковим",
                  }}
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      label="Назва організації"
                      labelPlacement="outside"
                      type="text"
                      variant="bordered"
                      placeholder=" "
                      isRequired
                      className="mb-12"
                      validationBehavior="aria"
                      errorMessage={error?.message}
                      isInvalid={invalid}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name="organization.website"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Input
                      label="Посилання на сайт"
                      labelPlacement="outside"
                      type="text"
                      variant="bordered"
                      placeholder=" "
                      className="mb-12"
                      validationBehavior="aria"
                      errorMessage={error?.message}
                      isInvalid={invalid}
                      {...field}
                    />
                  )}
                />
              </div>
            )}
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
              <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold">
                <Wallet2Icon />
                Підключення Гаманця
              </h1>
              <p className="text-default-500">
                Давайте підключимо ваш гаманець для зручності використання
                платформи
              </p>
              <div className="mt-4">
                <input type="hidden" name="address" value={address} required />
                <Alert
                  color="warning"
                  title="Для авторів та видавництв!"
                  description={
                    <>
                      Підключений гаманець буде використано для зарахування
                      платежів за книги
                      <br />
                      Якщо контент належить видавництву, кошти будуть надіслані
                      саме видавництву
                    </>
                  }
                />
              </div>
            </div>

            <div className="flex">
              {!address && (
                <Button
                  size="lg"
                  color="primary"
                  className="mx-auto"
                  startContent={<Wallet2Icon />}
                  onClick={linkWallet}
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
                      className="h-auto p-0"
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
      <div className="ml-auto mt-auto flex items-center justify-end gap-3 pt-4">
        <span className="text-default-500">Крок {currentStep + 1} з 3</span>
        <Button
          type="submit"
          variant={'solid'}
          color="primary"
          isLoading={form.formState.isSubmitting}
        >
          {currentStep !== 2 && 'Далі'}
          {currentStep === 2 && 'Завершити'}
        </Button>
      </div>
    </Form>
  );
}
