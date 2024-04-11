import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const wrap = document.querySelector(".wrap")
const searchInput = document.querySelector(".search_input")
const searchForm = document.querySelector(".search_form")
let search;
let page = 1
const moreBtn = document.querySelector(".add")
let perPage = 12
let isFirst = true
const fetchUrl = async (search, page) => {
    try {
    const response = await fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${search}&page=${page}&per_page=${perPage}&key=43135945-0fa309f6e906fbaa5e36dac33`);
    const images = await response.json();
    console.log(images);
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
        return `<img src=${obj.webformatURL}>`
    })
    wrap.insertAdjacentHTML("beforeend", markUp.join(""))
}