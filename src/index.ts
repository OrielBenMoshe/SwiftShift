import fs, { readFileSync } from 'fs'
import { Soldier, Position, Day, DaySchedule, ShiftDetail, DayShifts, PositionOnPriorities } from './types.js';
import { createPrioritySortedPositions, createShiftsByDays } from './utils.js';
// import { scheduleSoldiersForDay } from '../utils';

function readJsonFile<T>(filePath: string): T {
    const rawData = readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
}

try {
    const soldiers: Soldier[] = readJsonFile<Soldier[]>('data/soldiers_data.json');
    const positions: Position[] = readJsonFile<Position[]>('data/positions_data.json');
    const numOfDays: number = 8;

    const today: Date = new Date();
    const date: string = today.toISOString().split('T')[0]; // יוצר מחרוזת עם התאריך בפורמט YYYY-MM-DD

    const shifts: DayShifts[] = createShiftsByDays(today, numOfDays, positions);
    const prioritiesAndRequirements: PositionOnPriorities[] = createPrioritySortedPositions(today, numOfDays, positions);

    // Write the new shifts object to a JSON file
    fs.writeFileSync('data/shifts_data.json', JSON.stringify(shifts, null, 2), 'utf8');
    fs.writeFileSync('data/priorities_data.json', JSON.stringify(prioritiesAndRequirements, null, 2), 'utf8');
    console.log('Data successfully written to shifts_data.json');

} catch (err) {
    console.error('Error:', err);
}





