document.addEventListener("DOMContentLoaded", function() {
    // 0. INTERRUPTEUR MODE SOMBRE / MODE CLAIR
    // (Le thème est déjà appliqué dès le <head> par un petit script anti-flash ;
    //  ici on branche juste le bouton et on garde le contenu de l'icône synchronisé.)
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        const root = document.documentElement;
        function syncToggleIcon() {
            const isDark = root.getAttribute("data-theme") === "dark";
            themeToggle.textContent = isDark ? "☀️" : "🌙";
            themeToggle.setAttribute("aria-label", isDark ? "Activer le mode clair" : "Activer le mode sombre");
        }
        syncToggleIcon();
        themeToggle.addEventListener("click", function() {
            const newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", newTheme);
            localStorage.setItem("fomalhaut_theme", newTheme);
            syncToggleIcon();
        });
    }

    // 1. COMPTEUR DE VISITES LOCALES
    const countElement = document.getElementById("visitor-count");
    if (countElement) {
        const baseVisits = 14250; 
        let currentVisits = localStorage.getItem("fomalhaut_visits");
        if (!currentVisits) { currentVisits = baseVisits + 1; } 
        else { currentVisits = parseInt(currentVisits) + 1; }
        localStorage.setItem("fomalhaut_visits", currentVisits);
        countElement.innerText = currentVisits.toLocaleString();
    }

    // 2. FILTRAGE DE LA GALERIE
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", function() {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");
                const filterValue = this.getAttribute("data-filter");
                galleryItems.forEach(item => {
                    if (filterValue === "all" || item.classList.contains(filterValue)) {
                        item.style.display = "block";
                        setTimeout(() => item.style.opacity = "1", 10);
                    } else {
                        item.style.opacity = "0";
                        setTimeout(() => item.style.display = "none", 300);
                    }
                });
            });
        });
    }

    // 3. ZOOMS MODALE LIGHTBOX
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");
    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            const img = item.querySelector("img");
            const title = item.querySelector("h4") ? item.querySelector("h4").innerText : "";
            const location = item.querySelector("p") ? item.querySelector("p").innerText : "";
            if (img) {
                img.addEventListener("click", function() {
                    lightbox.style.display = "block";
                    lightboxImg.src = this.src;
                    lightboxCaption.innerText = title + " — " + location;
                    document.body.style.overflow = "hidden";
                });
            }
        });
        if (closeBtn) {
            closeBtn.addEventListener("click", function() {
                lightbox.style.display = "none";
                document.body.style.overflow = "auto";
            });
        }
        lightbox.addEventListener("click", function(e) {
            if (e.target === lightbox || e.target === closeBtn) {
                lightbox.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }

    // 4. CONTACT GENERAL Formspree
    const contactForm = document.getElementById("fomalhaut-contact");
    if (contactForm) {
        contactForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const button = contactForm.querySelector("button[type='submit']");
            button.innerText = "Envoi en cours...";
            button.disabled = true;
            const data = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, { method: contactForm.method, body: data, headers: { 'Accept': 'application/json' } });
                if (response.ok) { alert("Votre message de contact général a bien été envoyé au secrétariat de FOMALHAUT.MBC. Nous vous répondrons par e-mail."); contactForm.reset(); }
                else { alert("Une erreur technique est survenue."); }
            } catch (error) { alert("Erreur de réseau."); }
            finally { button.innerText = "Envoyer le message"; button.disabled = false; }
        });
    }

    // 5. FORMULAIRE DE DEVIS
    const devisForm = document.getElementById("fomalhaut-devis");
    if (devisForm) {
        devisForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const button = devisForm.querySelector("button[type='submit']");
            button.innerText = "Transmission de l'étude...";
            button.disabled = true;
            const data = new FormData(devisForm);
            try {
                const response = await fetch(devisForm.action, { method: devisForm.method, body: data, headers: { 'Accept': 'application/json' } });
                if (response.ok) { alert("Votre cahier des charges a bien été transmis au Bureau d'Études de FOMALHAUT.MBC. Nos ingénieurs reviennent vers vous sous 48h."); devisForm.reset(); }
                else { alert("Une erreur est survenue lors de la soumission du devis."); }
            } catch (error) { alert("Erreur de connexion."); }
            finally { button.innerText = "Soumettre le projet pour étude"; button.disabled = false; }
        });
    }

    // 6. FORMULAIRE D'URGENCE INTERVENTION DEPANNAGE AVAL
    const interventionForm = document.getElementById("fomalhaut-intervention");
    if (interventionForm) {
        interventionForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const button = interventionForm.querySelector(".btn-urgence");
            const originalText = button.innerText;
            button.innerText = "ALERTE EN COURS D'ENVOI...";
            button.disabled = true;
            const data = new FormData(interventionForm);
            try {
                const response = await fetch(interventionForm.action, { method: interventionForm.method, body: data, headers: { 'Accept': 'application/json' } });
                if (response.ok) { alert("⚠️ DEMANDE DE DÉPANNAGE ENREGISTRÉE : Votre demande d'intervention d'urgence sur vos installations intérieures (en aval du compteur SENELEC) a bien été envoyée. Nos techniciens d'astreinte basés à Kounoune analysent vos données."); interventionForm.reset(); }
                else { alert("Échec de l'envoi. Appelez le +221 78 756 98 00."); }
            } catch (error) { alert("Erreur réseau. Composez le +221 78 756 98 00."); }
            finally { button.innerText = originalText; button.disabled = false; }
        });
    }
});
