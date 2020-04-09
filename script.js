fetch('./departments/0_department.json')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
fetch('./departments/1_department.json')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
fetch('./departments/2_department.json')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
fetch('./departments/3_department.json')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
fetch('./departments/4_department.json')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    });
fetch('./departments/5_department.json')
    .then(res => res.json())
    .then(data => {
        console.log(data);
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
        }
    })
};
traverseTree(getTree(depts), hrTree);



// Right
var hrItem2 = document.getElementsByClassName(`hr__item`)[1],
    table = document.createElement(`table`);

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
let addDataInTable = (event) => {
    console.log(`data id: ${event.target.dataset.id}`);
    lastEventTarget = event.target;
    let filteredEmployers = employers.filter((employer) => {
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
                    elem.innerText = `${emp.salary}`;
                    break;
            }
        });
    });
};

var otherLastEventTarget = null;
const makeTextGold = (event) => {
    if (!otherLastEventTarget) {
        console.log(`if: lastT: ${otherLastEventTarget}, curT: ${event.target.innerText}`);
        otherLastEventTarget = event.target;
        event.target.style.color = "gold";
        event.cancelBubble = true;
    } else if (otherLastEventTarget !== event.target) {
        console.log(`else if: lastT: ${otherLastEventTarget.innerText}, curT: ${event.target.innerText}`);
        otherLastEventTarget.style.color = "black";
        event.target.style.color = "gold";
        otherLastEventTarget = event.target;
        event.cancelBubble = true;
    } else {
        console.log(`else: lastT: ${otherLastEventTarget.innerText}, curT: ${event.target.innerText}`);
        otherLastEventTarget.style.color = "black";
        event.target.style.color = "gold";
        event.cancelBubble = true;
    }
};

hrItem1.addEventListener(`click`, (event) => {
    let childrenOfTabBody = Array.from(document.getElementsByTagName(`tbody`)[0].children);
    console.log(lastEventTarget);
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
            console.log(`this i contains fa-chevron-down`);
        } else if (event.target.classList.contains(`fa-chevron-right`) && event.target.nextElementSibling) {
            console.log(`this i contains not fa-chevron-down`);
            event.target.nextElementSibling.style.display = 'block';
            event.target.classList.remove(`fa-chevron-right`);
            event.target.classList.add(`fa-chevron-down`);
        }
    })
}


resetButton.addEventListener(`click`, (event) => {
    clearTable();
});

// Data
const employers = [
    {
        dept_unit_id: 0,
        id: 0,
        name: "YarikHead",
        tel: "123-123-3",
        salary: 3000
    },
    {
        id: 1,
        name: "MashaLead",
        dept_unit_id: 1,
        tel: "123-123-3",
        salary: 2000
    },
    {
        id: 2,
        name: "SashaLead",
        dept_unit_id: 1,
        tel: "123-123-3",
        salary: 2200
    },
    {
        id: 3,
        name: "MirraDev",
        dept_unit_id: 2,
        tel: "123-123-3",
        salary: 1200
    },
    {
        id: 4,
        name: "IraDev",
        dept_unit_id: 2,
        tel: "123-123-3",
        salary: 1000
    },
    {
        id: 5,
        name: "DanikHead3",
        dept_unit_id: 3,
        tel: "123-123-33",
        salary: 3000
    },
    {
        id: 7,
        name: "KoliaLead",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2000
    },
    {
        id: 6,
        name: "OliaLead3",
        dept_unit_id: 4,
        tel: "123-123-3",
        salary: 2200
    },
    {
        id: 9,
        name: "SienaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1000
    },
    {
        id: 8,
        name: "LenaTest",
        dept_unit_id: 5,
        tel: "123-123-3",
        salary: 1200
    }
];