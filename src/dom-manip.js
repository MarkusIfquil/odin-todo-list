import {Groups} from "./data.js";

export class DOMManipulator {
    sidePanel = document.querySelector(".side-panel");
    mainPanel = document.querySelector(".main-panel");

    drawSidePanel() {
        //add groups to side panel
        for (const group of Groups) {
            let groupElement = document.createElement("div");            
            groupElement.textContent = group.title;
            //add lists to groups
            for (const list of group) {
                let listElement = document.createElement("div");
                listElement.textContent = list.title;
                groupElement.appendChild(listElement);
            }
            
            this.sidePanel.appendChild(groupElement);
        }
    }
}