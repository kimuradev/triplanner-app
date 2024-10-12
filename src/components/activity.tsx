import { Text, View } from "react-native"
import { CircleDashed, CircleCheck, NotebookPen } from "lucide-react-native"

import { colors } from "@/styles/colors"
import clsx from "clsx"

export type ActivityProps = {
  id: string
  title: string
  hour: string
  isBefore: boolean
  obs?: string
}

type Props = {
  data: ActivityProps
}

export function Activity({ data }: Props) {
  return (
    <View
      className={clsx(
        "w-full bg-red-500 px-4 py-3 rounded-lg gap-4",
        { "opacity-50": data.isBefore }
      )}
    >
      <View className="flex-row items-center gap-3">
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

      {data.obs && (
        <View className="flex-row gap-2 items-center pr-2">
          <NotebookPen color={colors.zinc[200]} size={20} />
          <Text numberOfLines={2} ellipsizeMode="tail" className="text-zinc-200" >{data.obs}</Text>
        </View>
      )}
    </View>
  )
}
