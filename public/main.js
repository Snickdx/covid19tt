let selected;function registerSW(){"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(e=>{console.log("SW registered: ",e)}).catch(e=>{console.log("SW registration failed: ",e)})}function displayLastRecord(e){document.querySelector("#cases").innerHTML=e.cases.imported+e.cases.community,document.querySelector("#date").innerHTML=new Date(1e3*e.date).toLocaleDateString("en-US"),document.querySelector("#updateNum").innerHTML=e.updateNum}function displayMedia(e){let t="";for(let a of e)t+=`\n        <div class="card">\n            <div class="card-content black-text">\n                <span class="card-title">Update #: ${a.updateNum}</span>\n                <p>Date: ${new Date(1e3*a.date).toLocaleDateString("en-US")}</p>\n                <p>Tested: ${a.tested}</p>\n                <p>Contact: ${a.contact}</p>\n                <p>Imported Cases: ${a.cases.imported}</p>\n                <p>Community Cases: ${a.cases.community}</p>\n            </div>\n            <div class="card-action">\n                <a href="${a.url}" rel="noopener" target="_blank" style="font-weight: 700" class="red-text darken-2">View on Facebook</a>\n                <a href="#deleteModal" class="modal-trigger red-text darken-2" onclick="selected = ${a.id}" style="font-weight: 700">Delete</a>\n            </div>\n        </div>\n        `;document.querySelector("#media-list").innerHTML=t}function fixAccessbility(){let e=document.querySelector(".highslide-container>img");e.setAttribute("alt","highslide container image"),e.setAttribute("aria-hidden",!0)}function postData(e){getData()}function deleteData(){getData()}function createReport(e){e.preventDefault();let t=e.target.elements;postData({password:t.password,updateNum:t.updateNum,url:t.url,date:t.date,cases:{deaths:t.deaths,imported:t.imported,community:t.community},tested:t.tested})}function deleteReport(e){console.log(selected),e.preventDefault();let t=e.target.elements;deleteData({id:selected,password:t.password})}function getData(){let e=getReports();displayLineChart(e);let t=e.reverse()[0];displayMedia(e),displayPieChart(t),displayLastRecord(t)}function main(){M.Tabs.init(document.querySelector(".tabs"));M.Modal.init(document.querySelector("#addModal")),M.Modal.init(document.querySelector("#deleteModal"),{onOpenStart:function(){document.querySelector("#selected").innerHTML=selected}});document.forms.createForm.addEventListener("submit",createReport),document.forms.deleteForm.addEventListener("submit",deleteReport),getData(),fixAccessbility(),registerSW()}window.addEventListener("load",main);