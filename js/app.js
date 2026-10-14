// 1. COLLE TON LIEN CSV JUSTE ICI ENTRE LES GUILLEMETS
const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPZPvF3-usEB7lbAmjJrn4emncvyEOJ5Z05_aEkYI7lP8RR99soqd21Go_x2vcL3wEqQG59419s8qH/pub?output=csv";

Papa.parse(urlCSV, {
    download: true,
    header: true,
    complete: function(resultats) {
        afficherProjets(resultats.data);
    }
});

function afficherProjets(projets) {
    const container = document.getElementById("projets-container");
    container.innerHTML = ""; 

    projets.forEach(projet => {
        if (!projet.titre) return; 

        let htmlGalerie = "";
        if (projet.galerie) {
            let liens = projet.galerie.split(',');
            liens.forEach(lien => {
                lien = lien.trim();
                
                if (lien.includes("youtube.com") || lien.includes("youtu.be")) {
                    let videoId = "";
                    if (lien.includes("v=")) {
                        videoId = lien.split("v=")[1].substring(0, 11);
                    } else if (lien.includes("youtu.be/")) {
                        videoId = lien.split("youtu.be/")[1].substring(0, 11);
                    }
                    
                    // NOUVEAU : On stocke l'ID (data-videoid) et on ajoute toutes les autorisations officielles YouTube
                    htmlGalerie += `<iframe data-videoid="${videoId}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } 
                else if (lien !== "") {
                    htmlGalerie += `<img src="${lien}" alt="Galerie de ${projet.titre}">`;
                }
            });
        }

        const article = document.createElement('article');
        article.className = 'projet';

        article.innerHTML = `
            <img class="main-image" src="${projet.image}" alt="Projet ${projet.titre}">
            
            <div class="details">
                <h2>${projet.titre}</h2>
                <p class="annee">${projet.annee}</p>
                <p class="intro">${projet.intro || ""}</p>
                <p class="auteur"><strong>${projet.auteur || ""}</strong></p>
                <p class="description">${projet.description || ""}</p>
                
                <div class="galerie-ligne">
                    ${htmlGalerie}
                </div>
            </div>
        `;

        const imagePrincipale = article.querySelector('.main-image');
        const boiteDetails = article.querySelector('.details');

        imagePrincipale.addEventListener('click', () => {
            const isVisible = boiteDetails.classList.toggle('visible');
            const iframes = boiteDetails.querySelectorAll('iframe');
            
            iframes.forEach(iframe => {
                // On récupère l'ID qu'on avait mis de côté
                let vidId = iframe.getAttribute('data-videoid');
                
                if (isVisible) {
                    // On reconstruit l'URL proprement pour forcer la lecture
                    iframe.src = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
                } else {
                    // Quand on ferme, on remet l'URL d'origine (ça coupe la vidéo)
                    iframe.src = `https://www.youtube.com/embed/${vidId}`;
                }
            });
        });

        container.appendChild(article);
    });
}