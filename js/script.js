var notice = document.getElementById("notice");
var directionBlocks = document.querySelectorAll("#directions article");
var details = document.getElementById("details");
var fieldBlocks = document.getElementsByClassName("field-details");
var understood = false;
var laws = [
    ["Закон України «Про оборону України»", "Закон України «Про державну таємницю», ст. 8", "Закон України «Про національну безпеку України»"],
    ["Основи законодавства про охорону здоров'я, ст. 40 (лікарська таємниця)", "Закон України «Про захист персональних даних», ст. 6", "Регламент ЄС 2016/679 (GDPR), ст. 5"],
    ["Закон України «Про інформацію», ст. 21", "Закон України «Про доступ до публічної інформації», ст. 6", "Закон України «Про захист персональних даних»"],
    ["Регламент ЄС 2024/1689 (AI Act), ст. 5", "Закон України «Про захист персональних даних», ст. 6", "Закон України «Про національну безпеку України»"]
];

var colorPattern = /rgba?\((\d+), (\d+), (\d+)(, [\d.]+)?\)/g;

function typeText(element, text, delay) {
    var i = 0;

    function addLetter() {
        i++;
        element.textContent = text.slice(0, i);
        if (i < text.length) {
            setTimeout(addLetter, delay);
        }
    }

    addLetter();
}

function darkenMatch(all, r, g, b, a) {
    var alpha = a || "";
    return "rgb" + (a ? "a" : "") + "(" + Math.round(r * 0.6) + ", " + Math.round(g * 0.6) + ", " + Math.round(b * 0.6) + alpha + ")";
}

function darkenAll() {
    var all = document.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
        var style = getComputedStyle(all[i]);
        if (style.backgroundColor !== "rgba(0, 0, 0, 0)") {
            all[i].style.backgroundColor = style.backgroundColor.replace(colorPattern, darkenMatch);
        }
        if (style.backgroundImage !== "none") {
            all[i].style.backgroundImage = style.backgroundImage.replace(colorPattern, darkenMatch);
        }
    }
}

function onPageLoaded() {
    var hour = new Date().getHours();
    var isNight = hour >= 21 || hour < 6 || location.search.indexOf("night") !== -1;
    if (notice && isNight) {
        darkenAll();
    }
}

function confirmHome() {
    return confirm("Перейти на головну сторінку?");
}

function toggleFlip(event) {
    event.currentTarget.classList.toggle("flipped");
}

function makeFlip(photo, lawList) {
    var flip = document.createElement("div");
    var inner = document.createElement("div");
    var back = document.createElement("div");
    var title = document.createElement("h4");
    var list = document.createElement("ul");

    flip.className = "flip";
    inner.className = "flip-inner";
    back.className = "flip-back";
    title.textContent = "Законодавство";

    for (var i = 0; i < lawList.length; i++) {
        var item = document.createElement("li");
        item.textContent = lawList[i];
        list.appendChild(item);
    }

    photo.parentNode.replaceChild(flip, photo);
    photo.classList.add("flip-front");
    back.appendChild(title);
    back.appendChild(list);
    inner.appendChild(photo);
    inner.appendChild(back);
    flip.appendChild(inner);
    flip.addEventListener("click", toggleFlip);
}

function showWarning() {
    var overlay = document.createElement("div");
    overlay.className = "modal";
    overlay.innerHTML =
        '<div class="modal-box">' +
        "<h3>Попередження</h3>" +
        "<p>Інформація про цей напрям може бути конфіденційною та підпадає під обмеження законодавства і воєнного стану. " +
        "Для продовження підтвердіть, що розумієте це: введіть слово «Розумію».</p>" +
        '<input type="text" placeholder="Розумію">' +
        '<p class="modal-error"></p>' +
        "<button>Підтвердити</button>" +
        "</div>";
    document.body.appendChild(overlay);

    var input = overlay.querySelector("input");
    var error = overlay.querySelector(".modal-error");
    var button = overlay.querySelector("button");

    function check() {
        if (input.value.trim().toLowerCase() === "розумію") {
            understood = true;
            overlay.parentNode.removeChild(overlay);
        } else {
            error.textContent = "Підтвердження не прийнято. Введіть слово «Розумію».";
        }
    }

    function clearError() {
        error.textContent = "";
    }

    function onEnter(event) {
        if (event.key === "Enter") {
            check();
        }
    }

    button.onclick = check;
    input.addEventListener("input", clearError);
    input.addEventListener("keydown", onEnter);
    input.focus();
}

function onBlockEnter() {
    if (!understood && !document.querySelector(".modal")) {
        showWarning();
    }
}


function showTip() {
    var tip = document.createElement("span");
    tip.className = "tooltip";
    tip.textContent = "Дякуючи Вам, ми стаємо кращі! Конкретизуйте мету звернення, будь ласка";
    details.classList.add("hover");
    fieldBlocks[0].appendChild(tip);
}

function hideTip() {
    var tip = document.querySelector(".tooltip");
    details.classList.remove("hover");
    if (tip) {
        tip.parentNode.removeChild(tip);
    }
}

function init() {
    if (notice) {
        typeText(notice, "Увага: з 25 грудня по 7 січня офіс закритий на різдвяні та новорічні канікули.", 70);
    }

    for (var i = 0; i < directionBlocks.length; i++) {
        makeFlip(directionBlocks[i].querySelector("img"), laws[i]);
        directionBlocks[i].addEventListener("mouseenter", onBlockEnter);
    }

    if (details) {
        details.addEventListener("mouseenter", showTip);
        details.addEventListener("mouseleave", hideTip);
    }
}

document.addEventListener("DOMContentLoaded", init);
window.onload = onPageLoaded;
