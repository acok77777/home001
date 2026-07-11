// =========================
// 기본 설정
// =========================

let currentYear = 2026;
let currentMonth = 1;

let data = JSON.parse(localStorage.getItem("billData")) || {};


// =========================
// 화면 요소
// =========================

const homePage = document.getElementById("homePage");
const monthPage = document.getElementById("monthPage");

const yearText = document.getElementById("year");
const monthList = document.getElementById("monthList");

const monthTitle = document.getElementById("monthTitle");
const tableBody = document.getElementById("tableBody");

const totalMoney = document.getElementById("totalMoney");

const prevYear = document.getElementById("prevYear");
const nextYear = document.getElementById("nextYear");

const addBtn = document.getElementById("addBtn");
const copyBtn = document.getElementById("copyBtn");

const saveBtn = document.getElementById("saveBtn");
const backBtn = document.getElementById("backBtn");


// =========================
// 시작
// =========================

showYear();



// =========================
// 첫 화면 월 표시
// =========================

function showYear(){

    yearText.innerText = currentYear;

    monthList.innerHTML = "";


    for(let i=1; i<=12; i++){

        let btn = document.createElement("button");

        btn.className = "monthBtn";

        // 월별 색상 적용
        btn.classList.add("month"+i);


        btn.innerText = i+"월";


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
// 월 화면 열기
// =========================

function openMonth(month){

    currentMonth = month;


    homePage.style.display="none";

    monthPage.style.display="block";


    monthTitle.innerText =
    currentYear+"년 "+currentMonth+"월 공과금";


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



    // 처음 들어가는 달이면 기본 10줄 생성

    if(!data[key]){


        data[key]=[];


        for(let i=0;i<10;i++){


            data[key].push({

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
value="${Number(item.money).toLocaleString()}">
    </td>


    <td>
    <input class="memo"
    value="${item.memo}">
    </td>


    <td>
    <button class="deleteBtn">
    삭제
    </button>
    </td>

    `;



    let inputs = tr.querySelectorAll("input");



    inputs[0].oninput = saveCurrent;

    inputs[1].onchange = saveCurrent;


 inputs[2].oninput=function(){


    let value = this.value.replace(/,/g,"");


    if(value){

        this.value = Number(value).toLocaleString();

    }


    saveCurrent();

    calculateTotal();


};


    inputs[3].oninput = saveCurrent;



    tr.querySelector(".deleteBtn")
    .onclick=function(){


        data[getKey()].splice(index,1);


        saveData();


        loadTable();


    };



    tableBody.appendChild(tr);


}



// =========================
// 행 추가
// =========================

addBtn.onclick=function(){


    data[getKey()].push({

        name:"",
        check:false,
        money:"",
        memo:""

    });


    loadTable();


};



// =========================
// 현재 내용 저장
// =========================

function saveCurrent(){


    let rows =
    tableBody.querySelectorAll("tr");


    let arr=[];


    rows.forEach(row=>{


        let input =
        row.querySelectorAll("input");


        arr.push({

            name:input[0].value,

            check:input[1].checked,

           money:Number(input[2].value.replace(/,/g,"")),

            memo:input[3].value

        });


    });



    data[getKey()] = arr;


    saveData();


}




function saveData(){

    localStorage.setItem(
        "billData",
        JSON.stringify(data)
    );

}



// =========================
// 총합 계산
// =========================

function calculateTotal(){


    let total=0;


    if(data[getKey()]){


        data[getKey()].forEach(item=>{


            total += Number(item.money) || 0;


        });


    }



    totalMoney.innerText =
    total.toLocaleString()+"원";


}



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



    let beforeKey=y+"-"+m;



    if(!data[beforeKey]){


        alert("지난달 데이터가 없습니다.");

        return;

    }



    data[getKey()] =
    JSON.parse(
        JSON.stringify(data[beforeKey])
    );


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
