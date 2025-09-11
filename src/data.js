export class Item {
    constructor(text, desc = "", dueDate, priority = 0, checked = false) {
        this.text = text;
        this.desc = desc;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checked = checked;
    }
}

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
    }
};

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

    appendItemToList(main, desc, date, prior, listName) {
        let item = new Item(main, desc, date, prior);
        let list = this.items.find(j => j.title == listName);
        list.addItem(item);
    }
}
Object.assign(Lists.prototype, addRemoveMixin);

export class State {
    static currentList;
}