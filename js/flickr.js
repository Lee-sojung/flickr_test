/*
https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value

flickr.interestingness.getList

1ea09af8cbfa636469cabf6280b01b71
*/

class Flickr{
   constructor(){
      this.main = document.querySelector("main");
      this.frame = document.querySelector("#list");
      this.loading = document.querySelector(".loading");
      this.input = document.querySelector("#search");
      this.btnSearch =document.querySelector("#btnSearch");

      this.base = "https://www.flickr.com/services/rest/?";
      this.method1 = "flickr.interestingness.getList";
      this.method2 = "flickr.photos.search";
      this.api_key = "1ea09af8cbfa636469cabf6280b01b71";
      this.per_page = 50;
      this.format = "json";

      this.url1 = `${this.base}method=${this.method1}&api_key=${this.api_key}&per_page=${this.per_page}&format=json&nojsoncallback=1`;





   this.callData(this.url1);

   this.btnSearch.addEventListener("click", e=>{
      let tag = this.input.value;

      const url2 = `${this.base}method=${this.method2}&api_key=${this.api_key}&per_page=${this.per_page}&format=json&nojsoncallback=1&privacy_filter=1&tags=${tag}`;

      this.callData(this.url2);
   })

   this.input.addEventListener("keypress", e=>{
      if(e.key =="Enter"){
         let tag = this.input.value;

         const url2 = `${this.base}method=${this.method2}&api_key=${this.api_key}&per_page=${this.per_page}&format=json&nojsoncallback=1&privacy_filter=1&tags=${tag}`;
   
         this.callData(url2);
      }
   })

//팝업생성
this.frame.addEventListener("click", e=>{
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
this.main.addEventListener("click", e=>{

      let pop = this.main.querySelector("aside");
      let close = pop.querySelector(".close");
      
      if(e.target == close) pop.remove();

   })


   }
   callData(url){

      this.frame.innerHTML = "";
      this.loading.classList.remove("off");
      this.frame.classList.remove("on");
   
   
      fetch(url)
      .then(data=>{
      let result = data.json();
      return result;
      })
      .then(json=>{
      let items = json.photos.photo;
   
      this.createList(items);
      this.delayLoading();
      
   
      })
   }
   
   createList(items){
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
   
      this.frame.innerHTML = htmls;
   }
   
   delayLoading(){
      const imgs = this.frame.querySelectorAll("img");
      const len = imgs.length;
      let count = 0;
      //이미지 한장씩 로딩되면 0++ (겹침에러 수정)
      for(let el of imgs){
         el.onload = ()=>{
            count++;
            if(count === len) this.isoLayout();
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
   
   isoLayout(){
      this.loading.classList.add("off");
      this.frame.classList.add("on");
   
      new Isotope("#list", {
         itemSelector : ".item",
         columnWidth : ".item",
         transitionDuration : "0.5s"
      })
   }
};





