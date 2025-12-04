// Dark Mode
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// Focus & keypad
let activeInput = null;
const keypad = document.getElementById("customKeyboard");
document.querySelectorAll("input").forEach(inp=>{
  inp.addEventListener("click",()=>{
    activeInput = inp;
    keypad.style.display="block";
  });
});
keypad.querySelectorAll("button[data-val]").forEach(btn=>{
  btn.onclick=()=>{ if(activeInput) activeInput.value+=btn.dataset.val; };
});
keypad.querySelector(".del").onclick=()=>{ if(activeInput) activeInput.value = activeInput.value.slice(0,-1); };
keypad.querySelector(".ok").onclick=()=> keypad.style.display="none";

// Calc
document.getElementById("chipForm").onsubmit = e => {
  e.preventDefault();
  const A = parseFloat(document.getElementById("playerA").value||0);
  const B = parseFloat(document.getElementById("playerB").value||0);
  const C = parseFloat(document.getElementById("playerC").value||0);
  const pool = parseFloat(document.getElementById("pool").value||0);

  const scores = {A,B,C};
  const results = {};
  for(const k in scores) results[k] = scores[k]*pool;

  document.getElementById("resultBody").innerHTML =
    Object.entries(results).map(([k,v])=>`${k}: ${v.toFixed(2)}`).join("<br>");

  // payments simple: who pays who difference from avg
  const avg = (results.A+results.B+results.C)/3;
  const bal = {
    A: results.A-avg,
    B: results.B-avg,
    C: results.C-avg
  };

  let payHTML="";
  const arr = Object.entries(bal).sort((a,b)=>a[1]-b[1]);
  let i=0,j=arr.length-1;
  while(i<j){
    const owe = -arr[i][1];
    const recv = arr[j][1];
    const amt = Math.min(owe,recv);
    if(amt>0) payHTML+=`${arr[i][0]} → ${arr[j][0]}: ${amt.toFixed(2)}<br>`;
    arr[i][1]+=amt; arr[j][1]-=amt;
    if(arr[i][1]>=0) i++;
    if(arr[j][1]<=0) j--;
  }
  document.getElementById("paymentDetails").innerHTML = payHTML;
  document.getElementById("resultSection").style.display="block";
};
