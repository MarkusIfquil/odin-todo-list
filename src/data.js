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

    sortList() {
        this.items.sort((a, b) => b.priority - a.priority);
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
        let list = this.items.find(l => l.title == oldName);
        list.title = name;
    }

    findListByName(name) {
        return this.items.find((l) => l.title == name);
    }
}
Object.assign(Lists.prototype, addRemoveMixin);

export class StorageHandler {
    constructor(Lists) {
        this.lists = Lists;
    }

    getStored() {
        let parsed = JSON.parse(localStorage.getItem("lists"));
        if (!parsed) {
            console.log("NO PARSE");
            return;
        }
        console.log("PARSE");
        console.log(parsed);

        for (const list of parsed.items) {
            let newList = new TodoList(list.title);

            for (const item of list.items) {
                let newItem = new Item(item.text, item.desc, item.dueDate, item.priority, item.checked, item.parent);
                newList.addItem(newItem);
            }
            this.lists.addItem(newList);
        }

        this.lists.currentList = this.lists.findListByName(parsed.currentList.title);
        console.log(this.lists);
    }
    store() {
        function getCircularReplacer() {
            const ancestors = [];
            return function (key, value) {
                if (typeof value !== "object" || value === null) {
                    return value;
                }
                // `this` is the object that value is contained in,
                // i.e., its direct parent.
                while (ancestors.length > 0 && ancestors.at(-1) !== this) {
                    ancestors.pop();
                }
                if (ancestors.includes(value)) {
                    return "[Circular]";
                }
                ancestors.push(value);
                return value;
            };
        }
        // console.log(JSON.stringify(this.lists, getCircularReplacer()));
        localStorage.setItem("lists", JSON.stringify(this.lists, getCircularReplacer()));
    }
}