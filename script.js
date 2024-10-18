const canvas = document.getElementById('gameCanvas'); 
const player = document.querySelector('.plane');
let playerPosition = 375; // Posição horizontal inicial do avião
let obstacles = []; // Array para armazenar os obstáculos
let bullets = []; // Array para armazenar as balas
let score = 0; // Placar
let gameInterval; // Intervalo do jogo

let obstacleSpeed = 30; // Aumenta a velocidade dos obstáculos
let obstacleInterval = 800; // Intervalo inicial para criar obstáculos
let speedIncreaseInterval = 3000; // Tempo em milissegundos para aumentar a velocidade
let speedIncreaseAmount = 2; // Quanto aumentar a velocidade a cada intervalo

// Função para criar um obstáculo
function createObstacle() {
    // Limite para a quantidade total de obstáculos na tela
    if (obstacles.length >= 5) return; // Impede a criação de novos obstáculos se já houver 5 na tela

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    const colors = ['red', 'blue']; // Mantemos apenas vermelho e azul para os GIFs
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Colocar GIFs em vez de cores
    if (randomColor === 'red') {
        obstacle.style.backgroundImage = "url('img/helicopter_5199608-removebg-preview.png')"; // Helicóptero
        obstacle.style.backgroundSize = 'cover'; // Faz a imagem cobrir todo o obstáculo
    } else {
        // Aqui, colocamos GIFs azuis e outros
        if (Math.random() < 0.5) {
            obstacle.style.backgroundImage = "url('img/lighthouse_1831498-removebg-preview.png')"; // Faro
        } else {
            obstacle.style.backgroundImage = "url('img/ship_3389531-removebg-preview.png')"; // Navio
        }
        obstacle.style.backgroundSize = 'cover'; // Faz a imagem cobrir todo o obstáculo
    }

    obstacle.style.left = Math.random() * (canvas.offsetWidth - 40) + 'px'; // Posição horizontal aleatória
    obstacle.style.top = '0px'; // Começa no topo
    canvas.appendChild(obstacle);
    obstacles.push(obstacle); // Adiciona o obstáculo ao array
}

// Função para contar obstáculos de uma determinada cor
function countColor(obstaclesArray, color) {
    return obstaclesArray.filter(obstacle => obstacle.style.backgroundColor === color).length;
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        const obstacleTop = parseInt(obstacle.style.top) || 0; // Posição vertical atual do obstáculo
        obstacle.style.top = obstacleTop + obstacleSpeed + 'px'; // Move o obstáculo para baixo

        // Verifica se o obstáculo saiu da tela
        if (obstacleTop > canvas.offsetHeight) {
            obstacle.remove(); // Remove o obstáculo da tela
            obstacles.splice(index, 1); // Remove do array
            score++; // Aumenta o placar
        }

        // Verifica colisão com o jogador
        if (checkCollision(player, obstacle)) {
            alert('Game Over! Seu placar: ' + score);
            resetGame(); // Reinicia o jogo
        }
    });
}

function moveBullet(bullet) {
    const interval = setInterval(() => {
        const bulletTop = parseInt(bullet.style.top) || 0; // Posição vertical da bala
        bullet.style.top = bulletTop - 15 + 'px'; // Aumenta a velocidade da bala

        // Verifica se a bala saiu da tela
        if (bulletTop < 0) {
            bullet.remove(); // Remove a bala da tela
            bullets = bullets.filter(b => b !== bullet); // Remove do array
            clearInterval(interval);
        }

        // Verifica colisão com obstáculos
        obstacles.forEach((obstacle, index) => {
            if (checkCollision(bullet, obstacle)) {
                obstacle.remove(); // Remove o obstáculo
                bullets = bullets.filter(b => b !== bullet); // Remove a bala
                bullet.remove(); // Remove a bala da tela
                obstacles.splice(index, 1); // Remove do array
                clearInterval(interval);
            }
        });
    }, 10); // Reduz o intervalo para aumentar a velocidade das balas
}

function checkCollision(div1, div2) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

function resetGame() {
    // Limpa todos os obstáculos e balas
    obstacles.forEach(obstacle => obstacle.remove());
    bullets.forEach(bullet => bullet.remove());
    obstacles = [];
    bullets = [];
    score = 0; // Reseta o placar

    // Reinicia o intervalo de obstáculos
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        createObstacle();
        moveObstacles();
    }, obstacleInterval);
}

function increaseSpeed() {
    obstacleSpeed += speedIncreaseAmount; // Aumenta a velocidade
    obstacleInterval = Math.max(obstacleInterval - 50, 500); // Aumenta a frequência de obstáculos
    clearInterval(gameInterval); // Limpa o intervalo atual
    gameInterval = setInterval(() => {
        createObstacle();
        moveObstacles();
    }, obstacleInterval); // Cria obstáculos mais frequentemente
}

// Inicia o aumento de velocidade
setInterval(increaseSpeed, speedIncreaseInterval);

function movePlayer(event) {
    switch (event.key) {
        case 'ArrowLeft':
            if (playerPosition > 0) {
                playerPosition -= 20; // Mover para a esquerda
            }
            break;
        case 'ArrowRight':
            if (playerPosition < canvas.offsetWidth - 50) {
                playerPosition += 20; // Mover para a direita
            }
            break;
        case 'Enter': // Troca de espaço para "Enter" para disparar a bala
            shootBullet(); // Dispara a bala
            break;
    }
    player.style.left = playerPosition + 'px'; // Atualiza a posição do avião
}

function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = (playerPosition + 20) + 'px'; // Centraliza a bala em relação ao avião
    bullet.style.bottom = '70px'; // Define a posição vertical da bala
    canvas.appendChild(bullet);
    bullets.push(bullet); // Adiciona a nova bala ao array
    moveBullet(bullet); // Chama a função para mover a bala
}

// Inicia o jogo
document.addEventListener('keydown', movePlayer);
gameInterval = setInterval(() => {
    createObstacle();
    moveObstacles();
}, obstacleInterval);
