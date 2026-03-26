async function loadTimings(){
const res = await fetch("/api/timings");
const data = await res.json();
const table = document.getElementById("timingTable");
data.forEach(t => {
table.innerHTML += `
<tr>
<td>Daily</td>
<td>${t.temple_opening}</td>
<td>${t.temple_closing}</td>
</tr>
`;
});
}

loadTimings();