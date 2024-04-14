import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const wrap = document.querySelector(".wrap")
const searchInput = document.querySelector(".search_input")
const searchForm = document.querySelector(".search_form")
const backdrop = document.querySelector(".backdrop")
let search;
let page = 1
const moreBtn = document.querySelector(".add")
let perPage = 12
let isFirst = true
const fetchUrl = async (search, page) => {
    try {
    const response = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${search}&page=${page}&per_page=${perPage}&key=43135945-0fa309f6e906fbaa5e36dac33`);
    const images = await response.json();
    return images
    } catch (error) {
    console.log(error.message);
    }
    };
    
async function getImages(search, page){
    const data = await fetchUrl(search, page)
    if(isFirst){
        iziToast.success({
            message: `Ви отримали ${data.totalHits} зображень`,
            position: 'topRight'
          });
        if(data.totalHits > perPage){
            moreBtn.classList.remove("hide") 
        }
    }
    if(data.totalHits/perPage <= page){
        moreBtn.classList.add("hide")
        iziToast.info({
            message: `Ви отримали усі зображення`,
            position: 'topRight'
          });
    }
    MarkUp(data.hits)
}

moreBtn.addEventListener("click",addPages)
function addPages() {
    isFirst = false
    page ++
    getImages(search, page)
}
searchForm.addEventListener("submit", onSearch)
async function onSearch(e){
    e.preventDefault()
    page = 1
    moreBtn.classList.remove("hide")
    search = e.target.elements.search.value
    wrap.innerHTML = ""
    isFirst = true
    await getImages(search, 1)
}
function MarkUp(data){
    const markUp = data.map((obj) => {
        console.log(obj)
        return `<img alt="${obj.tags}" data-id="${obj.id}" src=${obj.webformatURL}>`
    })
    wrap.insertAdjacentHTML("beforeend", markUp.join(""))
}

wrap.addEventListener("click", openModal)
function openModal(e){
    if(e.target.nodeName === "IMG"){
        document.querySelector("html").classList.add("no_scroll")
        const imgId = e.target.dataset.id
        const obj = fetchImage(imgId)
        console.log(333,obj)
        ModalMarkUp(obj)
    }
}
    const fetchImage = async (id) => { 
        try {
        const response = await fetch(`https://pixabay.com/api?id=${id}&key=43135945-0fa309f6e906fbaa5e36dac33`);
        const images = await response.json();
        console.log("1222",images.hits[0])
        return images.hits[0]
        } catch (error) {
        console.log(error.message);
        }
        };

        function ModalMarkUp(obj){
            const markUp = `
            <div class="backdrop">
        <div class="modal">
            <img class="modal_img" src=${obj.pageURL} alt="${obj.tags}">
            <p class="photo_description">${obj.tags}</p>
        </div>
    </div>
            `
            document.querySelector("body").insertAdjacentHTML("beforeend", markUp)
        }