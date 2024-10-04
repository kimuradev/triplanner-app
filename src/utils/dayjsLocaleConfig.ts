import "dayjs/locale/pt-br"
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import dayjs from "dayjs"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Sao_Paulo');

dayjs.locale("pt-br")
