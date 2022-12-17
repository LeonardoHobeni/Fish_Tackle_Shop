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
    loadDataStore();
    mainPage= document.getElementById(id);
    doShowMenu();
}

function doLoadData()
{
    stringDataStore=[];
    jsonString= localStorage.getItem(storeName);
    if(jsonString == null)
        return EMPTY_STORE;
    try
    {
        stringDataStore= JSON.parse(jsonString);
    }
    catch
    {
        return INVALID_STORE;
    }
    return LOAD_STORE_OK;

}

function loadDataStore()
{
    dataStore=[]
    switch(doLoadData())
    {
        case 0:
            alert('An empty store has been created');
            dataStore=[];
            break;
        case 1:
            alert('Local store data has been corrupted');
            dataStore=[];
            break;
        case 2:
            for(let item of stringDataStore)
                dataStore[dataStore.length]= StockItems.JSONparse(item);
            alert('Data loaded successfully');
            break;
        
    }
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

function doListStockItems()
{
    createList('Stock List', dataStore);
}

function createList(title, dataStore)
{
    openPage(title);
    for(let item of dataStore)
    {
        var itemElement= createListElement(item);
        mainPage.appendChild(itemElement);
    }
}

function createListElement(item)
{
    var listPar= document.createElement('p');
    listPar.className= 'listPar';

    //create button
    var listBtn= document.createElement('button');
    listBtn.className= 'listBtn';
    listBtn.innerText= 'Update';
    var doFunctionCall= "doUpdateItem('"+item.stockRef+"')";
    listBtn.setAttribute('onclick', doFunctionCall);
    listPar.appendChild(listBtn);

    //create item description element
    var descPar= document.createElement('p');
    descPar.className="listDesc";
    descPar.innerText= item.getDescription();
    listPar.appendChild(descPar);
    return listPar;
}

function doUpdateItem(refer)
{
    activeItem=doFindItem(refer);
    openPage('Update '+activeItem.stockRef);
    activeItem.getHTML(mainPage);
    activeItem.sendToHTML();
    showMenu(
        [
            {capt: 'Save update', label: 'Save', func: 'doSaveUpdate()'},
            {capt: 'Cancel update', label: 'Cancel', func: 'doCancelUpdate()'},
        ]
    );

}

function doSaveUpdate()
{
    activeItem.loadFromHTML();
    dataStore[getItemPos(activeItem.stockRef)]= activeItem;
    doSaveDataStore();
    alert(activeItem.type+' '+activeItem.stockRef+' updated');
    doShowMenu();
}

function getItemPos(refer)
{
    for(let i=0; i<dataStore.length; i+=1)
        if(dataStore[i].stockRef==Number(refer))
            return i;
    return NaN;
}

function doUpdateStock()
{
    openPage("Update Stock");
    createReferencePanel();
    showMenu(
        [
            {capt: 'Find item', label: 'Find', func: 'doFind()'},
            {capt: 'Cancel update', label: 'Cancel', func: 'doCancelUpdate()'},
        ]
    );
}

function createReferencePanel()
{
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
}

function doFind()
{
    var itemElement= document.getElementById('reference');
    activeItem= doFindItem(itemElement.value);
    if(activeItem !== null)
    {   
        openPage('Update '+activeItem.stockRef);
        activeItem.getHTML(mainPage);
        activeItem.sendToHTML();
        showMenu(
            [
                {capt: 'Save update', label: 'Save', func: 'doSaveUpdate()'},
                {capt: 'Cancel update', label: 'Cancel', func: 'doCancelUpdate()'},
            ]
        );
    }
    else
    {
        alert("Item of reference "+itemElement.value+" not found");
        doShowMenu();
    }
}

function doFindItem(refer)
{
    for(let item of dataStore)
    {
        if(item.stockRef == Number(refer))
            return item;
    }
    return null;
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
    addStockItem(BackPack);
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
    doSaveDataStore();
    alert(activeItem.type+ ' '+activeItem.stockRef+" added");
    doShowMenu();
}

function doSaveDataStore()
{
    stringDataStore=[];
    for(let item of dataStore)
        stringDataStore[stringDataStore.length]= item.JSONstringify();
    doSaveDataToLocal();
}

function doSaveDataToLocal()
{
    jsonString= JSON.stringify(stringDataStore);
    localStorage.setItem(storeName, jsonString);
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