'use strict';
// Implement the following features which will require a more complex store object:
// User can press a switch/checkbox to toggle between displaying all items or displaying only items that are unchecked
// User can type in a search term and the di`splayed list will be filtered by item names only containing that search term
// User can edit the title of an item



const STORE = {
  list: [
    { name: 'apples', checked: false },
    { name: 'oranges', checked: false },
    { name: 'milk', checked: true },
    { name: 'bread', checked: false }
  ],
  showAll: false,
  search: '',
  edited: ''

};


function generateItemElement(item, itemIndex, template) {

  return `
   <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
       <input type="text" name="edit-list-entry" class="js-edit-list-entry" placeholder="edit item"></input>
       <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {

  let list = shoppingList.list;  
  if (STORE.showAll) {
    list = list.filter(item => !item.checked);
  } else if (STORE.search) {
    list = list.filter(item => item.name.includes(STORE.search));
  } else if (STORE.edited) {
    STORE.list.name = STORE.edited;
  }

  const items = list.map((item, index) => generateItemElement(item, index));



  return items.join('');

}


function renderShoppingList() {
  // render the shopping list in the DOM
  const shoppingListItemsString = generateShoppingItemsString(STORE);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {

  STORE.list.push({ name: itemName, checked: false });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  STORE.list[itemIndex].checked = !STORE.list[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteHandler(itemIndex) {
  STORE.list.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteHandler(itemIndex);
    renderShoppingList();

  });
}

function checkBoxHandler() {
  // $('.checkbox').is(':checked') ?  STORE.showAll = true : STORE.showAll = false;
  $('.checkbox').on('change', function () {
    STORE.showAll = $('.checkbox').is(':checked');
    renderShoppingList();
  });

}


function searchByNameHandler() {
 
  $('.search').on('click', function (event) {
    event.preventDefault();
    const searchItem = $('.js-search-list-entry').val();
    STORE.search = searchItem;

    $('.js-search-list-entry').val('');

    return renderShoppingList(); 
  });
}

function editNameHandler () {
  $('.js-shopping-list').on('click', '.js-item-edit', (event) =>{
    //take the input val and set it to the name
    const edit = $('.js-edit-list-entry').val();
    console.log('`editNameHanler`running', edit);
    $('.js-edit-list-entry').val('');


    STORE.list.name = edit;
    console.log(`edited to ${STORE.list.name}`);
    console.log(`STORE.list.name has been edited to ${edit}`);
    
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  checkBoxHandler();
  searchByNameHandler();
  editNameHandler();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);