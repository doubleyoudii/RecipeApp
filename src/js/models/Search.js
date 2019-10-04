import axios from 'axios';
import {proxy, key} from '../config';


export default class Search {
  constructor (query){
    this.query = query;

  }
  async getResult (){
    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    // const key = 'f95d72c379d26ffec22ec5d32fb28986';
    try {
      const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;   //the 'this' keyword will given in the bject that uses the function.
      // console.log(this.result);
    } catch (error){  
      alert (error);
    }
  
  }
}