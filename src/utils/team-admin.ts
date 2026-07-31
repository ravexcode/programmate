//Types imports
import type Team from "@/types/team.types";
import { IntegrantData } from "@/types/team.types";

/**
 * Verifies if a user is an admin in a given team
 * @param team - The team object
 * @param userId - The user's ID to verify
 * @returns true if user is admin, false otherwise
 */
export function isUserAdmin(team: Team | null, userId: string | undefined): boolean {
  if(!team || !userId) return false;
  
  const userIntegrant = team.integrants?.find((int: IntegrantData) => int.id === userId);
  return userIntegrant?.type === "admin";
}

/**
 * Gets a member from the team by ID
 * @param team - The team object
 * @param memberId - The member's ID
 * @returns The member object or undefined
 */
export function getMemberById(team: Team | null, memberId: string): unknown {
  if(!team || !memberId) return undefined;
  
  return team.integrants?.find((int: IntegrantData) => int.id === memberId);
}
