import * as Data from "./data";

export class DOMManipulator {
    constructor(Lists) {
        this.Lists = Lists;
    }

    drawSidePanel() {
        let listsDiv = document.querySelector(".lists");
        listsDiv.innerHTML = "";
        for (const list of this.Lists.items) {
            let listElement = document.createElement("div");
            listElement.textContent = list.title;
            listElement.classList.add("hover");
            listElement.onclick = () => this.changeActiveList(list);
            if(list == Data.State.currentList) {
                listElement.classList.add("active-list");
            }
            listsDiv.appendChild(listElement);
        }
    }

    drawMainPanel() {
        let List = Data.State.currentList;

        let mainPanel = document.querySelector(".main-panel");
        mainPanel.innerHTML = "";

        let title = document.createElement("h1");
        title.textContent = List.title;
        mainPanel.appendChild(title);
        
        for (const item of List.items) {
            let itemDiv = document.createElement("p");
            itemDiv.classList.add("item");
            let checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.id = "checked";
            checkBox.onclick = () => this.onChecked(item,itemDiv);

            itemDiv.appendChild(checkBox);
            let textDiv = document.createElement("div");
            textDiv.textContent = `- ${item.text}`;
            itemDiv.appendChild(textDiv);        
            mainPanel.appendChild(itemDiv);
        }
    }

    drawUpdate() {
        this.drawMainPanel();
        this.drawSidePanel();
    }

    showHideForm(form) {
        form.classList.toggle("hidden");
    }

    taskFormSubmit() {
        let main = document.querySelector("#main-text");
        let desc = document.querySelector("#description");
        let date = document.querySelector("#date");
        let prior = document.querySelector("#priority");
        let list = document.querySelector("#list");

        this.Lists.appendItemToList(main.value, desc.value, date.value, prior.value, list.value.trim());
        this.drawMainPanel();
    }

    listFormSubmit() {
        let name = document.querySelector("#list-name");
        this.Lists.addItem(new Data.TodoList(name.value));
        this.drawSidePanel();
    }

    changeActiveList(list) {
        Data.State.currentList = list;
        this.drawUpdate();
    }

    onChecked(item, div) {
        item.removeFromParent();
        div.innerHTML = "";        
    }

    addControls() {
        let addTaskButton = document.querySelector("#add-task");
        addTaskButton.onclick = () => this.showHideForm(document.querySelector("#add-task-form"));

        let formSubmitButton = document.querySelector("#submit");
        formSubmitButton.onclick = () => {this.taskFormSubmit(); this.showHideForm(document.querySelector("#add-task-form"));};
        
        let cancelButton = document.querySelector("#cancel");
        cancelButton.onclick = () => this.showHideForm(document.querySelector("#add-task-form"));

        let addListButton = document.querySelector("#add-list");
        addListButton.onclick = () => this.showHideForm(document.querySelector("#add-list-form"));

        let cancelListButton = document.querySelector("#cancel-list");
        cancelListButton.onclick = () => this.showHideForm(document.querySelector("#add-list-form"));

        let submitListButton = document.querySelector("#submit-list");
        submitListButton.onclick = () => {this.listFormSubmit(); this.showHideForm(document.querySelector("#add-list-form"));};
    }
}

