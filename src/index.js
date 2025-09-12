import "./style.css";
import { DOMManipulator, FormSubmitter } from "./dom-manip";
import * as Data from "./data";

let Lists = new Data.Lists;

let defaultList = new Data.TodoList("default");
Lists.currentList = defaultList;

let defaultItem = new Data.Item("default todo","hi","uh idk",0,false,defaultList);
defaultList.addItem(defaultItem);

Lists.addItem(defaultList);
let domManip = new DOMManipulator(Lists);
domManip.drawSidePanel();
domManip.drawMainPanel(Lists.currentList);

let formControl = new FormSubmitter(domManip);
formControl.addControls();

