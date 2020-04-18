"use strict";
/** Идеи: можно сделать форму регистрации, и если залогинен админ, то будет возможность добавлять новых сотрудников.
 ** Данные по людям вынести в БД Mongo и прикрутить к проекту. */
var depts = [
    {id: 0, name: "Developers Management", parentId: null},
    {id: 1, name: `Lead Developers`, parentId: 0},
    {id: 2, name: `Developers`, parentId: 1},
    {id: 3, name: `Testers Management`, parentId: null},
    {id: 4, name: `Lead Testers`, parentId: 3},
    {id: 5, name: `Testers`, parentId: 4},
];

function getTree(items) {
    items.forEach((firstLevel) => {
        if (firstLevel.parentId !== null) {
            items.forEach((secondLevel) => {
                if (secondLevel.id === firstLevel.parentId) {
                    if (!secondLevel.children) {
                        secondLevel.children = [];
                    }
                    secondLevel.children.push(firstLevel);
                }
            })
        }
    });
    return items.filter(item => item.parentId === null);
}

// Left
var hrTree = document.getElementsByClassName(`hr__tree`)[0];
const traverseTree = (elements, parentEl) => {
    if (!elements) {
        return;
    }
    elements.forEach((el) => {
        let liEl = document.createElement(`li`);
        liEl.innerHTML = `<i class="fas fa-chevron-down"></i> ${el.name}`;
        parentEl.appendChild(liEl);
        liEl.dataset.id = el.id;
        if (el.children) {
            let ulEl = document.createElement(`ul`);
            liEl.appendChild(ulEl);
            traverseTree(el.children, ulEl);
        } else {
            liEl.innerHTML = `${el.name}`;
        }
    })
};
traverseTree(getTree(depts), hrTree);


// Right
let hrItem2 = document.getElementsByClassName(`hr__item`)[1],
    table = document.createElement(`table`),
    curRate = 1;

// THEAD
const makeTableHead = (parentElement) => {
    let thead = document.createElement(`thead`),
        tRow = document.createElement(`tr`),
        ths = [],
        headerText = [`ID`, `Name`, `Telephone`, `Salary`];

    parentElement.appendChild(table);
    table.appendChild(thead);
    thead.appendChild(tRow);

    for (let i = 0; i < headerText.length; i++) {
        ths.push(document.createElement(`th`));
    }

    ths.forEach((elem, index) => {
        tRow.appendChild(elem);
        elem.innerText = headerText[index];
    });

    table.classList.add(`hr__table`);
};
makeTableHead(hrItem2);


var hrItem1 = document.getElementsByClassName(`hr__item`)[0];

var resetButton = document.createElement(`button`);
resetButton.innerText = `Reset`;

const removeNode = (node) => {
    if (node) {
        node.remove();
    }
};

var lastEventTarget = null;

function getData(id) {
    if (id) {
        return fetch(`./departments/${id}_department.json`)
            .then(resp => resp.json());
    }
}

function addDataInTable(event) {
    lastEventTarget = event.target;
    if (event.target.dataset.id) {
        getData(event.target.dataset.id)
            .then(employers => {
                let tbody = document.createElement(`tbody`);
                table.appendChild(tbody);
                employers.forEach((emp) => {
                    let tr = document.createElement(`tr`);
                    tbody.append(tr);
                    let tds = [];
                    for (let i = 0; i < 4; i++) {
                        tds.push(document.createElement(`td`));
                    }
                    tr.append(...tds);
                    // можно пробежаться по массиву headerText = [`ID`, `Name`, `Telephone`, `Salary`];
                    // т.е. изначально его определив как и ключи в объекте имплоера типа
                    // ['id', 'name', 'telephone', 'salary']
                    // но при построении дерева определи еще один map типа
                    // let a = {'id': 'ID', 'name': 'Name'}
                    // а тут просто проверять salary это или нет, так как если добавть еще одно поле,
                    // придется писать еще один случай. это называется говнокод
                    tds.forEach((elem, index) => {
                        switch (index) {
                            case 0:
                                elem.innerText = `${emp.id}`;
                                break;
                            case 1:
                                elem.innerText = `${emp.name}`;
                                break;
                            case 2:
                                elem.innerText = `${emp.tel}`;
                                break;
                            case 3:
                                elem.innerText = `${(emp.salary / curRate).toFixed(2)}`;
                                break;
                        }
                    });
                });
            });
    }
}

