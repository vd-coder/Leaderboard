
const element=document.getElementById("refresh")
 async function  listener()
{
    const result=await axios.get("refresh")
    console.log(result);
    const table=document.getElementById("board")
    const tableBody=document.getElementById("board_body");
    if(tableBody)
    tableBody.remove();
    const tabBody=document.createElement("tbody");
    tabBody.setAttribute("id","board_body");
    
    for(let ctr=0;ctr<result.data.length;ctr=ctr+2)
    {
        const entry=document.createElement("tr");
        const th=document.createElement("th");
        th.setAttribute("scope","row");
        th.innerHTML=(ctr/2)+1;
        const td=document.createElement("td");
        td.innerHTML=result.data[ctr+1];
        const td1=document.createElement("td");
        td1.innerHTML=result.data[ctr];
        entry.appendChild(th);
        entry.appendChild(td);
        entry.appendChild(td1);
        tabBody.appendChild(entry);
        
    }
    table.appendChild(tabBody);
    oldh1=document.getElementById("my_h1");
    if(oldh1)
    {
        oldh1.remove();
        
    }
    h1=document.createElement("h1");
    h1.setAttribute("id","my_h1");
    h1.innerHTML=`My Rank : ${result.headers.myrank}`;
    div=document.getElementById("my_div")
    if(div)
    div.appendChild(h1);
}

if(window.location.pathname==="/")
{

    listener();
    
}
element.addEventListener("click",listener)
