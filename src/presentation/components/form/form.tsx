import { createContext, ReactNode, useContext } from "react";
import { View, ViewProps } from "react-native";
import { useForm } from "react-hook-form";

const FormContext = createContext({} as ReturnType<typeof useForm>);

interface FormProps extends ViewProps {
  children: ReactNode;
}

const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const form = useForm();

  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
  return useContext(FormContext);
};

export const Form = ({ children, ...props }: FormProps) => {
  return (
    <FormProvider>
      <View {...props}>{children}</View>
    </FormProvider>
  );
};
