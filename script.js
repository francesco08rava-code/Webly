document.addEventListener('DOMContentLoaded', () => {
    // Definizione dei prezzi
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
            ads500: { name: 'Meta Ads (fino a 500€)', price: 0 }, // Gestione a percentuale
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

    // Popola i prezzi nelle card radio del form
    document.getElementById('price-plan-basic').textContent = `€${prices.plan.basic.price}`;
    document.getElementById('price-plan-avanzato').textContent = `€${prices.plan.avanzato.price}`;
    document.getElementById('price-plan-business').textContent = `€${prices.plan.business.price}`;
    
    document.getElementById('price-dati-base').textContent = `€${prices.sub_dati.base.price}/mese`;
    document.getElementById('price-dati-avanzato').textContent = `€${prices.sub_dati.avanzato.price}/mese`;
    
    document.getElementById('price-vetrina-base').textContent = `€${prices.sub_vetrina.base.price}/mese`;
    document.getElementById('price-vetrina-avanzata').textContent = `€${prices.sub_vetrina.avanzata.price}/mese`;
    
    document.getElementById('price-news-base').textContent = `€${prices.sub_news.base.price}/mese`;
    document.getElementById('price-news-pro').textContent = `€${prices.sub_news.pro.price}/mese`;
    document.getElementById('price-news-avanzate').textContent = `€${prices.sub_news.avanzate.price}/mese`;
    
    document.getElementById('price-analytics-si').textContent = `€${prices.extra_analytics.si.price}`;
    document.getElementById('price-multi-si').textContent = `€${prices.addon_multi.si.price}`;
    document.getElementById('price-dominio-si').textContent = `€${prices.addon_dominio.si.price}/mese`;

    const form = document.getElementById('webly-configurator');

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

        // HTML Riepilogo
        let pianoHtml = '<li>Nessun piano selezionato</li>';
        let abbonamentiHtml = '';
        let extraHtml = '';

        // 1. Piano
        if (pianoKey && prices.plan[pianoKey]) {
            const p = prices.plan[pianoKey];
            totaleIniziale += p.price;
            pianoHtml = `<li><span class="item-name">${p.name}</span><span class="item-cost">€${p.price}</span></li>`;
        }

        // 2. Abbonamenti
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

        // Dominio ricorrente se selezionato e non gratuito per abbonamento
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

        // 3. Extra & Add-on (Una tantum)
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

        // Aggiorna DOM
        document.getElementById('sum-piano').innerHTML = pianoHtml;
        document.getElementById('sum-abbonamenti').innerHTML = abbonamentiHtml;
        document.getElementById('sum-extra').innerHTML = extraHtml;
        document.getElementById('totale-iniziale').textContent = `€${totaleIniziale}`;
        document.getElementById('totale-mensile').textContent = `€${totaleMensile}/mese`;
    }

    // Ascoltatore di eventi su tutto il form per ricalcolare in tempo reale
    form.addEventListener('input', updateSummary);
    form.addEventListener('change', updateSummary);

    // Gestione invio form
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const statusDiv = document.getElementById('form-status');
        statusDiv.className = 'form-status success';
        statusDiv.textContent = 'Richiesta inviata con successo! Ti ricontatteremo presto.';
        statusDiv.classList.remove('hidden');
        form.reset();
        updateSummary();
    });

    // Inizializzazione al caricamento
    updateSummary();
});