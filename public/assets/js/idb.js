//create variable to hold db connection
let db;

//establish a connection to IndexedDB databse called 'pizza_hunt' and set it to version 1
//request is an event listener for the db, it is created when connection is open
//indexedDB is a global variable since it is apart of the window object
const request = indexedDB.open('pizza_hunt', 1);

//this event will emit if the db version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    //save reference to the db
    const db = event.target.result;

    //create an object store (table) called 'new_pizza', set it auto incrementign primary key
    db.createObjectStore('new_pizza', { autoIncrement: true });
}

//upon successful connection
request.onsuccess = function(event) {
    //when db is successfully created with its object store (from onupgradeneeded event above)
    //or simply established a connection, save reference to db in global variable
    db = event.target.result;

    //check if app is online
    if (navigator.onLine) {
        uploadPizza();
    }
}

request.onerror = function(event) {
    //log error here
    console.log(event.target.errorCode);
}

//this function will be executed if we attempt to submit a new pizza and there's no interent
function saveRecord(record) {
    //open a new transaction with the db with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for 'new_pizza'
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //add record to y our store with add method
    pizzaObjectStore.add(record);
}

function uploadPizza() {
    //open transaction
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    //get all records from store and set to a variable
    const getAll = pizzaObjectStore.getAll();

    //upon a successful .getAll() execution, run this function
    getAll.onsuccess = function() {
        //if there was data in indexedDB's store, send it to the api server
        if(getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }

                //open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                
                //access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');

                //clear all items in your store
                pizzaObjectStore.clear();

                alert('All saved pizza have been submitted!');
            })
            .catch(err => {
                console.log(err);
            }) 
        }
    }
}

//listen for app coming back online
window.addEventListener('online', uploadPizza);