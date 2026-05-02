/* ============================================ */
/* URL-UL GOOGLE SHEETS */
/* ============================================ */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyySX0SJ9AxPz5VYh-mJgYLqls1UThlSE61J2qFQkjF4b_IG1f4OJA8mpWJdzR6Y3SC/exec";

/* MENU */
function toggleMenu(){
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    sideMenu.classList.toggle("active");
    overlay.classList.toggle("active");
}
function closeMenu(){
    const sideMenu = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
}

/* HARTĂ */
function openMap(location) {
    if(location === 'church') {
        window.open('https://www.google.com/maps?q=Biserica+Sfântul+Elefterie+București&ll=44.434243,26.076086&z=16', '_blank');
    } else if(location === 'venue') {
        window.open('https://www.google.com/maps?q=Signature+Events+București&ll=44.446853,26.130552&z=16', '_blank');
    }
}

/* TIMER */
const target = new Date("2026-08-23T18:00:00").getTime();

function updateCountdown() {
    const now = Date.now();
    const diff = target - now;
    
    if(diff <= 0) {
        document.getElementById('countdownWrapper').innerHTML = '<div style="font-size:1.5rem;">Evenimentul a început! 🎉</div>';
        return;
    }
    
    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const totalDays = Math.floor(totalHours / 24);
    const days = totalDays % 30.44;
    const months = Math.floor(totalDays / 30.44);
    
    const timerUnits = [];
    
    if (months > 0) {
        timerUnits.push({ label: "LUNI", value: months });
    }
    if (days > 0 || months > 0) {
        const daysToShow = Math.floor(days);
        if (daysToShow > 0 || months > 0) {
            timerUnits.push({ label: "ZILE", value: daysToShow });
        }
    }
    if (hours > 0 || days > 0 || months > 0) {
        timerUnits.push({ label: "ORE", value: hours });
    }
    timerUnits.push({ label: "MIN", value: minutes });
    timerUnits.push({ label: "SEC", value: seconds });
    
    const html = timerUnits.map(item => `
        <div class="timer-item">
            <div class="timer-label">${item.label}</div>
            <div class="timer-circle">
                <div class="timer-number">${item.value}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('countdownWrapper').innerHTML = html;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* FORMULAR */
let selectedPersoane = 0;
const particip = document.getElementById('particip');
const restForm = document.getElementById('restForm');
const persoaneContainer = document.getElementById('persoaneContainer');
const numePrincipal = document.getElementById('numePrincipal');
const parcareSelect = document.getElementById('parcareSelect');
const parcareInput = document.getElementById('parcareInput');
const rsvpForm = document.getElementById('rsvpForm');
const successMessage = document.getElementById('successMessage');
const confirmareSection = document.getElementById('confirmare');

if(particip) {
    particip.onchange = () => {
        restForm.style.display = particip.value === "Da" ? "block" : "none";
        if(persoaneContainer) persoaneContainer.innerHTML = "";
        selectedPersoane = 0;
        document.querySelectorAll(".persoane-btns button").forEach(b => b.classList.remove("active"));
    };
}

window.selectPersoane = function(n, el) {
    selectedPersoane = n;
    document.querySelectorAll(".persoane-btns button").forEach(b => b.classList.remove("active"));
    el.classList.add("active");
    
    if(persoaneContainer) {
        persoaneContainer.innerHTML = "";
        let numeAuto = numePrincipal ? numePrincipal.value : "";
        
        for(let i = 1; i <= n; i++) {
            let val = (i === 1 && numeAuto) ? numeAuto : "";
            persoaneContainer.innerHTML += `
                <input class="pers-nume" value="${val.replace(/"/g, '&quot;')}" placeholder="Nume invitat ${i}" style="margin-top:10px;">
                <select class="pers-meniu" style="margin-top:5px;">
                    <option value="" disabled selected>Tip meniu</option>
                    <option value="normal">Meniu normal</option>
                    <option value="vegan">Meniu vegan</option>
                    <option value="copil">Meniu copil</option>
                </select>
            `;
        }
    }
};

if(parcareSelect) {
    parcareSelect.onchange = () => {
        if(parcareInput) {
            parcareInput.style.display = parcareSelect.value === "da" ? "block" : "none";
        }
    };
}

/* FUNCȚIE PENTRU A ARĂTA FUNDALUL DE MULȚUMIRE */
function showThankYouScreen() {
    // Ascunde formularul
    if(rsvpForm) rsvpForm.style.display = "none";
    
    // Arată mesajul de succes
    if(successMessage) successMessage.style.display = "block";
    
    // Adaugă fundalul de mulțumire
    document.body.classList.add('thankyou-background');
    
    // Ascunde elementele inutile din secțiunea confirmare
    const confirmareIntro = document.querySelector('.confirmare-intro');
    if(confirmareIntro) confirmareIntro.style.display = "none";
    
    const confirmareTitle = document.querySelector('.confirmare h2');
    if(confirmareTitle) confirmareTitle.style.display = "none";
    
    // Derulează la mesaj
    setTimeout(() => {
        if(confirmareSection) {
            confirmareSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

if(rsvpForm) {
    rsvpForm.addEventListener("submit", e => {
        e.preventDefault();
        
        // ARĂTĂ IMAGINEA IMEDIAT, INDIFERENT DE OPȚIUNE
        showThankYouScreen();
        
        let data = new FormData();
        
        if(particip.value === "Nu") {
            data.append("particip", "Nu");
            data.append("nume", numePrincipal ? numePrincipal.value : "");
            data.append("adulti", "0");
            data.append("copii", "0");
            data.append("vegan", "");
            data.append("parcare", "");
            data.append("mesaj", document.getElementById('mesaj') ? document.getElementById('mesaj').value : "");
        } else {
            let numeList = [];
            let meniuList = [];
            let copiiCount = 0;
            
            document.querySelectorAll(".pers-nume").forEach(el => {
                if(el.value) numeList.push(el.value);
            });
            
            document.querySelectorAll(".pers-meniu").forEach(el => {
                if(el.value && el.value !== "") {
                    meniuList.push(el.value);
                    if(el.value === "copil") copiiCount++;
                }
            });
            
            data.append("particip", "Da");
            data.append("nume", numeList.join(", "));
            data.append("adulti", selectedPersoane.toString());
            data.append("copii", copiiCount.toString());
            data.append("vegan", meniuList.join(", "));
            data.append("parcare", parcareInput ? parcareInput.value : "");
            data.append("mesaj", document.getElementById('mesaj') ? document.getElementById('mesaj').value : "");
        }
        
        // Trimite datele în fundal (fără să așteptăm răspunsul)
        fetch(SCRIPT_URL, { method: "POST", body: data })
            .catch(error => console.error("Error:", error));
    });
}
