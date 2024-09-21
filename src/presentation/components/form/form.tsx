import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import { FormProvider, useForm } from "react-hook-form";

interface FormProps extends ViewProps {
  children: ReactNode;
  formData: ReturnType<typeof useForm>;
}

export const Form = ({ children, formData, ...props }: FormProps) => {
  return (
    <FormProvider {...formData}>
      <View {...props}>{children}</View>
    </FormProvider>
  );
};
