let player;
let enemies = [];
let bullets = [];
let score = 0;
let wave = 0;
let upgradeMenu = false;
let shopMenu = false;
let explosiveBulletsBought = false;
let superBulletsBought = false;

function setup() {
    createCanvas(1024, 768);
    player = new Player();
    startWave(0);
}

function draw() {
    background(255);
    updateGame();
    drawGame();
}

function updateGame() {
    player.update();
    bullets.forEach(bullet => bullet.update());
    enemies.forEach(enemy => enemy.update());

    // Check for bullet collisions
    bullets = bullets.filter(bullet => {
        if (bullet.owner !== player && bullet.hits(player)) {
            player.health -= bullet.owner.damage;
            return false;
        }
        if (bullet.owner === player) {
            enemies = enemies.filter(enemy => {
                if (bullet.hits(enemy)) {
                    enemy.health -= player.damage * (superBulletsBought ? 5 : 1);
                    if (enemy.health <= 0) {
                        score++;
                        return false;
                    }
                }
                return true;
            });
        }
        return bullet.isOnScreen();
    });

    // Check if all enemies are defeated
    if (enemies.length === 0) {
        wave++;
        if (wave % 5 === 0) {
            player.bullets++;
        }
        upgradeMenu = true;
    }
}

function drawGame() {
    player.draw();
    bullets.forEach(bullet => bullet.draw());
    enemies.forEach(enemy => enemy.draw());

    // Display score and wave
    fill(0);
    textSize(36);
    text(`Score: ${score}`, 10, 40);
    text(`Wave: ${wave}`, width - 150, 40);

    if (upgradeMenu) {
        drawUpgradeMenu();
    } else if (shopMenu) {
        drawShopMenu();
    }
}

function keyPressed() {
    if (key === ' ') {
        if (upgradeMenu) {
            upgradeMenu = false;
            startWave(wave);
        }
    } else if (key === '1' && upgradeMenu) {
        player.health = player.maxHealth;
        upgradeMenu = false;
        startWave(wave);
    } else if (key === '2' && upgradeMenu) {
        player.damage += 5;
        upgradeMenu = false;
        startWave(wave);
    } else if (key === '3' && upgradeMenu) {
        player.maxHealth += 5;
        player.health += 5;
        upgradeMenu = false;
        startWave(wave);
    } else if (key === '9' && !upgradeMenu) {
        shopMenu = true;
    } else if (key === 'BACKSPACE' && shopMenu) {
        shopMenu = false;
    } else if (key === '1' && shopMenu && score >= 10 && !explosiveBulletsBought) {
        explosiveBulletsBought = true;
        score -= 10;
    } else if (key === '2' && shopMenu && score >= 5) {
        player.health = player.maxHealth;
        score -= 5;
    } else if (key === '3' && shopMenu && score >= 100 && !superBulletsBought) {
        superBulletsBought = true;
        score -= 100;
    }
}

function startWave(wave) {
    for (let i = 0; i < (wave === 0 ? 1 : 5 + wave); i++) {
        enemies.push(new Enemy());
    }
}

// Define Player, Enemy, Bullet classes here...

// Example Player class
class Player {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.size = 50;
        this.speed = 3;
        this.health = 150;
        this.maxHealth = 150;
        this.damage = 10;
        this.bullets = 1;
    }

    update() {
        if (keyIsDown(65)) this.x -= this.speed; // A
        if (keyIsDown(68)) this.x += this.speed; // D
        if (keyIsDown(87)) this.y -= this.speed; // W
        if (keyIsDown(83)) this.y += this.speed; // S

        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }

    draw() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.size, this.size);
        this.drawHealthBar();
    }

    drawHealthBar() {
        fill(255, 0, 0);
        rect(this.x, this.y - 10, this.size, 5);
        fill(0, 255, 0);
        rect(this.x, this.y - 10, this.size * (this.health / this.maxHealth), 5);
    }
}

// Define Enemy and Bullet classes similarly...
