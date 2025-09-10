export class Item {
    constructor(text, dueDate, priority, checked) {
        this.text = text
        this.dueDate = dueDate
        this.priority = priority
        this.checked = checked
    }
}

let addRemoveMixin = {
    addItem(item) {
        this.items.push(item);
    },
    removeItem(item) {
        this.items.splice(this.items.indexOf(item), 1);
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

export class Group {
    constructor(title) {
        this.title = title;
        this.items = [];
    }
}
Object.assign(Group.prototype, addRemoveMixin);

export class Groups {
    items = [];
}
Object.assign(Groups.prototype, addRemoveMixin);
