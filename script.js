"use strict";

var urls = [
    './departments/0_department.json',
    './departments/1_department.json',
    './departments/2_department.json',
    './departments/3_department.json',
    './departments/4_department.json',
    './departments/5_department.json'
];
var requests = urls.map(url => {
    return fetch(url).then(resp => resp.json());
});
var employers = Promise.all(requests)
    .then(responses => {
        return responses.reduce((acc, emp) => {
            emp.forEach(el => {
                acc.push(el);
            });
            return acc;
        }, []);
    });
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
var hrItem2 = document.getElementsByClassName(`hr__item`)[1],
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

var tbody = document.createElement(`tbody`);
table.appendChild(tbody);

var hrItem1 = document.getElementsByClassName(`hr__item`)[0];

var resetButton = document.createElement(`button`);
resetButton.innerText = `Reset`;


let clearTable = () => {
    let childrenOfTableBody = Array.from(document.getElementsByTagName(`tbody`)[0].children);
    for (let childElement of childrenOfTableBody) {
        childElement.remove();
    }
};

var lastEventTarget = null;

async function addDataInTable(event) {
    lastEventTarget = event.target;
    let emps = await employers;
    let filteredEmployers = emps.filter((employer) => {
        return String(employer.dept_unit_id) === event.target.dataset.id;
    });

    filteredEmployers.forEach((emp) => {
        let tr = document.createElement(`tr`);
        tbody.append(tr);
        let tds = [];
        for (let i = 0; i < 4; i++) {
            tds.push(document.createElement(`td`));
        }
        tr.append(...tds);
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
}

var otherLastEventTarget = null;
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
    let childrenOfTabBody = Array.from(document.getElementsByTagName(`tbody`)[0].children);
    if (childrenOfTabBody.length > 0) {
        if (lastEventTarget !== event.target) {
            clearTable();
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
    clearTable();
});

var select = document.createElement(`select`);
table.before(select);

var options = [];
var currencyNames = [`BYN`, `USD`, `EUR`, `RUB`];
for (let i = 0; i < currencyNames.length; i++) {
    options.push(document.createElement(`option`));
    options[i].classList.add(`option${i}`);
    options[i].innerText = currencyNames[i];
}
options[0].selected = true;
select.append(...options);

select.addEventListener(`change`, function () {
    if (select.value === currencyNames[0]) {
        curRate = 1;
        getCurRate(1)
    } else if (select.value === currencyNames[1]) {
        getCurRate(145)
    } else if (select.value === currencyNames[2]) {
        getCurRate(292)
    } else {
        getCurRate(298, 100)
    }
});

async function getCurRate(id, rus = 1) {
    var tbodyChildren = document.getElementsByTagName(`tbody`)[0].children;
    let emps = await employers;
    if (id !== 1 && tbodyChildren.length > 0) {
        fetch(`http://www.nbrb.by/API/ExRates/Rates/${id}`)
            .then(function (response) {
                return response.json();
            })
            .then(async function (result) {
                curRate = result.Cur_OfficialRate / rus;
                for (let i = 0; i < tbodyChildren.length; i++) {
                    let id = tbodyChildren[i].firstElementChild.innerText;
                    let filteredEmployer = emps.filter((emp) => {
                        return String(emp.id) === id;
                    });
                    tbodyChildren[i].lastElementChild.innerText = `${+(filteredEmployer[0]['salary'] / result.Cur_OfficialRate * rus).toFixed(2)}`;
                }
            })
    } else if (id === 1 && tbodyChildren.length > 0) {
        curRate = 1;
        for (let i = 0; i < tbodyChildren.length; i++) {
            let id = tbodyChildren[i].firstElementChild.innerText;
            let filteredEmployer = emps.filter((emp) => {
                return String(emp.id) === id;
            });
            tbodyChildren[i].lastElementChild.innerText = `${filteredEmployer[0]['salary']}`;
        }
    }
}