export default class Likes {
  constructor () {
    this.likes = [];
  }
  
  addLike(id, title, author, img){
    const like = {id, title, author, img};
    this.likes.push(like);

    this.peristData();
    return like;

    //persist data
    
  }

  deleteLike (id){
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1); 

    //persist data
    this.peristData();
  }

  isLiked (id) {
    return this.likes.findIndex(el => el.id === id) !== -1
  }

  getNumLikes () {
    return this.likes.length;
  }

  peristData () {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage () {
    const storage = JSON.parse(localStorage.getItem('likes'));

    if(storage) this.likes = storage;
  }
}
