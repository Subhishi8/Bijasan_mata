async function loadComponents(){

const navbar = await fetch("components/navbar.html");
const navbarData = await navbar.text();
document.getElementById("navbar").innerHTML = navbarData;

const footer = await fetch("components/footer.html");
const footerData = await footer.text();
document.getElementById("footer").innerHTML = footerData;

}

loadComponents();