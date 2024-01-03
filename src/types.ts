export type Role = 'חדש' | 'מפקד' | 'נהג' | 'בחופשה' | 'חולה' | 'שומר' | 'מתנדב' | 'סייר';
export type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
export type Priority = 0 | 1 | 2 | 3 | 4;

export interface NonAvailability {
    startTime: string; // בפורמט HH:MM
    endTime: string;   // בפורמט HH:MM
    days: Day[];
    isPermanent: boolean;
}

export interface Soldier {
    uuid: string;
    name: string;
    phone: string;
    email: string;
    roles: Role[];
    nonAvailabilities: NonAvailability[]; // רשימת תקופות שבהן החייל אינו זמין
}

export interface Shift {
    startTime: string; // בפורמט HH:MM
    endTime: string;   // בפורמט HH:MM
    days: Day[];
}

export interface soldierRoles {
    requireRoles: Role[];
    forbiddenRoles: Role[];
}

export interface Position {
    uuid: string;
    positionName: string;
    priority: Priority;
    shifts: Shift[];
    soldiersRoles: soldierRoles[]; // רשימת דרישות/תנאים לעמדה
}


/** Schedule days */
export interface SoldierOnShift {
    name: string;
    role: Role;
}

export interface ShiftWithSoldiers {
    startTime: string; // בפורמט HH:MM
    endTime: string;   // בפורמט HH:MM
    soldiers: SoldierOnShift[]; // רשימת השומרים ששובצו למשמרת
}

export interface PositionWithShifts {
    positionName: string;
    shifts: ShiftWithSoldiers[]; // רשימת משמרות עם שומרים לעמדה זו
}

export interface DaySchedule {
    date: string; // בפורמט YYYY-MM-DD
    dayOfWeek: Day;
    positions: PositionWithShifts[]; // רשימת עמדות ומשמרות ליום זה
}

/** Types for Shifts list */
export interface DayWithShifts {
    date: string; // The date in YYYY-MM-DD format
    dayOfWeek: Day; // The day of the week (e.g., 'monday', 'tuesday', etc.)
    shiftsByStartTime?: Record<string, ShiftDetail[]>; // Object with start times as keys and arrays of shift details as values
    shifts?: ShiftTime[];
}

export interface ShiftDetail {
    positionUuid: string;
    positionName: string;
    endTime: string;
    candidtates?: Soldier[];
}

// Priorities

export type ShiftTime = { startTime: string, endTime: string };
export interface DayWithShifts {
    date: string;
    dayOfWeek: Day;
    
}

export interface PositionOnPriorities {
    uuid: string;
    positionName: string;
    soldiersRoles: soldierRoles[];
    daysWithShifts: DayWithShifts[];
}

export interface PositionsWithCandidatesByRoles {
    uuid: string;
    positionName: string;
    rolesWithCandidates: RolesWithCandidates[];
}

export type RolesWithCandidates = {
    role: string;
    soldiers: Soldier[];
}
