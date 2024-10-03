import { Text, View } from "react-native"
import { CircleDashed, CircleCheck } from "lucide-react-native"

import { colors } from "@/styles/colors"
import clsx from "clsx"

export type ActivityProps = {
  id: string
  title: string
  hour: string
  isBefore: boolean
}

type Props = {
  data: ActivityProps
}

export function Activity({ data }: Props) {
  return (
    <View
      className={clsx(
        "w-full bg-red-500 px-4 py-3 rounded-lg flex-row items-center gap-3",
        { "opacity-50": data.isBefore }
      )}
    >
      {data.isBefore ? (
        <CircleCheck color={colors.purple[900]} size={20} />
      ) : (
        <CircleDashed color={colors.white} size={20} />
      )}

      <Text className="text-white font-regular text-base flex-1">
        {data.title}
      </Text>

      <Text className="text-white font-regular text-sm">{data.hour}</Text>
    </View>
  )
}
