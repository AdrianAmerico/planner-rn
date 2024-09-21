import {
  Calendar as RNCalendar,
  CalendarProps as RNCalendarProps,
  LocaleConfig,
  DateData,
} from "react-native-calendars";
import { colors } from "@/presentation/styles/colors";
import { fontFamily } from "@/presentation/styles";
import { calendarUtils, ptBR } from "@/utils";
import { useController, useFormContext } from "react-hook-form";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

interface CalendarProps extends RNCalendarProps {
  name: string;
}

export function Calendar({ name, ...rest }: CalendarProps) {
  const formContext = useFormContext();
  const { field } = useController({ name });

  const selectedDatesWatch = formContext.watch(name);

  function handleSelectDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDatesWatch.startsAt,
      endsAt: selectedDatesWatch.endsAt,
      selectedDay,
    });

    field.onChange(dates);
  }

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
        selectedDayBackgroundColor: colors.lime[300],
        selectedDayTextColor: colors.zinc[900],
        textDayFontFamily: fontFamily.regular,
        monthTextColor: colors.zinc[200],
        arrowColor: colors.zinc[400],
        agendaDayNumColor: colors.zinc[200],
        todayTextColor: colors.lime[300],
        textDisabledColor: colors.zinc[500],
        calendarBackground: "transparent",
        textDayStyle: { color: colors.zinc[200] },
      }}
      onDayPress={handleSelectDate}
      markedDates={field.value.dates}
      // {...rest}
      {...field}
    />
  );
}
