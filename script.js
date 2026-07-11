// =========================
// 기본 설정
// =========================

let currentYear = 2026;
let currentMonth = 1;

let data = JSON.parse(localStorage.getItem("billData")) || {};



// =========================
// 요소
// =========================

const homePage = document.getElementById("homePage");
const monthPage = document.getElementById("monthPage");

const yearText = document.getElementById("year");
const monthList = document.getElementById("monthList");

const monthTitle = document.getElementById("monthTitle");
const tableBody = document.getElementById("tableBody");

const totalMoney = document.getElementById("totalMoney");

const searchInput = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");
const resultBody = document.getElementById("resultBody");
const searchTotalMoney = document.getElementById("searchTotalMoney");


const prevYear = document.getElementById("prevYear");
const nextYear = document.getElementById("nextYear");

const addBtn = document.getElementById("addBtn");
const copyBtn = document.getElementById("copyBtn");

const saveBtn = document.getElementById("saveBtn");
const backBtn = document.getElementById("backBtn");




// =========================
// 카테고리
// =========================

const categories=[

"🏠 공과금",
"📚 학원비",
"💳 대출금",
"🍚 식비",
"🚗 교통비",
"🏥 병원",
"🛒 생활비",
"기타"

];




// =========================
// 시작
// =========================

showYear();




// =========================
// 년도 화면
// =========================

function showYear(){


yearText.innerText=currentYear;

monthList.innerHTML="";



for(let i=1;i<=12;i++){


let btn=document.createElement("button");

btn.className="monthBtn";

btn.classList.add("month"+i);


btn.innerText=i+"월";


btn.onclick=function(){

openMonth(i);

};


monthList.appendChild(btn);


}


}





// =========================
// 년도 이동
// =========================


prevYear.onclick=function(){

currentYear--;

showYear();

};



nextYear.onclick=function(){

currentYear++;

showYear();

};





// =========================
// 월 열기
// =========================


function openMonth(month){


currentMonth=month;


homePage.style.display="none";

monthPage.style.display="block";


monthTitle.innerText =
currentYear+"년 "+currentMonth+"월 공과금";


searchInput.value="";

searchResult.style.display="none";


loadTable();


}




// =========================
// 저장 키
// =========================


function getKey(){

return currentYear+"-"+currentMonth;

}
// =========================
// 표 불러오기
// =========================

function loadTable(){

    tableBody.innerHTML="";


    let key=getKey();



    if(!data[key]){


        data[key]=[];


        for(let i=0;i<10;i++){


            data[key].push({

                category:"기타",
                name:"",
                check:false,
                money:"",
                memo:""

            });


        }


        saveData();

    }



    data[key].forEach((item,index)=>{


        createRow(item,index);


    });



    calculateTotal();

}





// =========================
// 행 생성
// =========================

function createRow(item,index){


let tr=document.createElement("tr");



tr.innerHTML=`

<td>

<select class="category">

${categories.map(c=>`

<option ${item.category===c?"selected":""}>
${c}
</option>

`).join("")}

</select>

</td>



<td>

<input class="name" value="${item.name}">

</td>



<td>

<input type="checkbox"
${item.check ? "checked":""}>

</td>



<td>

<input class="money"
type="text"
inputmode="numeric"
value="${item.money ? Number(item.money).toLocaleString():""}">

</td>



<td>

<input class="memo"
value="${item.memo}">

</td>



<td>

<button class="moveBtn upBtn">
⬆
</button>

<button class="moveBtn downBtn">
⬇
</button>

</td>



<td>

<button class="deleteBtn">
삭제
</button>

</td>

`;




let inputs=tr.querySelectorAll("input,select");



// 카테고리

inputs[0].onchange=saveCurrent;


// 내용

inputs[1].oninput=saveCurrent;


// 체크

inputs[2].onchange=saveCurrent;




// 금액

inputs[3].oninput=function(){


let value=this.value.replace(/,/g,"");


if(value){

this.value=Number(value).toLocaleString();

}


saveCurrent();

calculateTotal();


};




// 비고

inputs[4].oninput=saveCurrent;



tableBody.appendChild(tr);



}





