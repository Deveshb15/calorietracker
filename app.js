// Storage controller
const StorageCtrl = (function(){

    return{
        storeItem : function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
                // push in ls
                items.push(item);
                // set
                localStorage.setItem('items', JSON.stringify(items));
            }else{
                // get the already existing items
                const items = JSON.parse(localStorage.getItem('items')); 

                //Push
                items.push(item);

                // Reset LS
                localStorage.setItem('items', JSON.stringify(items));   
            }
        },
        getItemsFromStorage : function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        
        updateItemStorage : function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
             // Reset LS
             localStorage.setItem('items', JSON.stringify(items));

        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
             // Reset LS
             localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage : function(){
            localStorage.removeItem('items');
        }

    }
})();

// Item controller
const ItemCtrl = (function() {
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        // items : [
        //     // { id: 0,name: "Steak Dinner",calories: 1200 },
        //     // { id: 1,name: "Noodles",calories: 600 },
        //     // { id: 2,name: "Burger",calories: 900 }
        // ],
        items : StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalCalories : 0
    }

    return{
        getItems: function(){
            return data.items ;
        },
        addItem: function(name, calories) {
            let ID;

            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            // calories to number 
            calories = parseInt(calories);

            newItem = new Item(ID, name, calories);

            data.items.push(newItem);
            return newItem;
        },
        getItemByID: function(id){
            let found = null;
            data.items.forEach((item) => {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);
            let found = null;
            data.items.forEach((item) => {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem: function(id){
            // Get ids
            const ids = data.items.map(function(item){
              return item.id;
            });
      
            // Get index
            const index = ids.indexOf(id);
      
            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems : function(){
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function(){
           return data.currentItem;
        },
        getTotalCalories : function(){
            let total = 0;
            data.items.forEach((item) => {
                total += item.calories;
            })
            data.totalCalories = total;
            
            return data.totalCalories;
        },
        logData : function(){
            return data;
        }
    }
})();

// UI controller
const UICtrl = (function() {
    const UISelectors = {
        itemList : '#item-list',
        listItems : '#item-list li',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        deleteBtn : '.delete-btn',
        backBtn : '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCaloriesInput : '.total-calories'
    }

    return{
        populateItems : function(items){
            let html = ``;

            items.forEach((item) => {
                
                html += `
                <li class="collection-item" id="item-${item.id}"><strong>${item.name} :</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt" style="color: #000;"></i></a>
                </li>
            `;
               
            })
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput : function(){
           return{
             name:document.querySelector(UISelectors.itemNameInput).value,
             calories:document.querySelector(UISelectors.itemCaloriesInput).value
           }
        },
        addListItem: function(item) {
            // Show Items
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li
            const li = document.createElement('li');
            // Add Class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add html
            li.innerHTML = `<strong>${item.name} :</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt" style="color: #000;"></i></a>`;



            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML =`<strong>${item.name} :</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil-alt" style="color: #000;"></i></a>`;
                }

            })
        },
        deleteListItem : function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);

            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        removeItems : function() {
           let listItems = document.querySelector(UISelectors.itemList);

           listItems = Array.from(listItems);

           listItems.forEach(item => {
               item.remove();
           })
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },
        hideList : function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCaloriesInput).innerHTML = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
       showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
       },
        getSelectors : function() {
            return UISelectors;
        }
    }
})();

// App controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl){

    // Load event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        // Add Item
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable Enter
        document.addEventListener('keypress', function (e) {

            if(e.keyCode == 13 || e.which == 13){
                e.preventDefault();
                return false;
            }

        })

        // Edit Item
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // clear
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // Add Item
    const itemAddSubmit = function(e) {
        const input = UICtrl.getItemInput();

       if(input.name !== '' && input.calories !== ''){
        // Add items
        const newItem = ItemCtrl.addItem(input.name, input.calories);
    
        // Add to UI
        UICtrl.addListItem(newItem);

        // Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Show total calories
        UICtrl.showTotalCalories(totalCalories);

        // Store in LS
        StorageCtrl.storeItem(newItem);

        // Clear Input
        UICtrl.clearInput();


       }else if(input.name === ''){
           alert("Please add Meal / Food Item!")
       }else if(input.calories === ''){
           alert("Please enter the amount of calories!")
       }else{
           alert("Please enter Meal and Calories!")
       }

        e.preventDefault();
    }

    // Edit Item
    const itemEditClick = function(e){

        if(e.target.classList.contains('edit-item')){
            const listID = e.target.parentNode.parentNode.id;

            const listIdArr = listID.split('-');
            
            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemByID(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }
    
    // Update Item
    const itemUpdateSubmit = function (e){

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories); 

        UICtrl.updateListItem(updatedItem);

        // Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Show total calories
        UICtrl.showTotalCalories(totalCalories);

        // Update in LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete Item
    const itemDeleteSubmit = function(e) {

        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete  from UI
        UICtrl.deleteListItem(currentItem.id);

        // Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Show total calories
        UICtrl.showTotalCalories(totalCalories);

        // Delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear All
    const clearAllItemsClick = function(e) {

        ItemCtrl.clearAllItems();

        // Total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Show total calories
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.removeItems();

        // Cleat Items from LS
        StorageCtrl.clearItemsFromStorage();

        UICtrl.hideList();

        e.preventDefault();
    }

    return {
        init: function(){
            // Clear Edit State/ set initial state
            UICtrl.clearEditState();
            // Fetch Items from Data Structure
            const items = ItemCtrl.getItems();

            if(items.length == 0){
                UICtrl.hideList();
            }else{
            // Insert in the UI
            UICtrl.populateItems(items)
            }

             // Total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Show total calories
            UICtrl.showTotalCalories(totalCalories);

            // Load Event Listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();