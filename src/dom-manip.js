import * as Data from "./data";

export class DOMManipulator {
    constructor(Lists) {
        this.Lists = Lists;
        this.formSubmitter = new FormSubmitter(this);
    }

    constructElement(type, text, id = "", classes) {
        let element = document.createElement(type);
        if (text) {
            element.textContent = text;
        }
        if (id) {
            element.id = id;
        }
        if (classes) {
            for (const Class of classes) {
                element.classList.add(Class);
            }
        }
        return element;
    }

    drawSidePanel() {
        //panel
        let panel = document.querySelector(".side-panel");
        panel.innerHTML = "";

        //actions
        let actionsDiv = document.createElement("div");
        actionsDiv.innerHTML = `
            <p>User</p>
            <button id="close-panel" class="nf-cod-layout_sidebar_left"></button>
        `;
        actionsDiv.classList.add("actions");
        panel.appendChild(actionsDiv);

        //buttons
        let closeButton = document.querySelector("#close-panel");
        closeButton.onclick = () => this.closeSidePanel();

        let addTaskButton = this.constructElement("button", "add task", "add-task");
        addTaskButton.onclick = () => {
            this.formSubmitter.addListOptions();
            this.formSubmitter.showHideForm(document.querySelector("#add-task-form"))
        };

        //lists
        let ListsP = this.constructElement("p", "Lists", "add-list", ["hover"]);
        ListsP.onclick = () => this.formSubmitter.showHideForm(document.querySelector("#add-list-form"));

        let listsDiv = this.constructElement("div", "", "", ["lists"]);
        for (const list of this.Lists.items) {
            //base element
            let listElement = this.constructElement("div", list.title, "argh", ["hover", "list"]);
            listElement.onclick = () => this.changeActiveList(list);

            if (list == this.Lists.currentList) {
                listElement.classList.add("active-list");
            }

            //... button
            let actionsButton = this.constructElement("button", "...");
            actionsButton.style.backgroundColor = "inherit";
            actionsButton.style.border = "inherit";
            actionsButton.onclick = (e) => {
                e.stopPropagation();
                let dropDown = this.createDropDown(list);
                listElement.appendChild(dropDown);
            };
            listElement.append(actionsButton);

            listsDiv.appendChild(listElement);
        }
        panel.append(addTaskButton, ListsP, listsDiv);
    }

    closeSidePanel() {
        let panel = document.querySelector(".side-panel");
        panel.innerHTML = "";
        panel.classList.toggle("collapse");

        let openButton = document.createElement("button");
        openButton.onclick = () => { panel.classList.toggle("collapse"); this.drawSidePanel(); };

        panel.appendChild(openButton);
    }

    drawMainPanel() {
        let List = this.Lists.currentList;

        let mainPanel = document.querySelector(".main-panel");
        mainPanel.innerHTML = "";

        let title = this.constructElement("h1", List.title);
        mainPanel.appendChild(title);

        let itemsDiv = this.constructElement("div", "", "", ["items"]);

        for (const item of List.items) {
            //outer div
            let itemDiv = this.constructElement("p", "", "", ["item"]);
            itemDiv.item = item;

            //inside
            let markCompleteButton = document.createElement("button");
            markCompleteButton.classList.add("mark-complete");
            markCompleteButton.onclick = () => this.onChecked(item);

            itemDiv.appendChild(markCompleteButton);

            //item attributes
            let itemAttrDiv = document.createElement("div");
            itemAttrDiv.style.flex = "1 1 0";
            itemAttrDiv.style.paddingInline = "0.5em";
            itemAttrDiv.style.borderRadius = "0.5em";
            let text = document.createElement("p");
            text.textContent = item.text;
            let desc = document.createElement("p");
            desc.textContent = item.desc;
            desc.classList.add("subtext");

            let othersDiv = document.createElement("div");
            othersDiv.style.display = "flex";
            othersDiv.style.gap = "1em";

            let date = document.createElement("p");
            date.textContent = item.dueDate;
            date.classList.add("date");
            let priority = document.createElement("p");
            priority.textContent = `priority: ${item.priority}`;
            othersDiv.append(date, priority);

            itemAttrDiv.append(text, desc, othersDiv);

            itemDiv.appendChild(itemAttrDiv);

            //buttons
            let editButton = document.createElement("button");
            editButton.textContent = "edit";
            editButton.classList.add("action-button");
            editButton.onclick = () => {
                this.changeEditable(itemAttrDiv, saveButton, editButton);
            };
            itemDiv.appendChild(editButton);

            let saveButton = document.createElement("button");
            saveButton.textContent = "save";
            saveButton.classList.add("hidden", "action-button");
            saveButton.onclick = () => {
                this.changeEditable(itemAttrDiv, saveButton, editButton);
                itemDiv.item.text = text.textContent;
                itemDiv.item.desc = desc.textContent;
                itemDiv.item.dueDate = date.textContent;
            };
            itemDiv.appendChild(saveButton);

            itemsDiv.appendChild(itemDiv);
        }

        mainPanel.appendChild(itemsDiv);
    }

