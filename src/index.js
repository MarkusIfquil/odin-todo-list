import "./style.css";
import { DOMManipulator, FormSubmitter } from "./dom-manip";
import * as Data from "./data";

let Lists = new Data.Lists;

let storageHandler = new Data.StorageHandler(Lists);
storageHandler.getStored();

let defaultList = new Data.TodoList("Default");

if (Lists.findListByName(defaultList.title) === undefined) {
    console.log("AAA");
    Lists.addItem(defaultList);
    Lists.currentList = defaultList;

    let defaultItem = new Data.Item("default todo", "hi", "2025-09-14", 0, false, defaultList);
    defaultList.addItem(defaultItem);
}

// Lists.addItem(defaultList);
let domManip = new DOMManipulator(Lists);
domManip.drawUpdate();

let formControl = new FormSubmitter(domManip);
formControl.addControls();