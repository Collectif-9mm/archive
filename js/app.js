const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPZPvF3-usEB7lbAmjJrn4emncvyEOJ5Z05_aEkYI7lP8RR99soqd21Go_x2vcL3wEqQG59419s8qH/pub?output=csv";
const urlCSVAntiCache = urlCSV + "&t=" + new Date().getTime();

Papa.parse(urlCSVAntiCache, {
    download: true,
    header: true,
    complete: function(resultats) {
        afficherProjets(resultats.data);
    }
});

function afficherProjets(projets) {
    const container = document.getElementById("projets-container");
    if (!container) return; // Sécurité si on n'est pas sur la bonne page
    
    // On s'assure d'avoir la classe de base pour la gestion de l'opacité
    container.classList.add('projets-grid'); 
    container.innerHTML = ""; 

    let projetsFiltres = projets.filter(projet => projet.titre);
    projetsFiltres.sort(() => Math.random() - 0.5);

    let i = 0;
    while (i < projetsFiltres.length) {
        let nbImagesLigne = Math.floor(Math.random() * 4) + 1;
        let ligneProjets = projetsFiltres.slice(i, i + nbImagesLigne);
        let largeurPourcentage = 100 / ligneProjets.length;

        ligneProjets.forEach(projet => {
            let htmlGalerie = "";
            if (projet.galerie) {
                let liens = projet.galerie.split(',');
                liens.forEach(lien => {
                    lien = lien.trim();
                    if (lien.includes("youtube.com") || lien.includes("youtu.be")) {
                        let videoId = "";
                        if (lien.includes("v=")) videoId = lien.split("v=")[1].substring(0, 11);
                        else if (lien.includes("youtu.be/")) videoId = lien.split("youtu.be/")[1].substring(0, 11);
                        htmlGalerie += `<iframe data-videoid="${videoId}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    } else if (lien !== "") {
                        htmlGalerie += `<img src="${lien}" alt="Galerie de ${projet.titre}">`;
                    }
                });
            }

            const article = document.createElement('article');
            article.className = 'projet';
            article.style.width = `${largeurPourcentage}%`;

        // Injection HTML : La galerie est maintenant au-dessus du texte
            article.innerHTML = `
                <img class="main-image" src="${projet.image}" alt="Projet ${projet.titre}">
                <div class="details">
                    <div class="galerie-ligne">
                        <div class="galerie-spacer"></div>
                        ${htmlGalerie}
                    </div>
                    <div class="project-info-grid">
                        <div class="project-info-col">
                            <h2>${projet.titre}</h2>
                            <span>${projet.auteur || ""}</span>
                            <span>${projet.annee}</span>
                        </div>
                        <div class="project-info-col">
                            <p>${projet.intro || ""}</p>
                        </div>
                        <div class="project-info-col">
                            <p>${projet.description || ""}</p>
                        </div>
                    </div>
                </div>
            `;

            const imagePrincipale = article.querySelector('.main-image');
            const boiteDetails = article.querySelector('.details');
            const galerieLigne = article.querySelector('.galerie-ligne');

            imagePrincipale.addEventListener('click', () => {
                const isVisible = boiteDetails.classList.toggle('visible');
                article.classList.toggle('actif', isVisible); 
                
                // Déclencheur pour faire disparaître les autres projets
                container.classList.toggle('project-open', isVisible);
                
                if (isVisible) {
                    const rect = article.getBoundingClientRect();
                    // On applique l'offset au conteneur de détails complet (Grille texte + Galerie)
                    boiteDetails.style.setProperty('--offset-left', `${rect.left}px`);
                }

                const iframes = boiteDetails.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    let vidId = iframe.getAttribute('data-videoid');
                    if (isVisible) {
                        iframe.src = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
                    } else {
                        iframe.src = `https://www.youtube.com/embed/${vidId}`;
                    }
                });
            });
            container.appendChild(article);
        });
        i += nbImagesLigne;
    }

    window.addEventListener('resize', () => {
        document.querySelectorAll('.projet.actif').forEach(article => {
            const rect = article.getBoundingClientRect();
            const boiteDetails = article.querySelector('.details');
            if(boiteDetails) {
                boiteDetails.style.setProperty('--offset-left', `${rect.left}px`);
            }
        });
    });
}