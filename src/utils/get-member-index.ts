import Team from "@/types/team.types";
import { UserBasic, UserData } from "@/types/user.types";

export function getUserIndex(data: {
  user: UserData;
  project: Team;
}){
  const u = data.user;
  const p = data.project;

  const index = p.integrants_id.findIndex(
    int =>
      int === u.id
  );

  if(!index) return null;

  return index;
}

export function getMemberIndex(data: {
  user: UserBasic;
  project: Team;
}) {
  const u = data.user;
  const p = data.project;

  const index = p.integrants_id.findIndex(
    int =>
      int === u.id
  );

  if(!index) return;

  return index;
}