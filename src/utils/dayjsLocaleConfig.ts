import "dayjs/locale/pt-br"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import dayjs from "dayjs"
import { TIME_ZONE } from "./constants";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault(TIME_ZONE);

dayjs.locale("pt-br")
