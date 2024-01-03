import { DayWithShifts, PositionOnPriorities, Shift, ShiftDetail, Soldier, RolesWithCandidates, PositionsWithCandidatesByRoles } from './types.js';
import { isTimeBefore } from './utils.js';
import fs, { readFileSync } from 'fs'


export const addCandidatesToShifts = (soldiers: Soldier[], positions: PositionOnPriorities[], daysWithShifts: DayWithShifts[]) => {
    const positionsWithCandidatesByRoles: PositionsWithCandidatesByRoles[] = positions.map(({ uuid, positionName, soldiersRoles }) => {
        // חיילים המתאימים לעמדות לפי תפקידים נדרשים.
        const rolesWithCandidates: RolesWithCandidates[] = soldiersRoles.map(({ requireRoles, forbiddenRoles }) => {
            const soldiersByRole = {
                role: requireRoles.join('-'),
                soldiers: soldiers.filter((soldier) => {
                    let isRequiredRoleFound: boolean = true;
                    requireRoles?.forEach(require => {
                        if (!soldier.roles.find(role => role === require))
                            isRequiredRoleFound = false;
                    })

                    let isForbiddenRoleFound: boolean = false;
                    forbiddenRoles?.forEach(forbidden => {
                        if (soldier.roles.find(role => role === forbidden))
                            isForbiddenRoleFound = true;
                    })

                    return (isRequiredRoleFound && !isForbiddenRoleFound);
                })
            }
            return soldiersByRole;
        });
        return { uuid, positionName, rolesWithCandidates }
    });

    const shiftsByDateAndCandidates = daysWithShifts.map(({ date, dayOfWeek, shiftsByStartTime }) => {
        if (shiftsByStartTime) {
            const populatedShifts = Object.fromEntries(
                Object.entries(shiftsByStartTime).map(([startTime, shifts]) => {
                    // מיפוי כל מערך שתחת המפתח הנוכחי
                    const shiftsWithCandidates = shifts.map(shift => {
                        const shiftPosition = positionsWithCandidatesByRoles.find(({ uuid }) => uuid === shift.positionUuid)
                        const candidates = shiftPosition?.rolesWithCandidates.map(({ role, soldiers }) => ({
                            role,
                            soldiers: soldiers.filter((soldier: Soldier) => {
                                if (soldier.nonAvailabilities.length > 0) {
                                    // Checking the availability of a soldier by day of the week, start time, and end time.
                                    for (const nonAvailability of soldier.nonAvailabilities) {
                                        if (nonAvailability.days.find(day => day === dayOfWeek)) {
                                            if (isTimeBefore(nonAvailability.startTime, startTime)) {
                                                if (isTimeBefore(nonAvailability.endTime, startTime)) {
                                                    return false; // If a conflict is found, return false
                                                }
                                            } else if (isTimeBefore(nonAvailability.startTime, shift.endTime)) {
                                                return false; // If a conflict is found, return false
                                            }
                                        }
                                    }
                                }
                                return true; // If the loop finishes without conflicts, return true
                            }).map(({ uuid, name }) => ({ uuid, name }))
                        }))
                        return { ...shift, candidates };
                    });
                    return [startTime, shiftsWithCandidates];
                })
            );
            return {
                date,
                dayOfWeek,
                shiftStartTimes: populatedShifts
            }
        } else "error";
    })

    return shiftsByDateAndCandidates;
}