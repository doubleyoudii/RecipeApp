import axios from 'axios';
import {proxy, key} from '../config';


export default class Recipe {
  constructor (id){
    this.id = id;
  }

  async getRecipe (){

    try {

      const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      // console.log(res);
    } catch (error){
      alert('error @ getRecipe');
    }
    
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const period = Math.ceil(numIng / 3);
    this.time = period * 15;
  }

  calcServing () {
    this.serving = 4;
  }

  parseIngredients () {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', ' ounce', 'teaspoons', 'teaspoon', 'cups', ' pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'kg', 'g'];

    let newIngredients = this.ingredients.map(element => {
      //1. uniform Elements
      let ingredients = element.toLowerCase();
      unitsLong.forEach((units, i) => {
        ingredients = ingredients.replace(units, unitsShort[i]);
      })

      //2. remove paranthesis
      ingredients = ingredients.replace(/ *\([^)]*\) */g, " ");
      //3. parseingredients into count, unit, and ingredient
      const arrIng = ingredients.split(" "); //becomes array []
      const unitIndex = arrIng.findIndex(el => unitsShort.includes(el));

      let objIng;
      if (unitIndex > -1) {
        //There is a Unit
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1){
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit : arrIng[unitIndex],
          ingredients : arrIng.slice(unitIndex+1).join(' ')
        }
      } else if (parseInt(arrIng[0], 10)) {
        //Theres no unit nor a number 
        objIng = {
          count : parseInt(arrIng[0], 10),
          unit : '',
          ingredients : arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1){
        //Theres a unit
        objIng = {
          count : 1,
          unit : '',
          ingredients
        }
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  }

  updateServings (type) {
    const newServing = type === 'dec' ? this.serving - 1 : this.serving + 1;
    this.ingredients.forEach(ing => {
      ing.count = ing.count * (newServing/this.serving);
    })

    this.serving = newServing;
  }

}