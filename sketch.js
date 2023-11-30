var bg, bgImg;
var player, shooterImg, shooter_shooting;
var cure, cureImg, usedCure, usedCureImg;
var zombie, zombieImg;
var zombieGroup;
var bullets = 20;
var gameState = "fight";
var score = 0;
var life = 3;


function preload() {

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg");

  cureImg = loadImage("assets/seringa.png");
  usedCureImg = loadImage("assets/seringa1.png");

  zombieImg = loadAnimation("assets/zombie1.png", " assets/zombie2.png");
  zombieImg.play = true;
}

function setup() {


  createCanvas(windowWidth, windowHeight);
  
  zombieImg.frameDelay = 20

  //adicionando a imagem de fundo
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 1.1


  //criando o sprite do jogador
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)

  cure = createSprite(displayWidth - 150, 40, 20, 20);
  cure.addImage("cure", cureImg);
  cure.scale = 0.08

  cure1 = createSprite(displayWidth - 180, 40, 20, 20);
  cure1.addImage("cure1", cureImg);
  cure1.scale = 0.08

  cure2 = createSprite(displayWidth - 210, 40, 20, 20);
  cure2.addImage("cure2", cureImg);
  cure2.scale = 0.08

  usedCure = createSprite(displayWidth - 150, 40, 20, 20);
  usedCure.addImage("usedCure", usedCureImg);
  usedCure.scale = 0.08

  usedCure1 = createSprite(displayWidth - 180, 40, 20, 20);
  usedCure1.addImage("usedCure1", usedCureImg);
  usedCure1.scale = 0.08

  usedCure2 = createSprite(displayWidth - 210, 40, 20, 20);
  usedCure2.addImage("usedCure2", usedCureImg);
  usedCure2.scale = 0.08

  zombieGroup = new Group()
  bulletGroup = new Group()
}

function draw() {
  background(0);

  //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usando toques

  if (gameState === "fight") {

    if (keyDown("UP_ARROW") || touches.length > 0) {
      player.y = player.y - 30
    }
    if (keyDown("DOWN_ARROW") || touches.length > 0) {
      player.y = player.y + 30
    }
    if (keyDown("LEFT_ARROW") || touches.length > 0) {
      player.x = player.x - 30
    }
    if (keyDown("RIGHT_ARROW") || touches.length > 0) {
      player.x = player.x + 30
    }

    if (life === 3) {

      cure.visible = true;
      cure1.visible = true;
      cure2.visible = true;
      usedCure.visible = false;
      usedCure1.visible = false;
      usedCure2.visible = false;
    }
    if (life === 2) {

      cure.visible = false;
      cure1.visible = true;
      cure2.visible = true
      usedCure.visible = true;
      usedCure1.visible = false;
      usedCure2.visible = false;
    }
    if (life === 1) {

      cure.visible = false;
      cure1.visible = false;
      cure2.visible = true;
      usedCure.visible = true;
      usedCure1.visible = true;
      usedCure2.visible = false;
    }
    else if (life === 0) {

      cure.visible = false;
      cure1.visible = false;
      cure2.visible = false;
      usedCure.visible = true;
      usedCure1.visible = true;
      usedCure2.visible = true;
      gameState = "lost";
    }

    if (score == 100) {

      gameState = "won";
    }

    //solte balas e mude a imagem do atirador para a posição de tiro quando a tecla de espaço for pressionada
    if (keyWentDown("space")) {

      bullet = createSprite(displayWidth - 1150, player.y - 30, 20, 10);
      bullet.velocityX = 60;
      bulletGroup.add(bullet);
      player.depth = bullet.depth;
      player.depth = player.depth + 2;
      player.addImage(shooter_shooting);
      bullets = bullets - 1;
    }

    if (bullets == 0) {

      gameState = "bullet";

    }

    if (zombieGroup.isTouching(bulletGroup)) {

      for (var i = 0; i < zombieGroup.length; i++) {

        if (zombieGroup[i].isTouching(bulletGroup)) {

          zombieGroup[i].destroy();
          bulletGroup.destroyEach();
          score = score + 10
        }
      }
    }

    //o jogador volta à imagem original quando pararmos de pressionar a barra de espaço
    else if (keyWentUp("space")) {
      player.addImage(shooterImg)
    }

    if (zombieGroup.isTouching(player)) {

      for (var i = 0; i < zombieGroup.length; i++) {

        if (zombieGroup[i].isTouching(player)) {

          zombieGroup[i].destroy();
          life = life - 1
        }
      }
    }

    enemy();
  }
  drawSprites();

  textSize(25);
  fill("lightgray")
  text("bullets=" + bullets, displayWidth - 230, displayHeight - 780)

  //textSize(25);
  fill("white");
  text("score = " + score, displayWidth - 230, displayHeight - 760);

  if (gameState == "lost") {

    textSize(100);
    fill("red");
    text("You Dead", 400, 400);
    zombieGroup.destroyEach();
    player.destroy();
  }

  else if (gameState == "won") {

    textSize(100);
    fill("Green");
    text("You Win", 400, 400);
    zombieGroup.destroyEach();
    player.destroy();
  }

  else if (gameState == "bullet") {

    textSize(100);
    fill("Red");
    text("ran out of munition", 400, 400);
    zombieGroup.destroyEach();
    player.destroy();
    bulletGroup.destroyEach();
  }

}

function enemy() {

  if (frameCount % 50 === 0) {

    zombie = createSprite(random(900, 1100), random(100, 500));
    zombie.addAnimation("z", zombieImg);
    zombie.scale = 0.27
    zombie.velocityX = -9;
    zombie.debug = true
    zombie.setCollider("rectangle", 0, 0, 350, 540);
    zombie.lifetime = 400;
    zombieGroup.add(zombie);
  }
}