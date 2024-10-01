import { ReactNode } from "react"
import {
  TextInput,
  TextInputProps,
  View,
  ViewProps,
  Platform,
} from "react-native"
import clsx from "clsx"

import { colors } from "@/styles/colors"

type Variants = "primary" | "secondary" | "tertiary"

type SearchProps = ViewProps & {
  children: ReactNode
  variant?: Variants
}

function Search({
  children,
  variant = "primary",
  className,
  ...rest
}: SearchProps) {
  return (
    <View
      className={clsx(
        "min-h-16 max-h-16 flex-row items-center gap-2 border border-zinc-200 rounded-xl px-4 bg-white",
        {
          "h-16 px-4 rounded-lg border border-zinc-800": variant !== "primary",
          "bg-zinc-950": variant === "secondary",
          "bg-zinc-900": variant === "tertiary",
        },
        className
      )}
      {...rest}
    >
      {children}
    </View>
  )
}

function Field({ editable,  ...rest }: TextInputProps) {
  return (
    <TextInput
      className={`text-lg font-regular text-purple-900`}
      placeholderTextColor={colors.zinc[400]}
      cursorColor={colors.zinc[100]}
      selectionColor={Platform.OS === "ios" ? colors.zinc[100] : undefined}
      keyboardType="visible-password"
      {...rest}
    />
  )
}

Search.Field = Field

export { Search }
