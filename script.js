

loadpage("login.html");


function loadpage(page){
    fetch(page)
        .then(Response=> Response.text())
        .then(data=> {document.getElementById("main").innerHTML=data;});
    
}
function loadpage_cust(page){
    fetch(page)
        .then(Response=> Response.text())
        .then(data=> {document.getElementById("main_cust").innerHTML=data;
            if (page=="orders.html"){
                displayorders();
            }
            if (page=="spec.html"){
                displayspecial()
            }
        });
    
}
function loadpage_admin(page){
    fetch(page)
        .then(Response=> Response.text())
        .then(data=> {document.getElementById("admin").innerHTML=data;
            if (page=="order_adm.html"){
                displayorders_adm();
            }
        });
}
function findvalue(){
    var val=document.getElementById("role").value;
    if (val=="sel"){
        document.getElementById("error").innerHTML="*Please select an option";
    }
    if (val=="cust.html"){
        loadpage(val);
        loadpage_cust("customers.html");
    } 
    else if (val=="admin.html"){   
        loadpage(val)
        loadpage_admin("adm_home.html")}
    else{
        loadpage(val)
    }

}
let foods=[{
    fdname:"biriyani",
    price:150
},
{
    fdname:"shawarma",
    price:"120"
},
{
    fdname:"Burger",
    price:140
},
{
    fdname:"Icecream",
    price:60
},
{
    fdname:"Kfc Combo",
    price:799
},
{
    fdname:"Coco Cola",
    price:39
},
{
    fdname:"Sandwich",
    price:89
},
{
    fdname:"Pizza",
    price:149
}];
quantity=[1,1,1,1,1,1,1,1];
let orders=[];
function change_quant(index,count){
    quantity[index]+=count;
    if (quantity[index]<1){
        quantity[index]=1;
    }
    document.getElementById("quantity-" + index).textContent=quantity[index];
    document.getElementById("price-" + index).textContent=quantity[index]*foods[index].price;
}
function order_food(fd){
    let food=foods[fd];
    orders.push({name:food.fdname,
        quantity:quantity[fd],
        total:food.price*quantity[fd]
    });
    quantity[fd]=1;
    loadpage_cust("orders.html");
}
function displayorders(){
    const orderList=
        document.getElementById("orderlist");
    if (orders.length === 0) {

        orderList.innerHTML = `

            <p class="empty">
                You haven't ordered anything yet.
            </p>

        `;

        return;

    }


    orderList.innerHTML = "";


    let grandTotal = 0;


    orders.forEach(function(order,index) {

        grandTotal += order.total;


        const orderCard =
            document.createElement("div");


        orderCard.className ="order_card";

        orderCard.innerHTML = `

            <h2>
                ${order.name}
            </h2>

            <p>
                Quantity:
                ${order.quantity}
            </p>

            <p>
                Price:
                ₹${order.total}
            </p>
            <button onclick="cancelorder(${index})">X</button>
        `;
        
        
        orderList.appendChild(orderCard);

    });
    const total_card=document.createElement("div");
    total_card.className="total-card";
    total_card.innerHTML=`
        <p>Total Price ${grandTotal}</p>
    `;
    orderList.appendChild(total_card);
}
function cancelorder(index){
    let removed = orders[index];
    orders.splice(index, 1);
    if(removed.special){
        let admIndex = adm_orders.findIndex(
            item =>
                item.name === removed.name &&
                item.quantity === removed.quantity &&
                item.total === removed.total
        );

        if(admIndex !== -1){
            adm_orders.splice(admIndex, 1);
        }
    }

    displayorders();
}
let new_food=[];
function add_details(){
    let new_fdname=document.getElementById("new_fdname").value;
    let new_fdprice=document.getElementById("new_fdprice").value;
    let file=document.getElementById("image_upload").files[0];
    new_food.push({
        fdnames:new_fdname,
        fdprice:new_fdprice,
        image:file,
        quantities:1
    });
    document.getElementById("new_fdname").value = "";
    document.getElementById("new_fdprice").value = "";
    document.getElementById("image_upload").value = "";
    
}
function displayspecial(){
    const spec_list=document.getElementById("spec-list");
    if (new_food.length==0){
        spec_list.innerHTML=`<p align="center">SPECIAL OFFERS IS NOT AVAILABLE AT NOW</p>`;
        return;
    }
    spec_list.innerHTML="";
    new_food.forEach(function(new_fd,index){
        const spec_card=document.createElement("div");
        spec_card.className="spec-card";
        spec_card.innerHTML=`
            <h2>${new_fd.fdnames}</h2>
            <img src=${URL.createObjectURL(new_fd.image)}>
            <p id="new_price-${index}">${new_fd.fdprice}</p>
            <div class=buttons>
            <button onclick="change_quantities(${index},-1)">-</button>
            <span id="quantities-${index}">1</span>
            <button onclick="change_quantities(${index},1)">+</button>
            </div>
            <button onclick="order_newfood(${index})" class="button-order">BUY NOW</button>

        `;
        spec_list.appendChild(spec_card);
    });
    
}
function change_quantities(index,n){
    let fdd=new_food[index];
    fdd.quantities+=n;
    if (fdd.quantities<1){
        document.getElementById("quantities-"+index).textContent=1;
    }
    else{
        document.getElementById("quantities-"+index).textContent=fdd.quantities;
        document.getElementById("new_price-"+index).textContent=fdd.quantities*fdd.fdprice;
    }
}
let m;
let adm_orders=[]
function order_newfood(index){
    let newfd=new_food[index];
    orders.push({name:newfd.fdnames,
        quantity:newfd.quantities,
        total:newfd.fdprice*newfd.quantities,
        special:true
    });
    m=orders.length-quantity.length;
    adm_orders.push({name:newfd.fdnames,
        quantity:newfd.quantities,
        total:newfd.fdprice*newfd.quantities
    });
    newfd.quantities=1;
    loadpage_cust("orders.html");
}
function displayorders_adm(){
    const adm_orderList=
        document.getElementById("adm_orderlist");
    if (adm_orders.length==0) {
        adm_orderList.innerHTML = `
            <p class="empty">
                WE DIDN'T GET ANY ORDERS.
            </p>
        `;
        return;
    }
    adm_orderList.innerHTML = "";
    adm_orders.forEach(function(order,index) {
        const adm_orderCard =
            document.createElement("div");
        adm_orderCard.className ="adm_order_card";

        adm_orderCard.innerHTML = `

            <h2>
                ${order.name}
            </h2>

            <p>
                Quantity:
                ${order.quantity}
            </p>

            <p>
                Price:
                ₹${order.total}
            </p>
        `;
        adm_orderList.appendChild(adm_orderCard);
    });
}