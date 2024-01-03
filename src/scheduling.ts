import { DayWithShifts, PositionOnPriorities, Shift, ShiftDetail, Soldier, RolesWithCandidates, PositionsWithCandidatesByRoles } from './types.js';

export const scheduling = (shiftsByDateWithCandidates: DayWithShifts[], prioritiesAndRequirements: PositionOnPriorities[] , soldiers: Soldier[]) => {
    /**
     * 1) שיבוץ לפי סדר קדימויות של עמדות.
     * 2) יצירת מערך לוחמים זמני
     * 3) שיבוץ לוחם מועמד באופן אקראי, אחרי בדיקות
     */
};