var otherLastEventTarget = null;
// норм но лучше шеврон не выделять)
const makeTextGold = (event) => {
    if (!otherLastEventTarget) {
        otherLastEventTarget = event.target;
        event.target.style.color = "gold";
        event.cancelBubble = true;
    } else if (otherLastEventTarget !== event.target) {
        otherLastEventTarget.style.color = "black";
        event.target.style.color = "gold";
        otherLastEventTarget = event.target;
        event.cancelBubble = true;
    } else {
        otherLastEventTarget.style.color = "black";
        event.target.style.color = "gold";
        event.cancelBubble = true;
    }
};

hrItem1.addEventListener(`click`, (event) => {
    if (document.getElementsByTagName(`tbody`).length > 0) {
        if (lastEventTarget !== event.target) {
            removeNode(document.getElementsByTagName(`tbody`)[0]);
            addDataInTable(event);
        }
    } else {
        addDataInTable(event);
        table.before(resetButton);
    }
});

hrItem1.addEventListener(`click`, (event) => {
    makeTextGold(event);
});

var is = document.getElementsByClassName(`fas`);
// можно просто проверить, что кликнутый элемент содержит класс fas,
// а то слишком много листенеров вешается, лучше на корневом обрабатывать
for (let i = 0; i < is.length; i++) {
    is[i].addEventListener(`click`, (event) => {
        if (event.target.classList.contains(`fa-chevron-down`) && event.target.nextElementSibling) {
            event.target.nextElementSibling.style.display = 'none';
            event.target.classList.remove(`fa-chevron-down`);
            event.target.classList.add(`fa-chevron-right`);
        } else if (event.target.classList.contains(`fa-chevron-right`) && event.target.nextElementSibling) {
            event.target.nextElementSibling.style.display = 'block';
            event.target.classList.remove(`fa-chevron-right`);
            event.target.classList.add(`fa-chevron-down`);
        }
    })
}

resetButton.addEventListener(`click`, (event) => {
    removeNode(document.getElementsByTagName(`tbody`)[0]);
});

let select = document.createElement(`select`);
table.before(select);

let mapCurrencies = new Map([
    ['BYN', 1],
    ['USD', 145],
    ['EUR', 292],
    ['RUB', 298]
]);
let options = [];
for (let currency of mapCurrencies.keys()) {
    let option = document.createElement(`option`);
    options.push(option);
    option.innerText = currency;
}
options[0].selected = true;
select.append(...options);

const getCurRate = (id) => {
    return fetch(`http://www.nbrb.by/API/ExRates/Rates/${id}`)
        .then(function (response) {
            return response.json();
        })
};

select.addEventListener(`change`, (event) => {
    if (document.getElementsByTagName(`tbody`).length > 0) {
        let tbodyChildren = document.getElementsByTagName(`tbody`)[0].children;
        if (tbodyChildren.length > 0) {
            if (select.value === 'BYN') {
                curRate = 1;
                getData(otherLastEventTarget.dataset.id)
                    .then(employers => {
                        for (let i = 0; i < tbodyChildren.length; i++) {
                            let emplSalary = employers[i]['salary'].toFixed(2);
                            tbodyChildren[i].lastElementChild.innerText = `${emplSalary}`;
                        }
                    });
            } else {
                getCurRate(mapCurrencies.get(select.value))
                    .then((result) => {
                        if (select.value === 'RUB') {
                            curRate = result.Cur_OfficialRate / 100;
                            getData(otherLastEventTarget.dataset.id)
                                .then(employers => {
                                    for (let i = 0; i < tbodyChildren.length; i++) {
                                        let emplSalary = (employers[i]['salary'] / result.Cur_OfficialRate * 100).toFixed(2);
                                        tbodyChildren[i].lastElementChild.innerText = `${emplSalary}`;
                                    }
                                })
                        } else {
                            curRate = result.Cur_OfficialRate;
                            getData(otherLastEventTarget.dataset.id)
                                .then(employers => {
                                    for (let i = 0; i < tbodyChildren.length; i++) {
                                        let emplSalary = (employers[i]['salary'] / result.Cur_OfficialRate).toFixed(2);
                                        tbodyChildren[i].lastElementChild.innerText = `${emplSalary}`;
                                    }
                                })
                        }
                    })
            }
        }
    } else {
        if (select.value === 'BYN') {
            curRate = 1;
        } else {
            getCurRate(mapCurrencies.get(select.value))
                .then((result) => {
                    if (select.value === 'RUB') {
                        curRate = result.Cur_OfficialRate / 100;
                    } else {
                        curRate = result.Cur_OfficialRate;
                    }
                })
        }
    }
});