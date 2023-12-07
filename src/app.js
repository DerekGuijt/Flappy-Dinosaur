document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const bird = {
    x: 50,
    y: canvas.height / 2 - 15,
    radius: 15,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: 5
  };

  let pipes = [];
  let score = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw pipes
    ctx.fillStyle = "#00f";
    for (let pipe of pipes) {
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      ctx.fillRect(pipe.x, pipe.bottomStart, pipe.width, pipe.bottomHeight);
    }

    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }

  function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Generate pipes
    if (Math.random() < 0.02) {
      const gap = 100;
      const minHeight = 50;
      const maxHeight = canvas.height - gap - minHeight;

      const topHeight = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
      const bottomHeight = canvas.height - gap - topHeight;

      pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomStart: topHeight + gap,
        bottomHeight: bottomHeight,
        width: 20,
        passed: false
      });
    }

    // Move pipes
    for (let pipe of pipes) {
      pipe.x -= 2;

      // Check for collision
      if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.radius > pipe.x &&
        (bird.y < pipe.topHeight || bird.y + bird.radius > pipe.bottomStart)
      ) {
        // Game over
        alert("Game Over! Your score is: " + score);
        resetGame();
      }

      // Increase score
      if (bird.x > pipe.x && !pipe.passed) {
        pipe.passed = true;
        score++;
      }
    }

    // Remove off-screen pipes
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // Check for bird out of bounds
    if (bird.y + bird.radius > canvas.height || bird.y < 0) {
      // Game over
      alert("Game Over! Your score is: " + score);
      resetGame();
    }
  }

  function resetGame() {
    bird.y = canvas.height / 2 - 15;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
  }

  function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
  }

  document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
      bird.velocity = -bird.jumpStrength;
    }
  });

  gameLoop();
});
