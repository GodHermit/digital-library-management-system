import { ControlledSelect } from '@/components/ControlledSelect';
import { useGetGenresQuery } from '@/hooks/useGetGenresQuery';
import { genreService } from '@/services/genreService';
import { useUserStore } from '@/stores/user';
import { EGenreStatus, IBookCreate } from '@/types/book';
import { EUserRole } from '@/types/user';
import { addErrorToast } from '@/utils/errorToast';
import { Button, SelectItem } from '@heroui/react';
import { CheckIcon, PencilIcon, PlusIcon, TrashIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';

export function GenresSelect() {
  const {
    data: genres,
    isLoading: isGenresLoading,
    mutate: mutateGenres,
  } = useGetGenresQuery();
  const [isGenreSubmitting, setIsGenreSubmitting] = useState(false);
  const form = useFormContext<IBookCreate>();
  const user = useUserStore(useShallow(s => s.user));

  if (!form) {
    throw new Error('GenresSelect must be used within a FormProvider');
  }

  const handleAddGenre = async () => {
    try {
      setIsGenreSubmitting(true);
      const genreName = prompt('Введіть назву жанру');

      if (!genreName) {
        return;
      }

      const genre = await genreService.createGenre(genreName);
      form.setValue('genreIds', [
        ...(form.getValues('genreIds') || []),
        genre.id,
      ]);

      await mutateGenres();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsGenreSubmitting(false);
    }
  };

  const handleEditGenre = async (id: string) => {
    try {
      setIsGenreSubmitting(true);
      const genreName = prompt('Введіть нову назву жанру');

      if (!genreName) {
        return;
      }

      await genreService.updateGenre(id, { name: genreName });
      await mutateGenres();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsGenreSubmitting(false);
    }
  };

  const handleApproveGenre = async (id: string) => {
    try {
      setIsGenreSubmitting(true);
      await genreService.updateGenre(id, {
        status: EGenreStatus.APPROVED,
      });
      await mutateGenres();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsGenreSubmitting(false);
    }
  };

  const handleDeleteGenre = async (id: string) => {
    try {
      setIsGenreSubmitting(true);
      await genreService.deleteGenre(id);
      form.setValue(
        'genreIds',
        (form.getValues('genreIds') || []).filter(
          (genreId: string) => genreId !== id
        )
      );
      await mutateGenres();
    } catch (error) {
      addErrorToast(error);
    } finally {
      setIsGenreSubmitting(false);
    }
  };

  return (
    <ControlledSelect
      name="genreIds"
      control={form.control}
      label="Жанри"
      selectionMode="multiple"
      isLoading={isGenresLoading || isGenreSubmitting}
      isDisabled={isGenresLoading || isGenreSubmitting}
      isVirtualized={(genres?.length ?? 0) > 10}
      items={genres ?? []}
      itemHeight={48}
      rules={{
        required: "Це поле є обов'язковим",
      }}
      endContent={
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={handleAddGenre}
          isLoading={isGenreSubmitting}
        >
          <PlusIcon width={16} height={16} />
        </Button>
      }
    >
      {genre => (
        <SelectItem key={genre.id} textValue={genre.name}>
          <div className="flex w-full grow items-center gap-2">
            <span className="text-small">{genre.name}</span>
            {user?.role === EUserRole.ADMIN && (
              <div className="ml-auto flex items-center gap-2">
                {genre.status === EGenreStatus.PENDING && (
                  <>
                    <Button
                      size="sm"
                      isIconOnly
                      color="success"
                      variant="flat"
                      onPress={() => handleApproveGenre(genre.id)}
                    >
                      <CheckIcon width={16} height={16} />
                    </Button>
                    <Button
                      size="sm"
                      isIconOnly
                      variant="flat"
                      color="danger"
                      onPress={() => handleDeleteGenre(genre.id)}
                    >
                      <XIcon width={16} height={16} />
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  onPress={() => handleEditGenre(genre.id)}
                >
                  <PencilIcon width={16} height={16} />
                </Button>
                <Button
                  size="sm"
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onPress={() => handleDeleteGenre(genre.id)}
                >
                  <TrashIcon width={16} height={16} />
                </Button>
              </div>
            )}
          </div>
        </SelectItem>
      )}
    </ControlledSelect>
  );
}
