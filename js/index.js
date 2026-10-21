const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPZPvF3-usEB7lbAmjJrn4emncvyEOJ5Z05_aEkYI7lP8RR99soqd21Go_x2vcL3wEqQG59419s8qH/pub?output=csv";
const urlCSVAntiCache = urlCSV + "&t=" + new Date().getTime();

Papa.parse(urlCSVAntiCache, {
    download: true,
    header: true,
    complete: function(resultats) {
        afficherIndex(resultats.data);
    }
});

function afficherIndex(projets) {
    const container = document.getElementById("index-list");
    const hoverImg = document.getElementById("hover-image");
    if (!container) return;

    let projetsFiltres = projets.filter(projet => projet.titre);
    projetsFiltres.sort((a, b) => a.titre.localeCompare(b.titre));

    projetsFiltres.forEach(projet => {
        const wrapper = document.createElement('div');
        wrapper.className = 'index-wrapper';

        const row = document.createElement('div');
        row.className = 'index-item index-grid';
        row.innerHTML = `
            <div>${projet.titre}</div>
            <div>${projet.annee || ""}</div>
            <div>${projet.intro || ""}</div>
            <div>${projet.auteur || ""}</div>
        `;

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
                    htmlGalerie += `<img src="${lien}" alt="Galerie">`;
                }
            });
        }

        const details = document.createElement('div');
        details.className = 'index-details';
        details.innerHTML = `
            <div class="index-desc">
                <p>${projet.description || ""}</p>
            </div>
            <div class="index-galerie">
                ${htmlGalerie}
            </div>
        `;

        row.addEventListener('mouseenter', () => {
            if(projet.image) {
                hoverImg.src = projet.image;
                hoverImg.style.display = 'block';
            }
        });
        
        row.addEventListener('mousemove', (e) => {
            hoverImg.style.left = (e.clientX + 15) + 'px';
            hoverImg.style.top = (e.clientY + 15) + 'px';
        });
        
        row.addEventListener('mouseleave', () => {
            hoverImg.style.display = 'none';
        });

        row.addEventListener('click', () => {
            const isVisible = details.classList.toggle('visible');
            const iframes = details.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                let vidId = iframe.getAttribute('data-videoid');
                if (isVisible) {
                    iframe.src = `https://www.youtube.com/embed/${vidId}?autoplay=1`;
                } else {
                    iframe.src = `https://www.youtube.com/embed/${vidId}`;
                }
            });
        });

        wrapper.appendChild(row);
        wrapper.appendChild(details);
        container.appendChild(wrapper);
    });
}