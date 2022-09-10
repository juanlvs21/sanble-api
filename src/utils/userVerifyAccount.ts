import randomstring from "randomstring";

import { dayjs } from "./time";

export function userVerifyGenerateToken() {
  return {
    verifiedAt: null,
    expiresIn: dayjs().add(24, "hours").toDate(),
    token: randomstring.generate(40) + dayjs().unix(),
  };
}
