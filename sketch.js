// Flocking
// Daniel Shiffman
// https://thecodingtrain.com

// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM
// https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

let boids = [];

let factor = 5;
let alignSlider, cohesionSlider, separationSlider;

let showRadius = ""

function preload() {
  window.onresize = setCanvas
}

function setCanvas() {
  resizeCanvas(window.innerWidth, window.innerHeight-4)
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight-4)
  background(0)

  var radiusSliders = document.getElementsByClassName('radius');
  for (let slider of radiusSliders) {
    slider.addEventListener("mousedown", sliderMouseDownHandler)
    slider.addEventListener("mouseup", sliderMouseUpHandler)
  }

  //orange
  for (let i = 0; i < 5 * factor; i++) {
    boids.push(new Boid(0, 0.05, 1, 0.05))
  }
  
  //blå
  for (let i = 0; i < 20 * factor; i++) {
    boids.push(new Boid(1, 0.2, 2, -0.1))
  }
  
  //grøn
  for (let i = 0; i < 2 * factor; i++) {
    boids.push(new Boid(2, 0.3, 4, 0.15))
  }

  //rød
  for (let i = 0; i < 1 * factor; i++) {
    boids.push(new Boid(3, 1, 8, -0.3))
  }
}

function sliderMouseDownHandler(event) {
  showRadius = event.target.id
}

function sliderMouseUpHandler(event) {
  showRadius = ""
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
}

function openNav() {
  document.getElementById("sidebar").style.width = "120px";
}

function draw() {
  background(0)

  dists = []
  for (let boid of boids) {
    dists[boid.id] = []
    for (let other of boids) {
        let dx = boid.position.x - other.position.x
        let dy = boid.position.y - other.position.y
        dists[boid.id][other.id] = Math.sqrt( dx*dx + dy*dy )
    }
  }

  let alignment = parseFloat(document.getElementById("alignmentSlider").value)
  let alignmentRadius = parseFloat(document.getElementById("alignmentRadiusSlider").value)
  let cohesion = parseFloat(document.getElementById("cohesionSlider").value)
  let cohesionRadius = parseFloat(document.getElementById("cohesionRadiusSlider").value)
  let separation = parseFloat(document.getElementById("separationSlider").value)
  let separationRadius = parseFloat(document.getElementById("separationRadiusSlider").value)

  document.getElementById("alignmentLabel").innerHTML = alignment
  document.getElementById("alignmentRadiusLabel").innerHTML = alignmentRadius
  document.getElementById("cohesionLabel").innerHTML = cohesion
  document.getElementById("cohesionRadiusLabel").innerHTML = cohesionRadius
  document.getElementById("separationLabel").innerHTML = separation
  document.getElementById("separationRadiusLabel").innerHTML = separationRadius

  let options = {
    alignment: alignment,
    alignmentRadius: alignmentRadius,
    cohesion: cohesion,
    cohesionRadius: cohesionRadius,
    separation: separation,
    separationRadius: separationRadius,
    showRadius: showRadius
  }

  for (let boid of boids) {
    boid.edges()
    boid.flock(boids, dists, options)
    boid.update()
    boid.show()
  }
}