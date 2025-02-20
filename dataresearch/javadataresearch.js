let allData = []; // เก็บข้อมูลทั้งหมดไว้
let currentPage = 1; // หน้าเริ่มต้น
const rowsPerPage = 15; // จำนวนแถวที่จะแสดงในแต่ละหน้า

async function fetchData() {
    const apiUrl = "https://script.google.com/macros/s/AKfycbw6Y7vsLGtPPWAk3g29WXizomynDMIwBKl1Z-N8pgAGq_2Ds3yNK6Kv_Mv_2jATLfT_/exec";

   // ✅ แสดง Spinner ก่อนโหลดข้อมูล
   document.getElementById("loadingSpinner").style.display = "flex";

   try {
       let response = await fetch(apiUrl);
       let data = await response.json();

       // แสดงข้อมูลในคอนโซลเพื่อเช็ค
       console.log(data);

       allData = data; // เก็บข้อมูลทั้งหมด
       updateTable(allData);

   } catch (error) {
       console.error("Error fetching data:", error);
   } 
   
   finally {
       // ✅ ซ่อน Spinner หลังจากโหลดข้อมูลเสร็จ
       document.getElementById("loadingSpinner").style.display = "none";
   }
}


function updateTable(data) {
    const tableBody = document.getElementById("dataTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    const filteredData = data.filter(item => item.some(cellData => cellData !== "" && cellData !== null));

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    currentData.forEach(item => {
        const row = tableBody.insertRow();
        item.forEach(cellData => {
            const cell = row.insertCell();
            cell.textContent = cellData || "-"; // ถ้าไม่มีข้อมูลให้ใส่ "-"
        });
    });

    // ✅ กำหนดค่าตัวแปรก่อนใช้งาน

    const exepeoples = filteredData.filter(item => item[60]?.trim() === "ปลด").length;
    const normal = filteredData.filter(item => item[60]?.trim() === "ปกติ").length;
    const death = filteredData.filter(item => item[60]?.trim() === "เสียชีวิต").length;
    const out = filteredData.filter(item => item[60]?.trim() === "หนี").length;
    const lack = filteredData.filter(item => item[60]?.trim() === "ขาด").length;
    

    // ✅ เช็คว่า Element มีอยู่หรือไม่ ก่อนอัปเดตค่า
    if (document.getElementById("pageNumber")) {
        document.getElementById("pageNumber").textContent = `หน้า ${currentPage}`;
    }
    
    if (document.getElementById("exepeoples")) {
        document.getElementById("exepeoples").textContent = `จำนวนปลดประจำการ: ${exepeoples} คน`;
    }
    if (document.getElementById("lack")) {
        document.getElementById("lack").textContent = `จำนวนปลดประจำการ: ${lack} คน`;
    }
    if (document.getElementById("death")) {
        document.getElementById("death").textContent = `จำนวนที่เสียชีวิต: ${death} คน`;
    }
   
    if (document.getElementById("out")) {
        document.getElementById("out").textContent = `จำนวนที่หนีราชการ: ${out} คน`;
    }
    if (document.getElementById("normal")) {
        document.getElementById("normal").textContent = `จำนวนที่ยังไม่ปลด: ${normal} คน`;
    }
}


// ฟังก์ชั่นไปหน้าถัดไป
function nextPage() {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateTable(allData);
    }
}

// ฟังก์ชั่นย้อนกลับไปหน้าก่อนหน้า
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable(allData);
    }
}

function searchData() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase();

    const filteredData = allData.filter(item => {
        return item.some(cellData => {
            return cellData && cellData.toString().toLowerCase().includes(searchQuery);
        });
    });

    updateTable(filteredData);
}


const SHEET_ID = '15ZJeQBoo1YARUHyYBmF0iuFDquO7faGtZW8aDPe5itA'; // Sheet ID
const API_KEY = 'AIzaSyCsv9cmJR2V35wc_c4gmqTAk3o00bscLv0'; // API Key
const RANGE = 'Sheet!A1:BJ1000'; // ระบุช่วงข้อมูลที่ต้องการดึง

function downloadExcel() {
    // สร้าง URL สำหรับดึงข้อมูลจาก Google Sheets API
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

    // ดึงข้อมูลจาก Google Sheets
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.values && data.values.length > 0) {
                // แปลงข้อมูลเป็น Excel
                generateExcel(data.values);
            } else {
                console.log('No data found.');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function generateExcel(data) {
    // แปลงข้อมูลเป็น worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ข้อมูลทหาร");

    // ดาวน์โหลดไฟล์ Excel
    XLSX.writeFile(wb, "ข้อมูลทหาร.xlsx");
}
// เลือกลิงก์ทั้งหมดที่มีคลาส "menu-link"
const links = document.querySelectorAll('.menu-link');

// เพิ่ม event listener ให้กับลิงก์ทั้งหมด
links.forEach(link => {
    link.addEventListener('click', function(event) {
        // ลบคลาส 'active' จากทุกลิงก์
        links.forEach(l => l.classList.remove('active'));
        
        // เพิ่มคลาส 'active' ให้กับลิงก์ที่คลิก
        this.classList.add('active');
    });
});

// เรียกใช้ฟังก์ชั่น fetchData เมื่อโหลดหน้าเว็บ
window.onload = fetchData;
