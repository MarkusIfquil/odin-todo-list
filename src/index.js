import "./style.css";
import { DOMManipulator } from "./dom-manip";
import * as Data from "./data";

let Lists = new Data.Lists;

let defaultList = new Data.TodoList("default");
Data.State.currentList = defaultList;

let defaultItem = new Data.Item("default todo","hi","uh idk",0,false,defaultList);
defaultList.addItem(defaultItem);

Lists.addItem(defaultList);
let domManip = new DOMManipulator(Lists);
domManip.addControls();
domManip.drawSidePanel();
domManip.drawMainPanel(Data.State.currentList);