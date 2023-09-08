const LocalStorageService = {
    saveData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    loadData: (key) => JSON.parse(localStorage.getItem(key)),
    clearData: (key) => localStorage.removeItem(key),
  };
  console.log(LocalStorageService.saveData.data);
  export default LocalStorageService;
  
  