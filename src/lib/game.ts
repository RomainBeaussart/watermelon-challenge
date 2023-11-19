import { Engine, Render, Runner, Bodies, Composite, Body, Detector, Events } from 'matter-js';

let engine: Engine;
let render: Render;
let runner: Runner;
let fruits: Body[] = [];
let fallingLine: Body;

let currentFruit: Body

const wallColor = '#60a3bc';
const indicatorLineColor = '#ff0000';
const indicatorLineMoveUnit = 5;

const wallsGroup = 12;

const fruitsInitSize = 10;


export function main() {
    engine = Engine.create();

    // create a renderer
   render = Render.create({
        element: document.getElementById('board-game') || undefined,
        engine: engine,
        options: {
            width: 600,
            height: 900,
            wireframes: false
        }
    });

    // add all of the bodies to the world
    generateGameBoard()
    setupCommands()
    currentFruit = getFruit();

    setupCollisionDetection()
    // run the renderer
   Render.run(render);
    // create runner
    runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);

    return () => {
        Render.stop(render)
        Runner.stop(runner)
        Engine.clear(engine)
    }
}

function generateGameBoard() {

    const leftWall = Bodies.rectangle(0, 500, 20, 800, { isStatic: true, render: { fillStyle: wallColor }, collisionFilter: { group: wallsGroup } });
    const rightWall = Bodies.rectangle(600, 500, 20, 800, { isStatic: true, render: { fillStyle: wallColor }, collisionFilter: { group: wallsGroup } });
    const bottomWall = Bodies.rectangle(300, 900, 600, 20, { isStatic: true, render: { fillStyle: wallColor }, collisionFilter: { group: wallsGroup } });

    fallingLine = Bodies.rectangle(300, 450, 5, 900, { isStatic: true, isSensor: true, render: { fillStyle: indicatorLineColor }, collisionFilter: { group: wallsGroup } });

    Composite.add(engine.world, [leftWall, rightWall, bottomWall, fallingLine]);
}

function setupCommands() {
    window.addEventListener('mousemove', (event) => {
        //get position of mouse on canvas
        let canvas = document.getElementById('board-game');
        let rect = canvas.getBoundingClientRect();

        let clientX = event.clientX - rect.x

        if (clientX < 0 || clientX > 600) {
            return
        }

        Body.set(fallingLine, "position", { x: clientX, y: fallingLine.position.y });
        Body.set(currentFruit, "position", { x: clientX, y: 80 })

        let mousePos = { x: event.clientX - rect.x, y: event.clientY - rect.y };
        console.log(mousePos);
    })
    window.addEventListener('keydown', (event) => {
        const keyName = event.key;

        // if (keyName === 'ArrowLeft') {
        //     Body.set(fallingLine, "position", { x: Math.max(fallingLine.position.x - indicatorLineMoveUnit, 15), y: fallingLine.position.y });
        //     Body.set(currentFruit, "position", { x: fallingLine.position.x, y: 80 })
        // }

        // if (keyName === 'ArrowRight') {
        //     Body.set(fallingLine, "position", { x: Math.min(fallingLine.position.x + indicatorLineMoveUnit, 585), y: fallingLine.position.y });
        //     Body.set(currentFruit, "position", { x: fallingLine.position.x, y: 80 })
        // }

        // Space
        if (keyName === ' ') {
            if (currentFruit) {
                Body.set(currentFruit, "isStatic", false);
                Body.set(currentFruit, "isSensor", false);
                fruits.push(currentFruit);
                currentFruit = getFruit();
            }
        }
    }, false);
}

const getFruitByLevel = (level: number) => {
    const size = fruitsInitSize + (level - 1) * 20;
    switch (level) {
        case 1: // Cherry
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#EF0704' }, collisionFilter: { group: level }, mass: level });
        case 2: // Strawberry
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#F97353' }, collisionFilter: { group: level }, mass: level });
        case 3: // Grape
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#A868FD' }, collisionFilter: { group: level }, mass: level });
        case 4: // Dekopon
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#FFAB05' }, collisionFilter: { group: level }, mass: level });
        case 5: // Orange
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#FD8A26' }, collisionFilter: { group: level }, mass: level });
        case 6: // Apple
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#F41411' }, collisionFilter: { group: level }, mass: level });
        case 7: // Pear
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#FFF665' }, collisionFilter: { group: level }, mass: level });
        case 8: // Peach
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#FCC0BE' }, collisionFilter: { group: level }, mass: level });
        case 9: // Pineapple
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#FAE713' }, collisionFilter: { group: level }, mass: level });
        case 10: // Melon
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#91D111' }, collisionFilter: { group: level }, mass: level });
        case 11: // Watermelon
            return Bodies.circle(300, 0, size, {isStatic: true, isSensor: true, render: { fillStyle: '#0F800A' }, collisionFilter: { group: level }, mass: level });
    }
}

function getFruit() {
    const level = Math.floor(Math.random() * 5) + 1;
    currentFruit = getFruitByLevel(level);
    Body.set(currentFruit, "position", { x: fallingLine.position.x, y: 80 });
    Composite.add(engine.world, currentFruit);
    return currentFruit
}

function setupCollisionDetection() {
    Events.on(engine, 'collisionStart', function(event) {
        // if both bodies are fruits
        if (event.pairs[0].bodyA.isStatic || event.pairs[0].bodyB.isStatic) {
            return
        }
        if (event.pairs[0].bodyA.collisionFilter.group === event.pairs[0].bodyB.collisionFilter.group) {
            if (event.pairs[0].bodyA.collisionFilter.group === 11) { // Watermelon
                return
            }
            // Remove both bodies and add a new one with upper category at the collision position
            Composite.remove(engine.world, event.pairs[0].bodyA);
            Composite.remove(engine.world, event.pairs[0].bodyB);

            const newFruitLevel = Math.min(event.pairs[0].bodyA.collisionFilter.group + 1, 11);
            const newFruit = getFruitByLevel(newFruitLevel);
            Body.set(newFruit, "isStatic", false);
            Body.set(newFruit, "isSensor", false);
            debugger
            // middle point between both bodies

            const x = (event.pairs[0].bodyA.position.x + event.pairs[0].bodyB.position.x) / 2;
            const y = (event.pairs[0].bodyA.position.y + event.pairs[0].bodyB.position.y) / 2;
            Body.set(newFruit, "position", { x, y });
            Composite.add(engine.world, newFruit);
        }
    })
}