// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_brainy_human_robot.sql';
import m0001 from './0001_past_speed.sql';
import m0002 from './0002_red_black_cat.sql';
import m0003 from './0003_fancy_rogue.sql';
import m0004 from './0004_friendly_paladin.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004
  }
}
