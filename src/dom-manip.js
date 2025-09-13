import * as Data from "./data";

export class DOMManipulator {
    constructor(Lists) {
        this.Lists = Lists;
    }

    constructElement(type, text, id, classes) {
        let element = document.createElement(type);
        element.textContent = text;
        element.id = id;
        element.classList = classes;
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

        let addTaskButton = this.constructElement("button","add task","add-task");

        let formSubmitter = new FormSubmitter(this);
        addTaskButton.onclick = () => { formSubmitter.addListOptions(); formSubmitter.showHideForm(document.querySelector("#add-task-form")) };

        //lists
        let ListsP = this.constructElement("p","Lists","add-list",["hover"]);
        ListsP.onclick = () => formSubmitter.showHideForm(document.querySelector("#add-list-form"));

        let listsDiv = this.constructElement("div","","","lists");
        for (const list of this.Lists.items) {
            let listElement = this.constructElement("div",list.title,"",["hover","list"]);
            listElement.onclick = () => this.changeActiveList(list);

            if (list == this.Lists.currentList) {
                listElement.classList.add("active-list");
            }

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

        let title = this.constructElement("h1",List.title);
        mainPanel.appendChild(title);

        let itemsDiv = this.constructElement("div","","",["items"]);

        for (const item of List.items) {
            //outer div
            let itemDiv = this.constructElement("p","","",["item"]);
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
                itemAttrDiv.contentEditable = "true";
                itemAttrDiv.style.border = "solid";
                saveButton.classList.toggle("hidden");
                editButton.classList.toggle("hidden");
            };
            itemDiv.appendChild(editButton);

            let saveButton = document.createElement("button");
            saveButton.textContent = "save";
            saveButton.classList.add("hidden", "action-button");
            saveButton.onclick = () => {
                itemAttrDiv.contentEditable = "false";
                itemAttrDiv.style.border = "";
                saveButton.classList.toggle("hidden");
                editButton.classList.toggle("hidden");
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
        this.domManip.drawUpdate();
    }
}