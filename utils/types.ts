import { Admins, Player } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      data?: Admins | Player;
    }
  }
}
