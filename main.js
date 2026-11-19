var directions = [
    { id: 1, name: "Оборонна аналітика", department: "Відділ оборонної аналітики", govText: "Співпраця з Міністерством оборони", readersDay1: 120, readersDay2: 95, duration: { value: 3, unit: "роки" } },
    { id: 2, name: "Кібербезпека", department: "Відділ кібербезпеки", govText: "Взаємодія з Державною службою спецзв'язку", readersDay1: 210, readersDay2: 180, duration: { value: 1, unit: "роки" } },
    { id: 3, name: "Охорона здоров'я", department: "Відділ медичних даних", govText: "Співпраця з МОЗ України", readersDay1: 85, readersDay2: 70, duration: { value: 6, unit: "місяці" } },
    { id: 4, name: "Логістика постачань", department: "Відділ логістики", govText: "Узгодження з Міністерством економіки", readersDay1: 60, readersDay2: 44, duration: { value: 6, unit: "місяці" } },
    { id: 5, name: "Освітні програми", department: "Відділ освіти", govText: "Співпраця з МОН України", readersDay1: 150, readersDay2: 130, duration: { value: 2, unit: "роки" } },
    { id: 6, name: "Екологічний моніторинг", department: "Відділ екології", govText: "Звітність перед Мінекоенерго", readersDay1: 40, readersDay2: 25, duration: { value: 1, unit: "роки" } },
    { id: 7, name: "Фінансовий контроль", department: "Відділ фінансів", govText: "Взаємодія з Державною податковою службою", readersDay1: 300, readersDay2: 260, duration: { value: 3, unit: "роки" } },
    { id: 8, name: "Транспортна інфраструктура", department: "Відділ транспорту", govText: "Погодження з Мінінфраструктури", readersDay1: 95, readersDay2: 60, duration: { value: 2, unit: "роки" } },
    { id: 9, name: "Цифрові сервіси", department: "Відділ цифрових сервісів", govText: "Співпраця з Мінцифри", readersDay1: 180, readersDay2: 170, duration: { value: 1, unit: "роки" } },
    { id: 10, name: "Енергетичний нагляд", department: "Відділ енергетики", govText: "Узгодження з Національною комісією", readersDay1: 55, readersDay2: 33, duration: { value: 6, unit: "місяці" } }
];

function toMonths(duration) {
    switch (duration.unit) {
        case "роки":
            return duration.value * 12;
        case "місяці":
            return duration.value;
        default:
            return 0;
    }
}

function sortByDuration(list) {
    var copy = list.slice();
    copy.sort(function (a, b) {
        return toMonths(a.duration) - toMonths(b.duration);
    });
    return copy;
}

function averageByDuration(list) {
    var sums = {};
    var counts = {};
    for (var i = 0; i < list.length; i++) {
        var m = String(toMonths(list[i].duration));
        if (sums[m] === undefined) {
            sums[m] = 0;
            counts[m] = 0;
        }
        sums[m] += list[i].readersDay2;
        counts[m] += 1;
    }

    var result = {};
    for (var key in sums) {
        result[key] = sums[key] / counts[key];
    }
    return result;
}

function findLeastRead(list) {
    var readers = list.map(function (d) {
        return d.readersDay2;
    });
    var minValue = Math.min.apply(null, readers);
    return list[readers.indexOf(minValue)];
}

function hasAllInfo(d) {
    if (typeof d.id !== "number" || typeof d.name !== "string" || d.name.trim() === "") return false;
    if (typeof d.department !== "string" || d.department.trim() === "") return false;
    if (typeof d.govText !== "string" || d.govText.trim() === "") return false;
    if (typeof d.readersDay1 !== "number" || typeof d.readersDay2 !== "number") return false;
    if (typeof d.duration !== "object" || typeof d.duration.value !== "number" || typeof d.duration.unit === "undefined") return false;
    return true;
}

function addDirection(list, newDirection) {
    if (typeof list !== "object" || typeof newDirection !== "object") {
        return;
    }
    if (!hasAllInfo(newDirection)) {
        list.push(newDirection);
        return;
    }

    var place = 0;
    while (place < list.length && list[place].id <= newDirection.id) {
        place++;
    }
    list.splice(place, 0, newDirection);
}

function totalDuration(services) {
    if (services.length === 0) {
        return { departments: [], months: 0, longest: 0 };
    }
    var total = 0;
    var departments = [];
    var monthsList = [];

    var i = 0;
    do {
        departments.push(services[i].department);
        monthsList.push(toMonths(services[i].duration));
        i++;
    } while (i < services.length);

    if (services.length <= 3) {
        for (var j = 0; j < monthsList.length; j++) {
            total += monthsList[j];
        }
        total *= 0.95;
    } else {
        for (var k = 0; k < monthsList.length; k++) {
            total += monthsList[k] * 0.6;
        }
    }

    return {
        departments: departments,
        months: Math.round(total * 100) / 100,
        longest: Math.max.apply(null, monthsList)
    };
}

console.log("Сортування за тривалістю");
var sorted = sortByDuration(directions);
for (var i = 0; i < sorted.length; i++) {
    console.log(sorted[i].name + ": " + toMonths(sorted[i].duration) + " міс.");
}

