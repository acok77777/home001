// ===========================
// 월별 공과금 관리
// script.js (1부)
// ===========================

let year = 2026;

const home = document.getElementById("home");
const page = document.getElementById("page");
const yearText = document.getElementById("year");
const title = document.getElementById("title");
const tbody = document.getElementById("tbody");

let currentMonth = 1;

// 연도 변경
document.getElementById("prevYear").onclick = function () {
    year--;
    yearText.innerText = year;
};

document.getElementById("nextYear").onclick = function () {
    year++;
    yearText.innerText = year;
};

// 월 버튼 클릭
document.querySelectorAll(".month").forEach(function(btn){

    btn.onclick = function(){

        currentMonth = btn.dataset.month;

        openMonth();

    };

});

// 월 열기
function openMonth(){

    home.style.display = "none";

    page.style.display = "block";

    title.innerText = year + "년 " + currentMonth + "월";

    loadTable();

}

// 표 불러오기
function loadTable(){

    tbody.innerHTML = "";

    let key = year + "-" + currentMonth;

    let data = JSON.parse(localStorage.getItem(key));

    if(data == null){

        data = [];

        for(let i=0;i<15;i++){

            data.push({

                text:"",
                check:false,
                money:"",
                memo:""

            });

        }

    }

    data.forEach(function(row){

        let tr = document.createElement("tr");

        tr.innerHTML = `

        <td>

        <input type="text" value="${row.text}">

        </td>

        <td style="text-align:center">

        <input type="checkbox" ${row.check ? "checked":""}>

        </td>

        <td>

        <input type="text" value="${row.money}">

        </td>

        <td>

        <input type="text" value="${row.memo}">

        </td>

        `;

        tbody.appendChild(tr);

    });

}
// ===========================
// script.js (2부)
// ===========================

// 저장하기 버튼
document.getElementById("save").onclick = function(){

    let list = [];

    let rows = tbody.querySelectorAll("tr");

    rows.forEach(function(tr){

        let input = tr.querySelectorAll("input");

        list.push({

            text: input[0].value,
            check: input[1].checked,
            money: input[2].value,
            memo: input[3].value

        });

    });

    let key = year + "-" + currentMonth;

    localStorage.setItem(key, JSON.stringify(list));

    alert("저장되었습니다.");

};

// 나가기 버튼
document.getElementById("back").onclick = function(){

    page.style.display = "none";

    home.style.display = "block";

};

// 처음 실행
yearText.innerText = year;