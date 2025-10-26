const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.card');

let cardWidth = cards[0].offsetWidth + 20; // inclui gap
let index = 0;

// CLONAR CARDS PARA LOOP INFINITO
cards.forEach(card => track.appendChild(card.cloneNode(true))); // clona no final
cards.forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild)); // clona no começo

// posição inicial ajustada
index = cards.length;
track.style.transform = `translateX(-${index * cardWidth}px)`;

// função para mover
function moveNext() {
  index++;
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(-${index * cardWidth}px)`;

  // quando chegar ao clone do final, reset sem animação
  if (index >= cards.length * 2) {
    setTimeout(() => {
      track.style.transition = 'none';
      index = cards.length;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
    }, 500);
  }
}

function movePrev() {
  index--;
  track.style.transition = 'transform 0.5s ease';
  track.style.transform = `translateX(-${index * cardWidth}px)`;

  // quando chegar ao clone do começo, reset sem animação
  if (index < cards.length) {
    setTimeout(() => {
      track.style.transition = 'none';
      index = cards.length * 2 - 1;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
    }, 500);
  }
}

// botões
document.querySelector('.next').addEventListener('click', moveNext);
document.querySelector('.prev').addEventListener('click', movePrev);

