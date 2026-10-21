const listeLogos = [
    "logo1.svg",
];

const logoAleatoire = listeLogos[Math.floor(Math.random() * listeLogos.length)];

const imageLogo = document.getElementById('random-logo');
if (imageLogo) {
    imageLogo.src = `assets/images/logos/${logoAleatoire}`;
}