    drawUpdate() {
        this.drawMainPanel();
        this.drawSidePanel();
    }

    changeActiveList(list) {
        this.Lists.currentList = list;
        this.drawUpdate();
    }

    onChecked(item) {
        item.removeFromParent();
        this.drawUpdate();
    }

    createDropDown(list) {
        let dropDown = this.constructElement("div", "", "drop-down-div", ["drop-down"]);

        let divEdit = this.constructElement("div", "edit", "", ["hover"]);
        divEdit.onclick = (e) => {
            e.stopPropagation();
            let oldNameP = document.querySelector("#old-name");
            oldNameP.textContent = list.title;
            this.formSubmitter.showHideForm(document.querySelector("#edit-list-form"));
        };

        let divDelete = this.constructElement("div", "delete", "", ["hover"]);
        divDelete.onclick = () => {
            this.Lists.removeItem(list);
            this.drawUpdate();
        };

        function closeDropDown(e) {
            if (!e.target.closest("#drop-down-div")) {
                dropDown.parentElement.removeChild(dropDown);
                document.removeEventListener("click", closeDropDown);
            }
        }

        document.addEventListener("click", closeDropDown);

        dropDown.append(divEdit, divDelete);
        return dropDown;
    }

    changeEditable(div, button1, button2) {
        if (div.contentEditable == "true") {
            div.contentEditable = "false";
        } else {
            div.contentEditable = "true";
        }
        if (div.style.border == "solid") {
            div.style.border = "";
        } else {
            div.style.border = "solid";
        }
        button1.classList.toggle("hidden");
        button2.classList.toggle("hidden");
    }
}

export class FormSubmitter {
    constructor(domManip) {
        this.domManip = domManip;
    }

    addControls() {
        let formSubmitButton = document.querySelector("#submit");
        formSubmitButton.onclick = () => { this.taskFormSubmit(); this.showHideForm(document.querySelector("#add-task-form")); };

        let cancelButton = document.querySelector("#cancel");
        cancelButton.onclick = () => this.showHideForm(document.querySelector("#add-task-form"));

        let cancelListButton = document.querySelector("#cancel-list");
        cancelListButton.onclick = () => this.showHideForm(document.querySelector("#add-list-form"));

        let submitListButton = document.querySelector("#submit-list");
        submitListButton.onclick = () => { this.listFormSubmit(); this.showHideForm(document.querySelector("#add-list-form")); };

        let submitListEditButton = document.querySelector("#submit-list-edit");
        submitListEditButton.onclick = () => { this.listEditFormSubmit(); this.showHideForm(document.querySelector("#edit-list-form")) };
    }

    showHideForm(form) {
        form.classList.toggle("hidden");
    }

    addListOptions() {
        let selection = document.querySelector("#list");
        selection.innerHTML = "";
        for (const list of this.domManip.Lists.items) {
            let option = document.createElement("option");
            option.value = list.title;
            option.textContent = list.title;
            selection.appendChild(option);
        }
    }

    taskFormSubmit() {
        let main = document.querySelector("#main-text");
        let desc = document.querySelector("#description");
        let date = document.querySelector("#date");
        let prior = document.querySelector("#priority");
        let list = document.querySelector("#list");

        this.domManip.Lists.appendItemToList(new Data.Item(main.value, desc.value, date.value, prior.value), list.value.trim());
        this.domManip.drawUpdate();
    }

    listFormSubmit() {
        let name = document.querySelector("#list-name");
        if (name.value == "") {
            name.value = `list ${this.domManip.Lists.items.length}`;
        }
        this.domManip.Lists.addItem(new Data.TodoList(name.value));
        console.log(this.domManip.Lists);
        this.domManip.drawUpdate();
    }

    listEditFormSubmit() {
        let name = document.querySelector("#list-name-edit");
        let oldName = document.querySelector("#old-name");
        this.domManip.Lists.renameList(oldName.textContent, name.value);
        this.domManip.drawUpdate();
    }
}