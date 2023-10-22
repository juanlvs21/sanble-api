import dayjs from "dayjs";

import { IFair } from "../interfaces/IFair";
import { IInvitation, IInvitationFormatted } from "../interfaces/IInvitation";
import { IStand } from "../interfaces/IStand";
import { fairDataFormat } from "./utilsFair";
import { getOwnerUserData } from "./utilsOwner";
import { standDataFormat } from "./utilsStand";

export const invitationDataFormat = async (
  invitation: IInvitation
): Promise<IInvitationFormatted> => {
  const fairRef = await invitation.fairRef.get();
  const fairData = fairRef.data() as IFair;
  const fairOwner = await getOwnerUserData(fairData.ownerRef);

  const standRef = await invitation.standRef.get();
  const standData = standRef.data() as IStand;
  const standOwner = await getOwnerUserData(standData.ownerRef);

  const invitationReturn: IInvitationFormatted = {
    id: invitation.id,
    type: invitation.type,
    fairID: invitation.fairID,
    standID: invitation.standID,
    sentBy: invitation.sentBy,
    fair: fairDataFormat(fairData),
    stand: standDataFormat(standData),
    fairOwner: {
      id: fairOwner.uid,
      name: fairOwner.displayName,
    },
    standOwner: {
      id: standOwner.uid,
      name: standOwner.displayName,
    },
    creationTime: dayjs(
      (invitation.creationTimestamp?.seconds || 0) * 1000
    ).format(),
  };

  return invitationReturn;
};
