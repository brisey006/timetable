const express = require('express');
const { generatePopulation, nextGeneration } = require('./functions');
const { initializePopulation, selection, crossover } = require('./timetable');
const router = express.Router();

router.get('/', (req, res) => {
    let population = generatePopulation();
    let i = 0;
    const timetables = [];
    while(true) {
        population = nextGeneration(population);
        const item = population.find(it => it.fitness < 1);
        if (item) {
            timetables.push(item);
            break
        }
        i += 1;
        console.log(i, population.length)
    }

    console.log(`Found in ${i} permutations`);
    
    res.json(timetables);
});

router.get('/timetable', (req, res) => {
    const population = initializePopulation();
    const selected = selection(population);
    let timetable;
    let count = 0;
    while (true) {
        count += 1;
        console.log(count);
        const children = crossover(selected);
        timetable = children.find(e => e.fitness == 0);
        if (timetable) {
            break;
        }
    }
    console.log(`Found after ${count} iterations`);
    res.json(timetable);
});

module.exports = router;