// =========================
// 현재 내용 저장
// =========================

function saveCurrent(){


let rows=tableBody.querySelectorAll("tr");


let arr=[];



rows.forEach(row=>{


let select =
row.querySelector(".category");


let inputs =
row.querySelectorAll("input");



arr.push({

category:select.value,

name:inputs[0].value,

check:inputs[1].checked,

money:Number(
inputs[2].value.replace(/,/g,"")
),

memo:inputs[3].value


});


});



data[getKey()]=arr;


saveData();



}





// =========================
// 데이터 저장
// =========================

function saveData(){


localStorage.setItem(

"billData",

JSON.stringify(data)

);


}





// =========================
// 총합
// =========================

function calculateTotal(){


let total=0;



if(data[getKey()]){


data[getKey()].forEach(item=>{


total += Number(item.money)||0;


});


}



totalMoney.innerText =
total.toLocaleString()+"원";


}





// =========================
// 전체 검색 기능
// =========================

searchInput.addEventListener("input",function(){


let keyword =
this.value.trim().toLowerCase();



if(keyword===""){


searchResult.style.display="none";


loadTable();


return;

}



resultBody.innerHTML="";


let total=0;



Object.keys(data).forEach(key=>{


let arr=data[key];



arr.forEach(item=>{


let text=

(item.category||"")+
(item.name||"")+
(item.memo||"");



if(
text.toLowerCase()
.includes(keyword)
){



let money=
Number(item.money)||0;


total+=money;



let parts=key.split("-");


let year=parts[0];

let month=parts[1];



let tr=document.createElement("tr");



tr.innerHTML=`

<td>
${year}년 ${month}월
</td>


<td>
${item.category}
</td>


<td>
${item.name}
</td>


<td>
${money.toLocaleString()}원
</td>

`;



resultBody.appendChild(tr);



}



});


});



searchTotalMoney.innerText =
total.toLocaleString()+"원";



searchResult.style.display="block";



});
// =========================
// 행 추가
// =========================

addBtn.onclick=function(){


    data[getKey()].push({

        category:"기타",

        name:"",

        check:false,

        money:"",

        memo:""

    });


    saveData();

    loadTable();


};






// =========================
// 삭제 / 이동 버튼
// =========================

tableBody.addEventListener("click",function(e){



let row=e.target.closest("tr");


if(!row) return;



let index =
[...tableBody.children].indexOf(row);




// 삭제

if(e.target.classList.contains("deleteBtn")){


    data[getKey()].splice(index,1);


    saveData();


    loadTable();


}





// 위로 이동

if(e.target.classList.contains("upBtn")){


    if(index>0){


        let arr=data[getKey()];


        [arr[index-1],arr[index]]=
        [arr[index],arr[index-1]];



        saveData();


        loadTable();


    }


}





// 아래로 이동

if(e.target.classList.contains("downBtn")){


    let arr=data[getKey()];


    if(index<arr.length-1){



        [arr[index+1],arr[index]]=
        [arr[index],arr[index+1]];



        saveData();


        loadTable();


    }


}



});







// =========================
// 지난달 불러오기
// =========================

copyBtn.onclick=function(){



let y=currentYear;

let m=currentMonth-1;



if(m===0){

    m=12;

    y--;

}



let beforeKey =
y+"-"+m;




if(!data[beforeKey]){


alert("지난달 데이터가 없습니다.");

return;


}





data[getKey()] =

JSON.parse(

JSON.stringify(data[beforeKey])

);



saveData();


loadTable();



alert("지난달 내용을 불러왔습니다.");



};






// =========================
// 저장 버튼
// =========================

saveBtn.onclick=function(){


saveCurrent();


alert("저장되었습니다.");



};








// =========================
// 나가기
// =========================

backBtn.onclick=function(){


saveCurrent();



monthPage.style.display="none";


homePage.style.display="block";



showYear();



};
