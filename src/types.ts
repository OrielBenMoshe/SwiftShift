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
    activeDays: {
        sunday: boolean;
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
    };
    nonAvailabilities: NonAvailability[]; // רשימת תקופות שבהן החייל אינו זמין
}

export interface Shift {
    startTime: string; // בפורמט HH:MM
    endTime: string;   // בפורמט HH:MM
    days: Day[];
}

export interface PositionRequirement {
    role: Role;
    count: number;
    maxCount?: number;
}

export interface Position {
    uuid: string;
    positionName: string;
    priority: Priority;
    shifts: Shift[];
    requirements: PositionRequirement[]; // רשימת דרישות/תנאים לעמדה
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
export interface DayShifts {
    date: string; // The date in YYYY-MM-DD format
    dayOfWeek: Day; // The day of the week (e.g., 'monday', 'tuesday', etc.)
    shiftStartTimes: Record<string, ShiftDetail[]>; // Object with start times as keys and arrays of shift details as values
}

export interface ShiftDetail {
    uuid: string;
    positionName: string;
    endTime: string;
}

export interface PositionOnPriorities {
    uuid: string;
    positionName: string;
    requirements: PositionRequirement[]; // The type of requirements as provided by you
}