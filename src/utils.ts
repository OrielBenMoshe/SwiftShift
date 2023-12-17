import { type } from "os";
import { Day, Position, Soldier, DaySchedule, PositionWithShifts, ShiftWithSoldiers, SoldierOnShift, Shift, DayShifts, ShiftDetail, PositionOnPriorities, PositionRequirement } from "./types.js";

/**
 * Function to create a schedule of shifts by days.
 * @param startDate The starting date of the schedule.
 * @param numOfDays The number of days to create the schedule for.
 * @param positions Array of positions with their respective shifts.
 * @returns 
 */
export const createShiftsByDays = (startDate: Date, numOfDays: number, positions: Position[]): DayShifts[] => {
    // Check to ensure the number of days does not exceed 20
    if (numOfDays > 20) {
        throw new Error('Number of days cannot exceed 20');
    }

    // Array for the days of the week
    const days: Day[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    // The current date, starting from startDate
    let currentDate = new Date(startDate);

    // The array to store each day's shift information
    const dayShifts: DayShifts[] = [];

    // Iterate over the number of days to create the shift schedule
    for (let i = 0; i < numOfDays; i++) {
        // Determine the day of the week and format the date
        const dayOfWeek: Day = days[currentDate.getDay()];
        const dateStr: string = currentDate.toISOString().split('T')[0];

        // Object to store shifts starting at different times for this day
        const shiftStartTimes: Record<string, ShiftDetail[]> = {};
        positions.forEach((position: Position) => {
            position.shifts.forEach((shift: Shift) => {
                // Check if the shift occurs on the current day of the week
                if (shift.days.includes(dayOfWeek)) {
                    // Initialize array for this start time if not already present
                    if (!shiftStartTimes[shift.startTime]) {
                        shiftStartTimes[shift.startTime] = [];
                    }
                    // Add the shift detail to the array for this start time
                    shiftStartTimes[shift.startTime].push({
                        uuid: position.uuid, // Unique identifier for the position
                        positionName: position.positionName, // Name of the position
                        endTime: shift.endTime // End time of the shift
                    });
                }
            });
        });

        // Add the day's shift information to the array
        dayShifts.push({ date: dateStr, dayOfWeek, shiftStartTimes });

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Return the array of day shifts
    return dayShifts;
};

/**
 * Function to create an array of positions sorted by priority with day and shift information
 * @param startDate 
 * @param numOfDays 
 * @param positions 
 * @returns PositionOnPriorities[]
 */
export const createPrioritySortedPositions = (startDate: Date, numOfDays: number, positions: Position[]): PositionOnPriorities[] => {
    type Shift = { startTime: string, endTime: string };

    interface DayInfo {
        date: string;
        dayOfWeek: Day;
        shifts: Shift[];
    }


    // Sorting positions by priority
    const sortedPositions = positions.sort((a, b) => {
        const priorityA = a.priority ?? Number.MAX_SAFE_INTEGER;
        const priorityB = b.priority ?? Number.MAX_SAFE_INTEGER;
        return priorityA - priorityB;
    });

    // Generating an array of dates
    const dates = Array.from({ length: numOfDays }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date;
    });

    // Creating a new array with the required data and day information
    return sortedPositions.map(position => {
        const days: DayInfo[] = dates.map(date => {
            const dayOfWeek: Day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLocaleLowerCase() as Day;
            const shifts: Shift[] = position.shifts
                .filter(shift => shift.days.includes(dayOfWeek))
                .map(shift => ({ startTime: shift.startTime, endTime: shift.endTime }));

            return {
                date: date.toISOString().split('T')[0],
                dayOfWeek,
                shifts
            };
        });

        return {
            uuid: position.uuid,
            positionName: position.positionName,
            requirements: position.requirements,
            days // Adding day information to each position
        };
    });
};