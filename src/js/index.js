// Global app controller
//
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchview  from './views/searchView';
import * as rv from './views/recipeView';
import * as listview from './views/listView';
import * as likesview from './views/likesView'
import {elements, renderLoader, clearLoader} from './views/base';
 

//`````````````Search Controller`````````````````````````````````````````````````````````````
const state = {};

const controlSearch = async () => {
  //1. Get the query from the view
  const query = searchview.getInput();

  if (query){
    //2. Create new search
    state.search = new Search(query); //State @ SEARCH
    
    //3. Prepare the UI
    searchview.clearInput();
    searchview.clearResult();
    renderLoader(elements.searchRes);
    
    try {
      //4. Search Recipe
      await state.search.getResult();

      //5. display result @UI
      clearLoader();
      searchview.renderResult(state.search.result);
      // console.log(state.search.result);
    } catch (error) {
      console.log(error)
      clearLoader();
    }
    
  }
}

//submit search trigger
elements.searchForm.addEventListener('submit', e => {

  e.preventDefault();
  controlSearch();
})

//button click @ search result
elements.searchResPages.addEventListener('click', event => {

  const btn = event.target.closest('.btn-inline');
  if (btn) {
    const goto = parseInt(btn.dataset.goto, 10);
    searchview.clearResult();
    searchview.renderResult(state.search.result, goto);
    // console.log(goto);

  }
})


// const search = new Search ('pizza');
// console.log(search);
// search.getResult();

//```````````` Recipe Controller````````````````````````````````````````````````````````````

// const recipe = new Recipe(46956);
// recipe.getRecipe();
// console.log(recipe);

const controlRecipe = async () => {
  //Get the id from the URL
  const id = window.location.hash.replace('#', '');
  // console.log(id);
  if (id) {
    //Prepare for ui changes
    rv.clearRecipe();
    renderLoader(elements.recipe);

    //highlight Selected id
    // if (state.search) searchview.activeSelected(id)
    
    //Create new recipe object
    state.recipe = new Recipe(id);
    try {
      //Get recipe data
      await state.recipe.getRecipe();
      //call Serving and time
      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServing();
      // console.log(state.recipe);
      
      //render Recipe
      clearLoader();
      rv.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      // alert('Somethings went wrong @ controld recipe')
      console.log(error)
    }
    
  }

};

//`````````List Controller`````````````````````````````````````````````````````````````````````
const controlList = () => {
  if (!state.list) state.list = new List();
  
  //add Ingredients to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItems(el.count, el.unit, el.ingredients);
    listview.renderItem(item); 
  })
};

//``````````likes controller```````````````````````````````````````````````````````````````````

//TESTING
// state.likes = new Likes();
// likesview.toggleLikeMenu(state.likes.getNumLikes());

const controlLikes = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  //user encounter new recipe which is not liked
  if (!state.likes.isLiked(currentId)) {
    //add like to the state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    )
    //toggle button design to full heart
    likesview.toggleLikeBtn(true);

    //add liked ingredients to the ui
    likesview.renderLikes(newLike);
    // console.log(state.likes)

  //user already liked this current item
  } else {
    //remove like from the state
    const removeLike = state.likes.deleteLike(currentId);

    //toggle buttong design to empty heart
    likesview.toggleLikeBtn(false);

    //remove liked ingredients from the ui
    likesview.deleteLikes(currentId);
    // console.log(state.likes);
  }

  likesview.toggleLikeMenu(state.likes.getNumLikes());
}







//``event Handler```````````````````

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {

  if (e.target.matches('.btn-decrease, .btn-decrease *')){
    //decrease servings
    // alert('decrese')
    // if (state.recipe.servings > 1){
      state.recipe.updateServings('dec');
      rv.updateServingIngredients(state.recipe);

    // }
  } else if (e.target.matches('.btn-increase, .btn-increase *')){
    //increase servings
    // alert('increase')
    state.recipe.updateServings('inc')
    rv.updateServingIngredients(state.recipe);

  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    //add ingredients list 
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLikes();
  }


});

window.addEventListener('load', () => {
  state.likes = new Likes();

  //read data from localstorage
  state.likes.readStorage();

  //toggle like button
  likesview.toggleLikeMenu(state.likes.getNumLikes());

  // render likes
  state.likes.likes.forEach(like => likesview.renderLikes(like));
})

//handle delete and update items in the list
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  //handle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')){

    //delete from data 
    state.list.deleteItem(id);
    //delete from the ui
    listview.deleteItem(id);


    //handle the count update
  } else if (e.target.matches('.shopping__count-value')){
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val)
  }
})