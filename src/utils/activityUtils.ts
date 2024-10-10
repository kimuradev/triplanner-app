import dayjs from "dayjs";
import { ActivityDataProps } from "@/app/(trip)/trip-details/constants";
import { TIME_ZONE } from "./constants";

export const getTotalActivityCompleted = (activities: ActivityDataProps[]) => {
    return activities.reduce((acc, activity) => {
        return acc + (dayjs(activity.occursAt).tz().isBefore(dayjs().clone().tz(TIME_ZONE, true)) ? 1 : 0);
    }, 0);
}