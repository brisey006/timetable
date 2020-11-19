const modules = ["Introduction To Cs", "Data Structures", "Databases", "English", "Theory of Programing", "Architecture"];
const periods = [1, 2, 3, 4, 5, 6];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const venues = ["Main Hall", "C102", "B33", "F01", "F10"];

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const initializePopulation = () => {
    const population = [];
    for (let i = 0; i < 20; i++) {
        const chromosome = generateChromosome();
        population.push(chromosome);
    }
    
    return population;
}

const generateChromosome = () => {
    const sessions = [];
    for (let i = 0; i < periods.length * days.length; i++) {
        const session = {
            module: modules[random(0, modules.length)],
            period: periods[random(0, periods.length)],
            day: days[random(0, days.length)],
            venue: venues[random(0, venues.length)]
        }
        sessions.push(session);
    }
    const fitness = checkFitness(sessions);

    return { fitness, sessions };
}

const checkFitness = (chromosome) => {
    let errorCount = checkModuleClash(chromosome);
    errorCount += checkVenueClash(chromosome);
    errorCount += checkModuleCount(chromosome);
    return errorCount;
}

const checkModuleCount = (chromosome) => {
    let errorCount = 0;
    for (modul of modules) {
        const items = chromosome.filter(e => e.module == modul);
        if (items.length > 6 || items.length < 4) {
            errorCount += 1;
        }
    }
    return errorCount;
}

const checkModuleClash = (chromosome) => {
    const moduleChecked = [];
    let errorCount = 0;
    for (session of chromosome) {
        const itemChecked = moduleChecked.find(e => e == session.module);
        if (!itemChecked) {
            const findModuleClash = chromosome.filter(e => e.module == session.module && e.period == session.period && e.day == session.day);
            moduleChecked.push(session.module);
            if (findModuleClash.length > 1) {
                errorCount += 1;
            }
        }
    }
    return errorCount;
}

const checkVenueClash = (chromosome) => {
    const venueChecked = [];
    let errorCount = 0;
    for (session of chromosome) {
        const itemChecked = venueChecked.find(e => e == session.venue);
        if (!itemChecked) {
            const venueClash = chromosome.filter(e => e.venue == session.venue && e.period == session.period && e.day == session.day);
            venueChecked.push(session.venue);
            if (venueClash.length > 1) {
                errorCount += 1;
            }
        }
    }
    return errorCount;
}

const selection = (population) => {
    const sorted = population.sort((a, b) => (a.fitness > b.fitness) ? 1 : -1);
    const val = parseInt((sorted.length / 2), 10);
    return sorted.slice(0, val);
}

const crossover = (population) => {
    const children = [];
    while (true) {
        const randomOne = random(0, population.length);
        const randomTwo = random(0, population.length);

        const timetableOne = population[randomOne];
        const timetableTwo = population[randomTwo];

        const length = timetableOne.sessions.length / 2;

        const timetableOneSessions = [...timetableOne.sessions.slice(0, length)];
        const childOne = [...timetableOne.sessions.slice(0, length), ...timetableTwo.sessions.slice(length, timetableTwo.sessions.length)];
        const childTwo = [...timetableTwo.sessions.slice(0, length), ...timetableOneSessions];

        children.push({
            fitness: checkFitness(childOne),
            sessions: childOne
        });
        children.push({
            fitness: checkFitness(childTwo),
            sessions: childTwo
        });

        if(children.length >= population.length * 2) {
            break;
        }
    }
    return children;
}

module.exports = {
    initializePopulation,
    selection,
    crossover
}