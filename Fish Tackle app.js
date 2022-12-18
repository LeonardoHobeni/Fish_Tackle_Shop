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
    if(JSON.parse(jsonString) == null)
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
            {capt: 'Update Stock item', label: 'Update', func: 'doUpdateStock()'},
            {capt: 'Delete stock item', label: 'Delete item', func: 'doDeleteStock()'},
            {capt: 'List stock items', label: 'List', func: 'doListStockItems()'},
            {capt: 'Apply discount', label: 'Discount', func: 'doApplyDiscount()'},
            {capt: 'Data Analysis', label: 'Analysis', func: 'displayDataAnalysisMenu()'},
        ]
    );
}

function displayDataAnalysisMenu()
{
    openPage('Analysis Menu');
    showMenu(
        [
            {capt: 'Order by price', label: 'Price', func: 'doOrderByPrice()'},
            {capt: 'Order by stock level', label: 'Stock Level', func: 'doOrderByStockLevel()'},
            {capt: 'Order by investment', label: 'Investment', func: 'doOrderByInvestment()'},
            {capt: 'Zero stock item list', label: 'Zero Stock', func: 'doListZeroStockList()'},
            {capt: 'Total Stock value', label: 'Total', func: 'displayTotalStockValue()'},
            {capt: 'Go back to main', label: 'Main menu', func: 'doShowMenu()'},
        ]
    );
}

function displayTotalStockValue()
{
    var total= dataStore.reduce(
        (total, item) => total+(item.price*item.stockLevel),0
    );
    alert('Total stock value is '+total);
}

function doListZeroStockList()
{
    var zeroStockListItem= dataStore.filter((a) => {return a.stockLevel == 0});
    createList('Zero stock items', zeroStockListItem); 
}

function doOrderByInvestment()
{
    dataStore.sort((a,b) => {return b.price*b.stockLevel - a.price*a.stockLevel});
}

function doOrderByStockLevel()
{
    dataStore.sort((a,b) => {return a.stockLevel - b.stockLevel});
}

function doOrderByPrice()
{
    dataStore.sort((a,b) => {return b.price - a.price});
}

function doApplyDiscount()
{
    dataStore.map((item) => item.price=(item.price)*0.90);
    alert('10% discount applied on all items in stock');
}

function doDeleteStock()
{
    openPage('Delete stock item');
    createReferencePanel();
    showMenu(
        [
            {capt: 'Delete item', label: 'Delete', func: 'doDelete()'},
            {capt: 'Cancel deletion', label: 'Cancel', func: 'doCancelUpdate()'},
        ]
    );
    
}

function doDelete()
{
    var itemElement= document.getElementById('reference');
    activeItem=doFindItem(itemElement.value);
    if(activeItem !== null)
    {
        var response= confirm('Click OK button to confirm deletion');
        if(response)
        {
            let tempArr=[];
            for(let item of dataStore)
            {
                if(item.stockRef == activeItem.stockRef)
                    continue;
                else
                {
                    if(item.stockRef>activeItem.stockRef)
                    {   
                        item.stockRef= (item.stockRef-1);
                        tempArr[tempArr.length]= item;
                    }
                    else
                        tempArr[tempArr.length]= item;
                }
            }
            dataStore= tempArr;
            doSaveDataStore();
            alert('Item: \n'+deletedItemDesc()+'\n\n Has Been Deleted');
            doShowMenu();
        }
        else
        {
            alert('Operation Cancelled');
            doShowMenu();
        }
    }
    else
    {
        alert("Item of reference "+itemElement.value+" not found");
        doShowMenu();
    }
}

function deletedItemDesc()
{   
    
    var result= activeItem.getDescription();
    return result;
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
    var doFunctionCall1= "doUpdateItem('"+item.stockRef+"')";
    var doFunctionCall2= 'doDeleteItem("'+item.stockRef+'")';
    var btnSchema= [
        {label: 'Update', func: doFunctionCall1},
        {label: 'Delete', func: doFunctionCall2},
    ];
    createListBtn(btnSchema, listPar);

    //create item description element
    var descPar= document.createElement('p');
    descPar.className="listDesc";
    descPar.innerText= item.getDescription();
    listPar.appendChild(descPar);
    return listPar;
}

function doDeleteItem(refer)
{
    activeItem=doFindItem(refer);
    var response= confirm('Click OK button to confirm deletion');
    if(response)
    {
        let tempArr=[];
        for(let item of dataStore)
        {
            if(item.stockRef == activeItem.stockRef)
                continue;
            else
            {
                if(item.stockRef>activeItem.stockRef)
                {   
                    item.stockRef= (item.stockRef-1);
                    tempArr[tempArr.length]= item;
                }
                else
                    tempArr[tempArr.length]= item;
            }
        }
        dataStore= tempArr;
        doSaveDataStore();
        alert('Item: \n'+deletedItemDesc()+'\n\n Has Been Deleted');
        doShowMenu();
    }
    else
    {
        alert('Operation Cancelled');
        doShowMenu();
    }
}

function createListBtn(schema, listPar)
{
    for(let item of schema)
    {
        var listBtn= document.createElement('button');
        listBtn.className= 'listBtn';
        listBtn.innerText= item.label;
        listBtn.setAttribute('onclick', item.func);
        listPar.appendChild(listBtn);
    }
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
    alert('Operation Cancelled');
    doShowMenu();
}

function doCancelAdd()
{
    alert('Operation Cancelled');
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
            {capt: 'Cancel Item', label: 'Cancel', func: 'doCancelAdd()'},
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
    if(stringDataStore.length>0)
    {
        jsonString= JSON.stringify(stringDataStore);
        localStorage.setItem(storeName, jsonString);
    }
    else
    {
        jsonString=null;
        localStorage.setItem(storeName, jsonString);
    }
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