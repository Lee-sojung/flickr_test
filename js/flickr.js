/*
https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value

flickr.interestingness.getList

1ea09af8cbfa636469cabf6280b01b71
*/

const main = document.querySelector("main");
const frame = document.querySelector("#list");
const loading = document.querySelector(".loading");
const input = document.querySelector("#search");
const btnSearch =document.querySelector("#btnSearch");

const  base = "https://www.flickr.com/services/rest/?";
const method1 = "flickr.interestingness.getList";
const method2 = "flickr.photos.search";
const api_key = "1ea09af8cbfa636469cabf6280b01b71";
const per_page = 50;
const format = "json";

const url1 = `${base}method=${method1}&api_key=${api_key}&per_page=${per_page}&format=${format}&nojsoncallback=1`;





callData(url1);

btnSearch.addEventListener("click", e=>{
   let tag = input.value;

   const url2 = `${base}method=${method2}&api_key=${api_key}&per_page=${per_page}&format=${format}&nojsoncallback=1&privacy_filter=1&tags=${tag}`;

   callData(url2);
})

input.addEventListener("keypress", e=>{
   if(e.key =="Enter"){
      let tag = input.value;

      const url2 = `${base}method=${method2}&api_key=${api_key}&per_page=${per_page}&format=${format}&nojsoncallback=1&privacy_filter=1&tags=${tag}`;
   
      callData(url2);
   }
})

//팝업생성
frame.addEventListener("click", e=>{
   e.preventDefault();

   if(e.target !== e.target.closest(".item").querySelector(".thumbnail")) return;

   let target = e.target.closest(".item");
   let imgSrc = target.querySelector("a").getAttribute("href");

   let pop = document.createElement("aside");
   let pops = `
               <img src="${imgSrc}">
               <span class="close">CLOSE</span>
            `;
   
   pop.innerHTML = pops;
   document.querySelector("main").append(pop);
})

//팝업닫기버튼 클릭이벤트
main.addEventListener("click", e=>{

   let pop = main.querySelector("aside");
   let close = pop.querySelector(".close");
      
   if(e.target == close) pop.remove();

})

function callData(url){

   frame.innerHTML = "";
   loading.classList.remove("off");
   frame.classList.remove("on");


   fetch(url)
   .then(data=>{
   let result = data.json();
   return result;
   })
   .then(json=>{
   let items = json.photos.photo;

   createList(items);
   delayLoading();
   

   })
}


function createList(items){
   let htmls = "";
   
   items.forEach(data=>{

      //https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg

      let imgSrcBig = `https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_b.jpg`

      let imgSrc = `https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_m.jpg`

      htmls +=`
            <li class="item">
               <div>
                  <a href="${imgSrcBig}">
                     <img class="thumbnail" src="${imgSrc}">
                  </a>
                  <p>${data.title}</p>
                  <span>
                     <img class="profile" src="http://www.flickr.com/buddyicons/${data.owner}.jpg">
                     <strong>${data.owner}</strong>
                  </span>
               </div>
            </li>   
         `;
   })

   frame.innerHTML = htmls;
}

function delayLoading(){
   const imgs = frame.querySelectorAll("img");
   const len = imgs.length;
   let count = 0;
   //이미지 한장씩 로딩되면 0++ (겹침에러 수정)
   for(let el of imgs){
      el.onload = ()=>{
         count++;
         if(count === len) isoLayout();
      }

      let thumb = el.closest(".item").querySelector(".thumbnail");
      el.onerror = e=>{
         e.currentTarget.closest(".item").querySelector(".thumbnail").setAttribute("src", "k1.jpg");
      }

      let profile = el.closest(".item").querySelector(".profile");
      profile.onerror = e=>{
         e.currentTarget.closest(".item").querySelector(".profile").setAttribute("src", "https://www.flickr.com/images/buddyicon.gif")
      }
   }
}

function isoLayout(){
   loading.classList.add("off");
   frame.classList.add("on");

   new Isotope("#list", {
      itemSelector : ".item",
      columnWidth : ".item",
      transitionDuration : "0.5s"
   })
}