//Types imports
import type Team from "@/types/team.types";
import { UserData } from "@/types/user.types";

/**
 * Verifies if a user is an admin in a given team
 * @param team - The team object
 * @param userId - The user's ID to verify
 * @returns true if user is admin, false otherwise
 */
export function isUserAdmin(team: Team | null, userId: string | undefined): boolean {
  if(!team || !userId) return false;
  
  const userIntegrant = team.integrants?.find((int: any) => int.id === userId);
  return userIntegrant?.type === "admin";
}

/**
 * Verifies if a member is an admin in a given team
 * @param team - The team object
 * @param memberId - The member's ID to check
 * @returns true if member is admin, false otherwise
 */
export function isMemberAdmin(team: Team | null, memberId: string): boolean {
  if(!team || !memberId) return false;
  
  const member = team.integrants?.find((int: any) => int.id === memberId);
  return member?.type === "admin";
}

/**
 * Gets a member from the team by ID
 * @param team - The team object
 * @param memberId - The member's ID
 * @returns The member object or undefined
 */
export function getMemberById(team: Team | null, memberId: string): any {
  if(!team || !memberId) return undefined;
  
  return team.integrants?.find((int: any) => int.id === memberId);
}

/**
 * Checks if user can perform admin actions in a team
 * @param team - The team object
 * @param userId - The user's ID
 * @returns true if user can perform admin actions
 */
export function canUserManageTeam(team: Team | null, userId: string | undefined): boolean {
  return isUserAdmin(team, userId);
}