console.log("\nСередня кількість читачів за добу_2");
var avg = averageByDuration(directions);
for (var m in avg) {
    console.log(Number(m) + " міс.: " + avg[m].toFixed(2));
}

console.log("\nНайменш читаний напрям");
var least = findLeastRead(directions);
console.log(least.name + " — " + least.department);

console.log("\nДодавання напрямів");
addDirection(directions, { id: 5.5, name: "Нова сфера", department: "Відділ X", govText: "Текст", readersDay1: 10, readersDay2: 5, duration: { value: 1, unit: "роки" } });
addDirection(directions, { id: 11, name: "Без відділу", department: "", govText: "Текст", readersDay1: 10, readersDay2: 5, duration: { value: 1, unit: "роки" } });
var ids = [];
for (var n = 0; n < directions.length; n++) ids.push(directions[n].id);
console.log("Порядок id: " + ids.join(", "));

console.log("\nТривалість послуг");
var r2 = totalDuration([directions[0], directions[1]]);
console.log("2 послуги: " + r2.months.toFixed(2) + " міс., найдовша " + r2.longest + " міс., відділи: " + r2.departments.join(", "));
var r4 = totalDuration([directions[0], directions[1], directions[2], directions[3]]);
console.log("4 послуги: " + r4.months.toFixed(2) + " міс., найдовша " + r4.longest + " міс., відділи: " + r4.departments.join(", "));


function User(lastName, firstName, age, education, purpose, date, time) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.age = Number(age);
    this.education = education;
    this.purpose = purpose;
    this.date = date;
    this.time = time;
}

User.prototype.isWorkingHours = function () {
    var hours = parseInt(this.time.slice(0, 2), 10);
    var minutes = parseInt(this.time.slice(3, 5), 10);
    var total = hours * 60 + minutes;
    return total >= 9 * 60 && total <= 17 * 60;
};

function UserList(users) {
    this.users = users;
}

UserList.prototype.contactedUntil = function (year, month, time) {
    return this.users.filter(function (u) {
        var d = new Date(u.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month && u.time <= time;
    });
};

UserList.prototype.averageAge = function () {
    var sum = 0;
    for (var i = 0; i < this.users.length; i++) {
        sum += this.users[i].age;
    }
    return sum / this.users.length;
};

UserList.prototype.classify = function () {
    var res = { middleWork: 0, elderlyOff: 0, others: 0 };
    for (var i = 0; i < this.users.length; i++) {
        var u = this.users[i];
        var middle = u.age >= 40 && u.age < 60;
        var elderly = u.age >= 60;
        if (middle && u.isWorkingHours()) {
            res.middleWork++;
        } else if (elderly && !u.isWorkingHours()) {
            res.elderlyOff++;
        } else {
            res.others++;
        }
    }
    return res;
};

UserList.prototype.sortedByName = function () {
    var copy = this.users.slice();
    copy.sort(function (a, b) {
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;
        return 0;
    });
    return copy;
};

var users = new UserList([
    new User("Шевченко", "Олена", 45, "Вища", "Уточнити умови співпраці", "2026-10-05", "10:30"),
    new User("Бондаренко", "Іван", 67, "Середня", "Скарга на сайт", "2026-10-12", "19:45"),
    new User("Коваленко", "Марія", 52, "Вища", "Пропозиція партнерства", "2026-10-20", "14:15"),
    new User("Мельник", "Петро", 71, "Середня спеціальна", "Запит на інформацію", "2026-10-22", "08:50"),
    new User("Ткаченко", "Анна", 29, "Вища", "Відгук про напрям", "2026-10-25", "11:00"),
    new User("Гриценко", "Олег", 63, "Вища", "Консультація", "2026-11-01", "21:10"),
    new User("Савченко", "Ірина", 48, "Вища", "Технічна проблема", "2026-11-02", "16:30"),
    new User("Лисенко", "Василь", 55, "Середня", "Питання щодо послуг", "2026-09-18", "09:05"),
    new User("Очеретько", "Наталія", 38, "Вища", "Заявка на участь", "2026-10-03", "18:20"),
    new User("Задорожній", "Юрій", 66, "Вища", "Скарга на відповідь", "2026-10-15", "12:00")
]);

console.log("\nЗвернулись у жовтні до 15:00");
var early = users.contactedUntil(2026, 10, "15:00");
for (var e = 0; e < early.length; e++) {
    console.log(early[e].lastName + " " + early[e].firstName + ", число " + new Date(early[e].date).getDate() + ", " + early[e].time);
}

console.log("\nСередній вік");
console.log(Math.round(users.averageAge() * 10) / 10);

console.log("\nКласи");
var cls = users.classify();
console.log("Середній вік + робочий час: " + cls.middleWork);
console.log("Похилий вік + неробочий час: " + cls.elderlyOff);
console.log("Інші: " + cls.others);

console.log("\nЗа алфавітом");
var byName = users.sortedByName();
for (var s = 0; s < byName.length; s++) {
    console.log(byName[s].lastName.toUpperCase() + " " + byName[s].firstName.slice(0, 1) + ".: " + byName[s].purpose);
}
