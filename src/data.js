class Item {
    text = ""
    dueDate = ""
    priority = 0
    checked = false
}

class TodoList {
    constructor(title) {
        this.title = title;
        this.tags = [];
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }
    removeItem(item) {
        this.items.splice(this.items.indexOf(item),1);
    }
}

class Group {
    constructor(title) {
        this.title = title;
        this.lists = [];
    }
}

class Groups {
    groups = [];
}

export {Groups};