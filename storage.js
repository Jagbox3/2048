// Creates a dictionary
window.fakeStorage = {
  data: {},

  setItem: function (key, val) {
    return this.data[key] = String(val);
  },

  getItem: function (key) {
    return this.data.hasOwnProperty(key) ? this.data[key] : undefined;
  },

  removeItem: function (id) {
    return delete this.data[key];
  }
};

// Manages localStorage
function StorageManager(){
    
    //constructor
    this.bestScoreKey = "bestScore";
    
    this.isLocalStorageSupported = function(){
        let testKey = "test";
        let s = window.localStorage;
        try {
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            return true;
        } catch (error){
            print("NO STORAGE :(");
            return false;
        }
    }
    
    this.storage = this.isLocalStorageSupported() ? window.localStorage : window.fakeStorage;
    
    this.getBestScore = function(){
        return this.storage.getItem(this.bestScoreKey) || 0;
    }
    
    this.setBestScore = function(score){
        this.storage.setItem(this.bestScoreKey, score);
    }
}