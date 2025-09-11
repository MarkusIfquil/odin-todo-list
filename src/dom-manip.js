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
            listsDiv.appendChild(listElement);
        }
    }

    drawMainPanel(List) {
        let mainPanel = document.querySelector(".main-panel");
        let title = document.createElement("div");
        title.textContent = List.title;
        mainPanel.appendChild(title);
        for (const item of List.items) {
            let itemDiv = document.createElement("div");
            itemDiv.textContent = item.text;
            mainPanel.appendChild(itemDiv);
        }
    }

    showHideForm() {
        let form = document.querySelector("#add-task-form");
        form.classList.toggle("hidden");
    }

    formSubmit() {
        let main = document.querySelector("#main-text");
        let desc = document.querySelector("#description");
        let date = document.querySelector("#date");
        let prior = document.querySelector("#priority");
        let list = document.querySelector("#list");

        //add item to list
        this.Lists.appendItemToList(main.value, desc.value, date.value, prior.value, list.value.trim());
        this.drawSidePanel();
    }

    addControls() {
        let addTaskButton = document.querySelector("#add-task");
        addTaskButton.onclick = () => this.showHideForm();
        let formSubmitButton = document.querySelector("#submit");
        formSubmitButton.onclick = () => {this.formSubmit(); this.showHideForm();}
        let cancelButton = document.querySelector("#cancel");
        cancelButton.onclick = () => this.showHideForm();
    }
}

