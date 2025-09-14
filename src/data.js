let addRemoveMixin = {
    addItem(item) {
        this.items.push(item);
    },
    removeItem(item) {
        this.items.splice(this.items.indexOf(item), 1);
    },
    findItem(item) {
        return this.items.find(i => i == item);
    },
    findItemThatHasThis(item) {
        return this.items.find(i => i.findItem(item) != undefined);
    },
    removeFromParent() {
        this.parent.removeItem(this);
    }
};

export class Item {
    constructor(text, desc = "", dueDate, priority = 0, checked = false, parent) {
        this.text = text;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checked = checked;
        this.parent = parent;
    }
}
Object.assign(Item.prototype, addRemoveMixin);

export class TodoList {
    constructor(title) {
        this.title = title;
        this.tags = [];
        this.items = [];
    }
}
Object.assign(TodoList.prototype, addRemoveMixin);

export class Lists {
    items = [];
    currentList;

    appendItemToList(item, listName) {
        let list = this.items.find(j => j.title == listName);
        item.parent = list;
        list.addItem(item);
    }

    renameList(oldName, name) {
        console.log(oldName, name);
        let list = this.items.find(l => l.title = oldName);
        list.title = name;
    }
}
Object.assign(Lists.prototype, addRemoveMixin);