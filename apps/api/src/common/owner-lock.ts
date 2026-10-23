import { UnauthorizedException } from "@nestjs/common";
import type { Prisma } from "../../generated/prisma/client";

// All ordering and bulk creation paths acquire this lock before reading ranks.
export async function lockOwner(tx: Prisma.TransactionClient, userId: string) {
  const user = await tx.user.update({
    where: { id: userId },
    data: { orderRevision: { increment: 1 } },
  });
  if (user.disabledAt) throw new UnauthorizedException();
}

export async function appendPosition(
  tx: Prisma.TransactionClient,
  userId: string,
  status: string,
  parentId: string | null,
  excludeId?: string
) {
  const last = await tx.task.findFirst({
    where: {
      project: { leadId: userId },
      parentId,
      status: status as "TODO",
      ...(excludeId && { id: { not: excludeId } }),
    },
    orderBy: [{ position: "desc" }, { id: "desc" }],
    select: { position: true },
  });
  return (last?.position ?? 0) + 1024;
}
