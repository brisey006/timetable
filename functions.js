const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
}

let populationForSelection = [];

const courses = ["Introduction To Cs", "Data Structures", "Databases", "English", "Theory of Programing", "Architecture"];
const periods = [1, 2, 3, 4, 5, 6];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const venues = ["Main Hall", "C102", "B33", "F01", "F10"];

const generatePopulation = () => {
    const population = [];

    for (let i = 0; i < 1000; i++) {
        const dayTimetables = generateDays(courses, periods, days, venues);
        const fitnessResult = checkFitness(dayTimetables);
        const timetable = {
            fitness: fitnessResult.fitness,
            courseErrors: fitnessResult.courseErrors,
            venueErrors: fitnessResult.venueErrors,
            dayTimetables
        };
        population.push(timetable);
    }
    return population;
}

const checkFitness = (days) => {
    let fitness = 0;
    let courseErrors = 0;
    let venueErrors = 0;
    for (day of days) {
        courseErrors += checkCourseErrors(day, courses);
        venueErrors += checkVenueErrors(day);
    }
    fitness = courseErrors + venueErrors;
    return { fitness, courseErrors, venueErrors };
}

const checkCourseErrors = (day, courses) => {
    const slots = day.slots;
    let errorNumber = 0;
    for (course of courses) {
        const filteredArray = slots.filter(e => {
            return e.course == course;
        });
        
        if (filteredArray.length != 1) {
            errorNumber += 1;
        }
    }
    return errorNumber;
}

const checkVenueErrors = (day) => {
    const slots = day.slots;

    const arr = [];
    for (slot of slots) {
        for (s of slots) {
            if (s.period == slot.period && s.venue == slot.venue && slot.course != s.course) {
                const checkAvailable = arr.filter(e => {
                    return e.period == slot.period;
                });
    
                if (checkAvailable.length == 0) {
                    arr.push(slot);
                }
            }
        }
    }
    
    return arr.length;
}

const generateDays = (courses, periods, days, venues) => {
    const daysTimetable = [];
    for (day of days) {
        const slots = [];
        for(let i = 0; i < 6; i++) {
            slots.push({
                course: courses[random(0, courses.length)],
                period: periods[random(0, periods.length)],
                venue: venues[random(0, venues.length)],
            });
        }
        daysTimetable.push({ day, slots });
    }
    return daysTimetable;
}

const getParent = () => {
    return tournamentSelection();
}

const tournamentSelection = () => {
    let item;
    const itemOnePosition = random(0, populationForSelection.length);
    const itemOne = populationForSelection[itemOnePosition];
    populationForSelection.splice(itemOnePosition, 1);

    while (true) {
        const itemTwoPosition = random(0, populationForSelection.length);
        const itemTwo = populationForSelection[itemTwoPosition];
        if (itemOne.fitness < itemTwo.fitness) {
            item = itemOne;
            populationForSelection.splice(itemTwoPosition, 1);
            break;
        } else {
            item = itemTwo;
            populationForSelection.splice(itemTwoPosition, 1);
            break;
        }
    }
    return item;
}

const crossOver = (parentOne, parentTwo) => {
    const timetableOneDays = [];
    const timetableTwoDays = [];
    for (let i = 0; i < parentOne.dayTimetables.length; i++) {
        const father = parentOne.dayTimetables[i];
        const mother = parentTwo.dayTimetables[i];

        const point = Math.round(father.slots.length / 2);
        const array = father.slots.slice(0, point);
        const array2 = father.slots.slice(point, father.slots.length);

        const arrayb = mother.slots.slice(0, point);
        const array2b = mother.slots.slice(point, mother.slots.length);

        const childAArray = array.concat(array2b);
        const childBArray = arrayb.concat(array2);

        timetableOneDays.push({
            day: father.day,
            slots: childAArray
        });

        timetableTwoDays.push({
            day: mother.day,
            slots: childBArray
        });
    }

    const fitnessOne = checkFitness(timetableOneDays);
    const timetableOne = {
        fitness: fitnessOne.fitness,
        courseErrors: fitnessOne.courseErrors,
        venueErrors: fitnessOne.venueErrors,
        dayTimetables: timetableOneDays
    };

    const fitnessTwo = checkFitness(timetableTwoDays);
    const timetableTwo = {
        fitness: fitnessTwo.fitness,
        courseErrors: fitnessTwo.courseErrors,
        venueErrors: fitnessTwo.venueErrors,
        dayTimetables: timetableTwoDays
    }

    return [timetableOne, timetableTwo];
}

const mutation = (timetable) => {
    const days = timetable.dayTimetables;

    let randomDayOne;
    let randomDayTwo;

    while(true) {
        randomDayOne = random(0, days.length);
        randomDayTwo = random(0, days.length);
        if (randomDayOne != randomDayTwo) {
            break;
        }
    }

    const dayOne = days[randomDayOne];
    const dayTwo = days[randomDayTwo];

    const randomKey = random(0, dayOne.slots.length);

    const dataOnOne = dayOne.slots[randomKey];
    const course1 = dataOnOne.course+'';
    const  course2 = dayTwo.slots[randomKey].course + '';
    dayOne.slots[randomKey].course = course2;
    
    dayTwo.slots[randomKey].course = course1;
    
    const timeOne = {
        fitness: checkFitness(days),
        dayTimetables: days
    }
    return timeOne;
}

const processChildren = (population) => {
    let children = [];
    populationForSelection = [...population];

    while(true) {
        const parentOne = getParent();
        const parentTwo = getParent();

        const chiren = crossOver(parentOne, parentTwo);

        for (child of chiren) {
            children.push(child);
        }
        if (populationForSelection.length < 2) {
            break;
        }
    }
    return children;
}
const mutate = (population) => {
    let children = [];
    let tempPopulation = [...population];

    for (timetable of tempPopulation) {
        const rand = random(0, 10);
        if (rand > 8) {
            const timet = mutation(timetable);
            children.push(timet);
        } else {
            children.push(timetable);
        }
    }
    return children;
}

const nextGeneration = (population) => {
    let children = [];
    children = children.concat(processChildren(population));
    children = children.concat(processChildren(population));
    return mutate(children);
} 

module.exports = {
    generatePopulation,
    nextGeneration,
    random
}