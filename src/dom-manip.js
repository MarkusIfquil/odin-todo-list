import * as Data from "./data";

export class DOMManipulator {
    constructor(Lists) {
        this.Lists = Lists;
    }

    drawSidePanel() {
        let panel = document.querySelector(".side-panel");
        panel.innerHTML = "";
        let actionsDiv = document.createElement("div");
        actionsDiv.classList.add("actions");

        let nameP = document.createElement("p");
        nameP.textContent = "User";
        actionsDiv.appendChild(nameP);

        let closeButton = document.createElement("button");
        closeButton.onclick = () => this.closeSidePanel();
        closeButton.classList.add("nf-cod-layout_sidebar_left");
        actionsDiv.appendChild(closeButton);

        panel.appendChild(actionsDiv);

        let addTaskButton = document.createElement("button");
        addTaskButton.textContent = "add task";
        addTaskButton.id = "add-task";
        panel.appendChild(addTaskButton);

        let ListsP = document.createElement("p");
        ListsP.textContent = "Lists";
        ListsP.id = "add-list";
        ListsP.classList.add("hover");
        panel.appendChild(ListsP);

        let listsDiv = document.createElement("div");
        listsDiv.classList.add("lists");
        for (const list of this.Lists.items) {
            let listElement = document.createElement("div");
            listElement.textContent = list.title;
            listElement.classList.add("hover", "list");
            listElement.onclick = () => this.changeActiveList(list);
            if (list == this.Lists.currentList) {
                listElement.classList.add("active-list");
            }
            listsDiv.appendChild(listElement);
        }
        panel.appendChild(listsDiv);
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

        let title = document.createElement("h1");
        title.textContent = List.title;
        mainPanel.appendChild(title);

        for (const item of List.items) {
            let itemDiv = document.createElement("p");
            itemDiv.classList.add("item");

            let markComplete = document.createElement("button");
            markComplete.textContent = "X";
            markComplete.id = "mark-complete";
            markComplete.onclick = () => this.onChecked(item, itemDiv);

            itemDiv.appendChild(markComplete);

            let textDiv = document.createElement("div");
            textDiv.textContent = item.text;

            itemDiv.appendChild(textDiv);

            mainPanel.appendChild(itemDiv);
        }
    }

    drawUpdate() {
        this.drawMainPanel();
        this.drawSidePanel();
    }

    changeActiveList(list) {
        this.Lists.currentList = list;
        this.drawUpdate();
    }

    onChecked(item, div) {
        item.removeFromParent();
        div.innerHTML = "";
    }
}

export class FormSubmitter {
    constructor(domManip) {
        this.domManip = domManip;
    }
    addControls() {
        let addTaskButton = document.querySelector("#add-task");
        addTaskButton.onclick = () => { this.addListOptions(); this.showHideForm(document.querySelector("#add-task-form")) };

        let formSubmitButton = document.querySelector("#submit");
        formSubmitButton.onclick = () => { this.taskFormSubmit(); this.showHideForm(document.querySelector("#add-task-form")); };

        let cancelButton = document.querySelector("#cancel");
        cancelButton.onclick = () => this.showHideForm(document.querySelector("#add-task-form"));

        let addListButton = document.querySelector("#add-list");
        addListButton.onclick = () => this.showHideForm(document.querySelector("#add-list-form"));

        let cancelListButton = document.querySelector("#cancel-list");
        cancelListButton.onclick = () => this.showHideForm(document.querySelector("#add-list-form"));

        let submitListButton = document.querySelector("#submit-list");
        submitListButton.onclick = () => { this.listFormSubmit(); this.showHideForm(document.querySelector("#add-list-form")); };

        // let togglePanelButton = document.querySelector("#open-panel");
        // togglePanelButton.onclick = () => this.domManip.closeSidePanel();
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