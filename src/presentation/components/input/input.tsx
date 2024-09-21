import { ReactNode } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Platform,
} from "react-native";
import clsx from "clsx";
import { colors } from "@/presentation/styles";
import {
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";

type Variants = "primary" | "secondary" | "tertiary";

interface TextInputProps extends RNTextInputProps, UseControllerProps {
  label?: string;
  name: string;
  defaultValue?: string;
  variant?: Variants;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = ({
  children,
  variant = "primary",
  className,
  name,
  leftIcon,
  rightIcon,
  ...rest
}: TextInputProps) => {
  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined";
    console.error(msg);
    return null;
  }

  return (
    <View
      className={clsx(
        "min-h-16 max-h-16 flex-row items-center gap-2",
        {
          "h-14 px-4 rounded-lg border border-zinc-800": variant !== "primary",
          "bg-zinc-950": variant === "secondary",
          "bg-zinc-900": variant === "tertiary",
        },
        className
      )}
      {...rest}
    >
      {leftIcon}
      <Field name={name} {...rest} />
      {rightIcon}
    </View>
  );
};

const Field = (props: TextInputProps) => {
  // const { formState } = useFormContext();

  const { name, label, rules, defaultValue, ...inputProps } = props;

  const { field } = useController({ name, rules, defaultValue });

  // const hasError = Boolean(formState?.errors[name]);

  // const textError = formState?.errors[name]?.message as string;

  return (
    <>
      <RNTextInput
        className="flex-1 text-zinc-100 text-lg font-regular"
        placeholderTextColor={colors.zinc[400]}
        cursorColor={colors.zinc[100]}
        selectionColor={Platform.OS === "ios" ? colors.zinc[100] : undefined}
        onChangeText={field.onChange}
        autoCapitalize="none"
        onBlur={field.onBlur}
        value={field.value}
        {...inputProps}
      />
    </>
  );
};
