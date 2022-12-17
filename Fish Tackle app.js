var mainPage; //variable to hold the reference to an html container
var activeItem;//variable to hold the reference to an item instance
var dataStore=[];//array variable to hold the item objects
var stringDataStore=[];//array variable to hold the stringified item objects
var jsonString;//variable to hold the stringified stringDataStore array
var storeName;
const EMPTY_STORE=0, INVALID_STORE=1, LOAD_STORE_OK=2;//signal values or flag values

function doStartApp(id, name)
{
    storeName= name;
    mainPage= document.getElementById(id);
    doShowMenu();
}

function openPage(title)
{
    clearPage(mainPage);
    var titlePar= document.createElement('p');
    titlePar.className='mainTitle';
    titlePar.innerText=title;
    mainPage.appendChild(titlePar);
}

function clearPage(containerElement)
{
    while(containerElement.children.length > 0)
        containerElement.removeChild(containerElement.children[0]);
}

function doShowMenu()
{
    openPage('Main Menu');
    
    showMenu(
        [
            {capt: 'Add Aerosol', label: 'Aerosol', func: 'doAddAerosol()'},
            {capt: 'Add Backpack', label: 'Backpack', func: 'doAddBackPack()'},
            {capt: 'Update Stock', label: 'Update', func: 'doUpdateStock()'},
            {capt: 'List stock items', label: 'List', func: 'doListStockItems()'},
            {capt: 'Data Analysis', label: 'Analysis', func: 'displayDataAnalysisMenu()'},
        ]
    );
}

function doUpdateStock()
{
    openPage("Update Stock");
    
    //create reference input panel
    var inputPar= document.createElement('p');

    //create label
    var inpLabel= document.createElement('label');
    inpLabel.className= "inputLabel";
    inpLabel.innerText= "Reference:";
    inpLabel.setAttribute('for', 'reference');
    inputPar.appendChild(inpLabel);

    //create input element
    var inputElement= document.createElement('input');
    inputElement.className='inputText';
    inputElement.setAttribute('id', 'reference');
    inputPar.appendChild(inputElement);
    mainPage.appendChild(inputPar);
    showMenu(
        [
            {capt: 'Find item', label: 'Find', func: 'doFindItem()'},
            {capt: 'Cancel update', label: 'Cancel', func: 'doCancelUpdate()'},
        ]
    );
}

function doCancelUpdate()
{
    doShowMenu();
}

function doAddAerosol()
{
    addStockItem(Aerosol);
}

function doAddBackPack()
{
    addStockItem(Backpack);
}

function addStockItem(StockItem)
{
    activeItem= new StockItem();
    openPage('Add '+activeItem.type);
    activeItem.getHTML(mainPage);
    showMenu(
        [
            {capt: 'Save Item', label: 'Save', func: 'doSaveAdd()'},
            {capt: 'Cancel Item', label: 'Cancel', func: 'doShowMenu()'},
        ]
    );
}

function doSaveAdd()
{
    activeItem.loadFromHTML();
    activeItem.stockRef= StockItems.getLargestStockRef(dataStore)+1;
    dataStore[dataStore.length]= activeItem;
    alert(activeItem.type+ ' '+activeItem.stockRef+" added");
}

function showMenu(schema)
{
    for(let item of schema)
    {
        var itemElement= createOperationButton(item);
        mainPage.appendChild(itemElement);
    }
}

function createOperationButton(item)
{
    var btnPar= document.createElement('p');

    //create label
    var btnLabel= document.createElement('label');
    btnLabel.className='mainLabel';
    btnLabel.innerText= item.capt;
    btnLabel.setAttribute('for', item.label);
    btnPar.appendChild(btnLabel);

    //create button
    var btnElement= document.createElement('button');
    btnElement.className= 'mainButton';
    btnElement.innerText= item.label;
    btnElement.setAttribute('onclick', item.func);
    btnPar.appendChild(btnElement);

    return btnPar;
}