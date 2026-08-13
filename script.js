// Configurazione Firebase (da mettere IN CIMA a script.js)
const firebaseConfig = {
  apiKey: "AIzaSyC8XNpPwDLJXPyTJLbQr5vfpXdA27YARvw",
  authDomain: "login-9bace.firebaseapp.com",
  projectId: "login-9bace",
  storageBucket: "login-9bace.firebasestorage.app",
  messagingSenderId: "750647370002",
  appId: "1:750647370002:web:340e7552852bf0e6d0d3cb",
  measurementId: "G-4CV1N6JHWY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    const prices = {
        plan: {
            basic: { name: 'Basic (Start)', price: 450, type: 'one-time' },
            avanzato: { name: 'Avanzato', price: 650, type: 'one-time' },
            business: { name: 'Business', price: 1100, type: 'one-time' }
        },
        sub_dati: {
            nessuno: { name: 'Nessuno', price: 0 },
            base: { name: 'Dati - Base', price: 250 },
            avanzato: { name: 'Dati - Avanzato', price: 400 }
        },
        sub_vetrina: {
            nessuno: { name: 'Nessuno', price: 0 },
            base: { name: 'Vetrina - Base', price: 70 },
            avanzata: { name: 'Vetrina - Avanzata', price: 120 }
        },
        sub_news: {
            nessuna: { name: 'Nessuna', price: 0 },
            base: { name: 'News Base', price: 150 },
            pro: { name: 'News Pro', price: 300 },
            avanzate: { name: 'News Avanzate', price: 500 }
        },
        extra_front: {
            nessuno: { name: 'Nessuna', price: 0 },
            sec1: { name: 'Modifica 1 sezione', price: 45 },
            sec3: { name: 'Modifica 3 sezioni', price: 120 },
            sec5: { name: 'Modifica 5 sezioni', price: 200 },
            restyle: { name: 'Re-style grafico', price: 50 },
            newsec: { name: 'Nuova sezione', price: 100 }
        },
        extra_back: {
            nessuno: { name: 'Nessuna', price: 0 },
            minore: { name: 'Bug minore', price: 100 },
            medio: { name: 'Bug medio', price: 150 },
            medioalto: { name: 'Bug medio-alto', price: 200 }
        },
        extra_analytics: {
            nessuno: { name: 'Non richiesto', price: 0 },
            si: { name: 'Analytics & Tracking', price: 250 }
        },
        extra_ads: {
            nessuno: { name: 'Nessuna campagna', price: 0 },
            ads500: { name: 'Meta Ads (fino a 500€)', price: 0 },
            ads1000: { name: 'Meta Ads (fino a 1.000€)', price: 0 },
            ads2000: { name: 'Meta Ads (fino a 2.000€)', price: 0 },
            ads4000: { name: 'Meta Ads (oltre 4.000€)', price: 0 }
        },
        extra_news: {
            nessuna: { name: 'Nessuna', price: 0 },
            n1: { name: '1 newsletter extra', price: 80 },
            n2: { name: '2 newsletter extra', price: 150 },
            n3: { name: '3 newsletter extra', price: 220 }
        },
        addon_multi: {
            nessuno: { name: 'Non richiesto', price: 0 },
            si: { name: 'Multilingua', price: 30 }
        },
        addon_dominio: {
            nessuno: { name: 'Non richiesto', price: 0 },
            si: { name: 'Dominio personalizzato', price: 20, recurring: true },
            gia_abbonato: { name: 'Dominio (già abbonato)', price: 0 }
        }
    };

    const setElemText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setElemText('price-plan-basic', `€${prices.plan.basic.price}`);
    setElemText('price-plan-avanzato', `€${prices.plan.avanzato.price}`);
    setElemText('price-plan-business', `€${prices.plan.business.price}`);
    
    setElemText('price-dati-base', `€${prices.sub_dati.base.price}/mese`);
    setElemText('price-dati-avanzato', `€${prices.sub_dati.avanzato.price}/mese`);
    
    setElemText('price-vetrina-base', `€${prices.sub_vetrina.base.price}/mese`);
    setElemText('price-vetrina-avanzata', `€${prices.sub_vetrina.avanzata.price}/mese`);
    
    setElemText('price-news-base', `€${prices.sub_news.base.price}/mese`);
    setElemText('price-news-pro', `€${prices.sub_news.pro.price}/mese`);
    setElemText('price-news-avanzate', `€${prices.sub_news.avanzate.price}/mese`);
    
    setElemText('price-analytics-si', `€${prices.extra_analytics.si.price}`);
    setElemText('price-multi-si', `€${prices.addon_multi.si.price}`);
    setElemText('price-dominio-si', `€${prices.addon_dominio.si.price}/mese`);

    const form = document.getElementById('webly-configurator');
    if (!form) return;

    function updateSummary() {
        const formData = new FormData(form);

        let pianoKey = formData.get('plan');
        let subDatiKey = formData.get('sub_dati');
        let subVetrinaKey = formData.get('sub_vetrina');
        let subNewsKey = formData.get('sub_news');
        let extraFrontKey = formData.get('extra_front');
        let extraBackKey = formData.get('extra_back');
        let extraAnalyticsKey = formData.get('extra_analytics');
        let extraAdsKey = formData.get('extra_ads');
        let extraNewsKey = formData.get('extra_news');
        let addonMultiKey = formData.get('addon_multi');
        let addonDominioKey = formData.get('addon_dominio');

        let totaleIniziale = 0;
        let totaleMensile = 0;

        let pianoHtml = '<li>Nessun piano selezionato</li>';
        let abbonamentiHtml = '';
        let extraHtml = '';

        if (pianoKey && prices.plan[pianoKey]) {
            const p = prices.plan[pianoKey];
            totaleIniziale += p.price;
            pianoHtml = `<li><span class="item-name">${p.name}</span><span class="item-cost">€${p.price}</span></li>`;
        }

        let subCount = 0;
        if (subDatiKey && subDatiKey !== 'nessuno' && prices.sub_dati[subDatiKey]) {
            const s = prices.sub_dati[subDatiKey];
            totaleMensile += s.price;
            abbonamentiHtml += `<li><span class="item-name">${s.name}</span><span class="item-cost">€${s.price}/mese</span></li>`;
            subCount++;
        }
        if (subVetrinaKey && subVetrinaKey !== 'nessuno' && prices.sub_vetrina[subVetrinaKey]) {
            const s = prices.sub_vetrina[subVetrinaKey];
            totaleMensile += s.price;
            abbonamentiHtml += `<li><span class="item-name">${s.name}</span><span class="item-cost">€${s.price}/mese</span></li>`;
            subCount++;
        }
        if (subNewsKey && subNewsKey !== 'nessuna' && prices.sub_news[subNewsKey]) {
            const s = prices.sub_news[subNewsKey];
            totaleMensile += s.price;
            abbonamentiHtml += `<li><span class="item-name">${s.name}</span><span class="item-cost">€${s.price}/mese</span></li>`;
            subCount++;
        }

        if (addonDominioKey === 'si') {
            totaleMensile += prices.addon_dominio.si.price;
            abbonamentiHtml += `<li><span class="item-name">Dominio personalizzato</span><span class="item-cost">€20/mese</span></li>`;
            subCount++;
        } else if (addonDominioKey === 'gia_abbonato') {
            abbonamentiHtml += `<li><span class="item-name">Dominio personalizzato</span><span class="item-cost">Gratuito</span></li>`;
        }

        if (subCount === 0 && addonDominioKey === 'nessuno') {
            abbonamentiHtml = '<li>Nessuno</li>';
        }

        let extraCount = 0;
        if (extraFrontKey && extraFrontKey !== 'nessuno' && prices.extra_front[extraFrontKey]) {
            const e = prices.extra_front[extraFrontKey];
            totaleIniziale += e.price;
            extraHtml += `<li><span class="item-name">${e.name}</span><span class="item-cost">€${e.price}</span></li>`;
            extraCount++;
        }
        if (extraBackKey && extraBackKey !== 'nessuno' && prices.extra_back[extraBackKey]) {
            const e = prices.extra_back[extraBackKey];
            totaleIniziale += e.price;
            extraHtml += `<li><span class="item-name">${e.name}</span><span class="item-cost">€${e.price}</span></li>`;
            extraCount++;
        }
        if (extraAnalyticsKey === 'si') {
            const e = prices.extra_analytics.si;
            totaleIniziale += e.price;
            extraHtml += `<li><span class="item-name">${e.name}</span><span class="item-cost">€${e.price}</span></li>`;
            extraCount++;
        }
        if (extraAdsKey && extraAdsKey !== 'nessuno') {
            extraHtml += `<li><span class="item-name">Meta Ads</span><span class="item-cost">Commissione %</span></li>`;
            extraCount++;
        }
        if (extraNewsKey && extraNewsKey !== 'nessuna' && prices.extra_news[extraNewsKey]) {
            const e = prices.extra_news[extraNewsKey];
            totaleIniziale += e.price;
            extraHtml += `<li><span class="item-name">${e.name}</span><span class="item-cost">€${e.price}</span></li>`;
            extraCount++;
        }
        if (addonMultiKey === 'si') {
            const e = prices.addon_multi.si;
            totaleIniziale += e.price;
            extraHtml += `<li><span class="item-name">${e.name}</span><span class="item-cost">€${e.price}</span></li>`;
            extraCount++;
        }

        if (extraCount === 0) {
            extraHtml = '<li>Nessuno</li>';
        }

        const sumPiano = document.getElementById('sum-piano');
        const sumAbb = document.getElementById('sum-abbonamenti');
        const sumExt = document.getElementById('sum-extra');
        const totInit = document.getElementById('totale-iniziale');
        const totMon = document.getElementById('totale-mensile');

        if (sumPiano) sumPiano.innerHTML = pianoHtml;
        if (sumAbb) sumAbb.innerHTML = abbonamentiHtml;
        if (sumExt) sumExt.innerHTML = extraHtml;
        if (totInit) totInit.textContent = `€${totaleIniziale}`;
        if (totMon) totMon.textContent = `€${totaleMensile}/mese`;
    }

    form.addEventListener('input', updateSummary);
    form.addEventListener('change', updateSummary);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const statusDiv = document.getElementById('form-status');

        // Controllo Login forzato
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            if (statusDiv) {
                statusDiv.className = 'form-status error';
                statusDiv.textContent = 'Devi effettuare il login per poter inviare il form.';
                statusDiv.classList.remove('hidden');
            } else {
                alert('Devi effettuare il login per poter inviare il form.');
            }
            return; // Blocca l'invio qui!
        }

        const submitBtn = document.getElementById('btn-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Invio in corso...';
        }

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                if (statusDiv) {
                    statusDiv.className = 'form-status success';
                    statusDiv.textContent = 'Richiesta inviata con successo! Ti ricontatteremo presto.';
                    statusDiv.classList.remove('hidden');
                }
                form.reset();
                updateSummary();
            } else {
                throw new Error('Errore del server');
            }
        } catch (error) {
            if (statusDiv) {
                statusDiv.className = 'form-status error';
                statusDiv.textContent = "C'è stato un errore durante l'invio. Riprova più tardi.";
                statusDiv.classList.remove('hidden');
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Invia richiesta';
            }
        }
    });

    updateSummary();
});
