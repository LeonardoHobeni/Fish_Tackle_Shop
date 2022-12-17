class StockItems{

    constructor(stockLevel, stockRef, price, brand, description, packageWeight)
    {
        this.stockLevel= stockLevel;
        this.stockRef= stockRef;
        this.price= price;
        this.brand= brand;
        this.description= description;
        this.packageWeight= packageWeight;
    }

    getDescription()
    {
        var result= "Ref:"+this.stockRef
            +" Price:"+this.price
            +" Description:"+this.description
            +" Brand:"+this.brand
            +" Stock:"+this.stockLevel
            +" Weight:"+this.packageWeight;
        return result;
    }

    static getLargestStockRef(items)
    {
        if(items.length == 0)
            return 0;

        var largest= items[0].stockRef;

        for(let item of items)
            if(item.stockRef > largest)
                largest= item.stockRef;
        return largest;
    }

    static stockSchema= [
        {id: 'price', prompt: 'Price', type: 'input'},
        {id: 'stockLevel', prompt: 'Stock level', type: 'input'},
        {id: 'description', prompt: 'Description', type: 'textarea', rows:'4', cols:'30'},
        {id: 'brand', prompt: 'Brand', type: 'input'},
        {id: 'packageWeight', prompt: 'Weight', type: 'input'},
    ];

    static makeItemElement(item)
    {
        var inputPar= document.createElement('p');

        //create label element
        var inpLabel= document.createElement('label');
        inpLabel.className="inputLabel";
        inpLabel.innerText= item.prompt+":";
        inpLabel.setAttribute('for', item.id);
        inputPar.appendChild(inpLabel);

        //create input element
        var inpElement;
        switch(item.type)
        {
            case 'input':
                inpElement= document.createElement('input');
                inpElement.className= 'inputText';
                break;
            case 'textarea':
                inpElement= document.createElement('textarea');
                inpElement.className='inputTextArea';
                break;
        }

        inpElement.setAttribute('id', item.id);
        inputPar.appendChild(inpElement);
        return inputPar;
    }

    static buildHTMLStockELement(containerElement, dataSchema)
    {
        for(let item of dataSchema)
        {
            var itemElement= StockItems.makeItemElement(item);
            containerElement.appendChild(itemElement);
        }
    }

    getHTML(containerElement)
    {
        StockItems.buildHTMLStockELement(containerElement, StockItems.stockSchema);
    }

    loadFromHTML()
    {
        for(let item in this)
        {
            if(item == 'stockRef' || item == 'type')
                continue;
            else
            {
                var propElement= document.getElementById(item);
                this[item]= propElement.value;
            }
        }
    }

    sendToHTML()
    {
        for(let item in this)
        {
            if(item == 'stockRef' || item == 'type')
                continue;
            else
            {
                var propElement= document.getElementById(item);
                propElement= this[item];
            }
        }
    }
}

class Aerosol extends StockItems{
    constructor(stockLevel, stockRef, price, brand, description, packageWeight,
        scent)
    {
        super(stockLevel, stockRef, price, brand, description, packageWeight);
        this.type='aerosol';
        this.scent=scent;
    }

    getDescription()
    {
        var result= super.getDescription()
            +" Scent:"+this.scent;
        return result;
    }

    static aerosolSchema= [
        {id: 'scent', prompt: 'Scent', type: 'input'}
    ];

    getHTML(containerElement)
    {
        super.getHTML(containerElement);
        StockItems.buildHTMLStockELement(containerElement, Aerosol.aerosolSchema);
    }
}

class Backpack extends StockItems{
    constructor(stockLevel, stockRef, price, brand, description, packageWeight,
        design, color)
    {
        super(stockLevel, stockRef, price, brand, description, packageWeight);
        this.type='backpack';
        this.design=design;
        this.color=color;
    }

    getDescription()
    {
        var result= super.getDescription()
            +" Design:"+this.design
            +" Color:"+this.color;
        return result;
    }

    static backpackSchema= [
        {id: 'design', prompt: 'Design', type: 'input'},
        {id: 'color', prompt: 'Color', type: 'input'},
    ];

    getHTML(containerElement)
    {
        super.getHTML(containerElement);
        StockItems.buildHTMLStockELement(containerElement, Backpack.backpackSchema);
    }
}