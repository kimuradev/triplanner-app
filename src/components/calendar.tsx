import {
    Calendar as RNCalendar,
    CalendarProps,
    LocaleConfig,
  } from "react-native-calendars"
  import { ptBR } from "@/utils/localeCalendarConfig"
  
  LocaleConfig.locales["pt-br"] = ptBR
  LocaleConfig.defaultLocale = "pt-br"
  
  import { colors } from "@/styles/colors"
  import { fontFamily } from "@/styles/fontFamily"
  
  export function Calendar({ ...rest }: CalendarProps) {
    return (
      <RNCalendar
        hideExtraDays
        style={{
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
        theme={{
          textMonthFontSize: 18,
          selectedDayBackgroundColor: colors.purple[300],
          selectedDayTextColor: colors.white,
          textDayFontFamily: fontFamily.regular,
          monthTextColor: colors.purple[300],
          arrowColor: colors.zinc[400],
          agendaDayNumColor: colors.zinc[200],
          todayTextColor: colors.purple[900],
          textDisabledColor: colors.zinc[200],
          calendarBackground: "transparent",
          textDayStyle: { color: colors.zinc[400] },
        }}
        {...rest}
      />
    )
  }
  