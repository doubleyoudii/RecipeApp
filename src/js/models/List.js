import uniqid from 'uniqid';

export default class List {
  constructor () {
    this.items = [];
  }

  addItems (count, unit, ingredients){
    const items = {
      id: uniqid(),
      count,
      unit,
      ingredients

    }
    this.items.push(items);
    return items;
  }

  deleteItem (id){
    const index = this.items.findIndex(el => el.id === id)
    this.items.splice(index, 1);
  }

  updateCount (id, newCount){
    this.items.find(el => el.id === id).count = newCount;
  }
}