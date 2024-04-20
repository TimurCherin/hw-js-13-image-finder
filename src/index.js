import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const wrap = document.querySelector(".wrap")
const searchInput = document.querySelector(".search_input")
const searchForm = document.querySelector(".search_form")
const body = document.querySelector("body")
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
    searchForm.reset()
}
function MarkUp(data){
    const markUp = data.map((obj) => {
        return `<img alt="${obj.tags}" data-id="${obj.id}" src=${obj.webformatURL}>`
    })
    wrap.insertAdjacentHTML("beforeend", markUp.join(""))
}

wrap.addEventListener("click", openModal)
function openModal(e){
    if(e.target.nodeName === "IMG"){
        document.querySelector("html").classList.add("no_scroll")
        const imgId = e.target.dataset.id
        console.log(document.querySelector(".backdrop"))
        fetchImage(imgId)
        body.addEventListener("keydown", onEscape)
        // console.log(document.querySelector(".backdrop"))
        document.querySelector(".backdrop").addEventListener("click", onBackdrop)
    }
}
    const fetchImage = async (id) => { 
        try {
        const response = await fetch(`https://pixabay.com/api?id=${id}&key=43135945-0fa309f6e906fbaa5e36dac33`);
        const images = await response.json();
        ModalMarkUp(images.hits[0])
        return images.hits[0]
        } catch (error) {
        console.log(error.message);
        }
        };

        function ModalMarkUp(obj){
            const markUp = `
            <div class="backdrop">
        <div class="modal">
            <img class="modal_img" src=${obj.webformatURL} alt="${obj.tags}">
            <p class="photo_description">${obj.tags}</p>
        </div>
    </div>
            `
            body.insertAdjacentHTML("afterbegin", markUp)
        }

        function onEscape(e){
            if(e.code === "Escape"){
                document.querySelector(".backdrop").remove()
                body.removeEventListener("keydown", onEscape)
                document.querySelector("html").classList.remove("no_scroll")
                body.removeEventListener("keydown", onEscape)
            }
        }

        function onBackdrop(e){
            console.log(e.target.nodeName)
            if(e.target.nodeName === "backdrop"){
                document.querySelector(".backdrop").remove()
                body.removeEventListener("keydown", onEscape)
                document.querySelector("html").classList.remove("no_scroll")
                document.querySelector(".backdrop").removeEventListener("click", onBackdrop)
            }
        }