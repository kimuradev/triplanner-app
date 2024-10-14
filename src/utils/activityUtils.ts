import dayjs from "dayjs";
import { TIME_ZONE } from "./constants";
import { ActivityProps } from "@/app/(trip)/trip-details/constants";

export const getTotalActivityCompleted = (activities: ActivityProps[]) => {
    return activities.reduce((acc, activity) => {
        return acc + (dayjs(activity.occursAt).tz().isBefore(dayjs().clone().tz(TIME_ZONE, true)) || activity.isDone ? 1 : 0);
    }, 0);
}