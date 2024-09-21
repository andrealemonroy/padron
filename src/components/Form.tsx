import React, { ReactNode } from 'react';
import { FormProvider, useForm, SubmitHandler, FieldValues, UseFormReturn, DefaultValues } from 'react-hook-form';

interface FormProps<T> {
  defaultValues?: T;
  onSubmit: SubmitHandler<FieldValues>;
  children: React.ReactNode;
}

const Form = <T extends { children: ReactNode | ReactNode[]; } & UseFormReturn<FieldValues, any, undefined>,>({ defaultValues, onSubmit, children }: FormProps<T>) => {
  const methods = useForm<T>({ defaultValues: defaultValues as DefaultValues<T> });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default Form;