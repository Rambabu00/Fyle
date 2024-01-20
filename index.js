
 //main container
 const container= document.getElementById("container")
 let pageNumber=1;
  
async function getUser(){
    // will clear the container
    container.innerHTML=""
    try {
        // input value from the user
        let inputVal= document.getElementById("searchTxt").value;
        // value is not entered by user
        if(!inputVal){
            alert("Make sure input field is not empty...!")
        }
        // user entered value
        else{
             container.innerHTML=`<div class="loader"></div>`
             //fetch the github api based on user entered userName 
           let response= await fetch(`https://api.github.com/users/${inputVal}`);
           let data=await response.json();
           //data url is not exist or data.message is exist it means there is no user having this userName
           if(!data.url || data.message){
           alert("Username is not exists");
           container.innerHTML=""
           }
           // if userName exist will render the profile
           else {
           await renderprofile(data);
           
           }
    
        }
    } catch (error) {
        console.log(error);
        container.innerHTML="Error...! please Try Again...!"
    }
} 
// this is render profile
async function renderprofile(data){
 try {
    // now we appending the data
    container.innerHTML=`    
    <div class="header-container">
 
    <div class="profile">
      <div class="image">
          <img alt="profile-pic" src=${data.avatar_url}/>
      </div>
      <div class="about">
          <h2>${data.name? data.name : "Name unavailable"}</h2>
          <p>${data.bio? data.bio: "Bio unavailable"}</p>
          <p><img src="./location.png" width="17px" height="17px" alt="location"/>${data.location? data.location: "Location unavailable"}</p>
          <p>Twitter: ${data.twitter_username?data.twitter_username:"Twitter unavailable"}</p>
      </div>  
    </div>
    <div class="link">
      <img src="./link.png" width="17px" height="17px"></img>
      <a href=${data.html_url}>${data.html_url}</a>
  
  </div>
   </div>
   <input class="search" type="text" id="search" placeholder="Search By Title " onkeyup="search()"></input>
   <div class="body-container" id="body-container">
    
   </div>
   <div class="footer-container" id="footer">

   </div>
   `
document.getElementById("body-container").innerHTML=`<div class="loaderContainer"><div class="loader"></div><p>Fteching repos...</p></div>`
let response= await fetch(`${data.repos_url}`);
let repoData=await response.json();
console.log(repoData)
// this is a pagination function call
await renderPagination(repoData.length,data.login);
const pagination=document.getElementById("footer")
const pageLinks = pagination.querySelectorAll('span');
pageLinks[0].classList.add("active")
 await renderRepositories(repoData,1)
 } catch (error) {
    container.innerHTML="Error...! please Try Again...!"
 }
 
     
}
// render the page number by using total number of repos
async function renderPagination(length, username){
    
    const pagination=document.getElementById("footer")
    pagination.innerHTML = '';
    const itemsPerPage = 10; // Default number of repositories per page
    const totalPages = Math.ceil(length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('span');
        pageLink.textContent = i;
        pageLink.addEventListener('click', (event) => handlePageClick(i, itemsPerPage, username,event));
        pagination.appendChild(pageLink);
    }
        
    
}
// particular repo having languages orlanguages are  used github user in there repo
async function repoLanguage(url){
    let response = await fetch(`${url}`)
    let obj= await response.json();
     let arr= Object.keys(obj);
     return arr
}
// page number function
async function handlePageClick(pagenumber, itemsPerPage, username,event) {
    document.getElementById("body-container").innerHTML=`<div class="loaderContainer"><div class="loader"></div><p>Fteching repos...</p></div>`
    // Fetch repositories based on the selected page
    pageNumber=pagenumber;
       document.getElementById("")
        const response = await fetch(`https://api.github.com/users/${username}/repos?page=${pagenumber}&per_page=${itemsPerPage}`);
        const data = await response.json();
         
        const pagination=document.getElementById("footer")
        const pageLinks = pagination.querySelectorAll('span');
        pageLinks.forEach(link => link.classList.remove('active'));

        // Add active class to the clicked page number
        event.target.classList.add('active');
        renderRepositories(data);
     
}
// render the repositories based on the page number clicked
async function renderRepositories(data, pageNumber){
     
if(pageNumber===1){
    data=data.slice(0,10)
    
}
 
    document.getElementById("body-container").innerHTML=""
    data.forEach(async repo => {
        let arr=await repoLanguage(repo.languages_url);
        console.log(arr)
        const repoElement = document.createElement('div');
        repoElement.classList.add("repo")
        repoElement.innerHTML = `
        <h4>${repo.name}</h4> 
        <p>${repo.description?repo.description:"No description"}</p>
        `;
         if(arr.length===0){
            let span=document.createElement('span');
            span.innerHTML="No languages"
         }
         else{
            let div=document.createElement('div');
            div.classList.add("languages")
            arr.forEach(val=>{
                let span=document.createElement('div')
                span.innerHTML=val
                div.appendChild(span)
                repoElement.appendChild(div)
            })
         }
        document.getElementById("body-container").appendChild(repoElement);
        });         
}
async function search(){
    let searchVal=document.getElementById("search").value
let repo=document.getElementById("body-container");
let repoList=repo.querySelectorAll('.repo');
repoList.forEach(repo=>{
let textVal=repo.childNodes[1].innerHTML;
if (textVal.toLowerCase().indexOf(searchVal.toLowerCase()) > -1) {
    repo.style.display = "";
} else {
    repo.style.display = "none";
}
})
    
}
 