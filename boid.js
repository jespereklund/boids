// Flocking
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html
// https://youtu.be/mhjuuHl6qHM
// https://editor.p5js.org/codingtrain/sketches/ry4XZ8OkN

const margin = 30;

class Boid {
  constructor(type, maxForce, maxSpeed, direction) {
    this.type = type
    this.direction = direction
    this.id   = ++Boid.id_count
    this.position = createVector(random(width), random(height))
    this.velocity = p5.Vector.random2D()
    this.velocity.setMag(random(2, 4))
    this.acceleration = createVector()
    this.maxForce = maxForce
    this.maxSpeed = maxSpeed
    this.color = [
      color(255, 170, 0), 
      color(0, 170, 255), 
      color(170, 225, 0), 
      color(255, 50, 0)
    ][type]

    this.shape = [
      [-1, -1.5, -1, 1.5, 2.5, 0],
      [-1, -1, -1, 1, 2, 0], 
      [-2, -1.5, -2, 1.5, 3, 0],
      [-2, -0.75, -2, 0.75, 3, 0]
    ][type].map(function(element) {
      return element * 8
    })
  }

  static id_count = 0

  edges() {
    if (this.position.x > width + margin) {
      this.position.x = 0
    } else if (this.position.x < -margin) {
      this.position.x = width
    }
    if (this.position.y > height + margin) {
      this.position.y = 0
    } else if (this.position.y < -margin) {
      this.position.y = height
    }
  }

  align(boids, dists) {
    let steering = createVector()
    let dists_this = dists[this.id]
    let total = 0
    for (let other of boids) {
      let T =  ( other.id  != this.id   )
            && ( this.type == other.type)
            && ( dists_this[other.id] < this.alignmentRadius)
      if ( T ) {
        steering.add(other.velocity)
        total++
      }
    }
    if (total > 0) {
      steering.div(total)
      steering.setMag(this.maxSpeed)
      steering.sub(this.velocity)
      steering.limit(this.maxForce)
    }
    return steering
  }

  separation(boids, dists) {
    let steering = createVector()
    let dists_this = dists[this.id]
    let total = 0
    for (let other of boids) {
      if (other.id == this.id ) continue;
        let d = dists_this[other.id]
        if ( d < this.separationRadius) { 
          let diff = p5.Vector.sub(this.position, other.position)
          diff.div(d * d)
          steering.add(diff)
          total++
        }
    }
    if (total > 0) {
      steering.div(total)
      steering.setMag(this.maxSpeed)
      steering.sub(this.velocity)
      steering.limit(this.maxForce)
    }
    return steering
  }

  cohesion(boids, dists) {
    let steering = createVector()
    let total = 0
    let dists_this = dists[this.id]
    for (let other of boids) {
      let T =  ( other.id  != this.id   )
            && ( this.type == other.type)
            && ( dists_this[other.id] < this.cohesionRadius)
      if ( T ) { 
        steering.add(other.position)
        total++
      }
    }
    if (total > 0) {
      steering.div(total)
      steering.sub(this.position)
      steering.setMag(this.maxSpeed)
      steering.sub(this.velocity)
      steering.limit(this.maxForce)
    }
    return steering
  }

  flock(boids, dists, options) {
    this.separationRadius = options.separationRadius
    this.cohesionRadius = options.cohesionRadius
    this.alignmentRadius = options.alignmentRadius

    this.showRadius = options.showRadius

    let alignment = this.align(boids, dists)
    let cohesion = this.cohesion(boids, dists)
    let separation = this.separation(boids, dists)

    alignment.mult(options.alignment)
    cohesion.mult(options.cohesion)
    separation.mult(options.separation)

    this.acceleration.add(alignment)
    this.acceleration.add(cohesion)
    this.acceleration.add(separation)
  }

  update() {
    this.position.add(this.velocity)
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)

    this.velocity.x += this.direction

    this.acceleration.mult(0)
  }

  show() {
    push()
    translate(this.position.x, this.position.y)
    fill(this.color);
    rotate(this.velocity.heading()) 
    triangle(...this.shape)
    if(this.showRadius != "") {
      noFill()
      strokeWeight(2)
      stroke(100, 100, 100)
      if(this.showRadius == "alignmentRadiusSlider") {
        circle(0, 0, this.alignmentRadius)
      }
      if(this.showRadius == "cohesionRadiusSlider") {
        circle(0, 0, this.cohesionRadius)
      }
      if(this.showRadius == "separationRadiusSlider") {
        circle(0, 0, this.separationRadius)
      }
    }
    pop() 
  }
}