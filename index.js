const wrap = document.querySelector(".wrap")
const searchInput = document.querySelector(".search_input")
const page = 1
let search;
const moreBtn = document.querySelector(".add")
let perPage = 12
let url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${search}&page=${page}&per_page=${perPage}&key=43135945-0fa309f6e906fbaa5e36dac33`
function fetchUrl(url){
    const data = fetch(url)
    return data
}
moreBtn.addEventListener("click",addPages)
function addPages() {
    page ++
    MarkUp(data)
}
searchInput.addEventListener("change", onSearch)
function onSearch(){
    search = searchInput.value
    let url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${search}&page=${page}&per_page=12&key=43135945-0fa309f6e906fbaa5e36dac33`
    fetchUrl(url).then((response) => response.json()).then((data) => {
        MarkUp(data.hits)
    })
    searchInput.removeEventListener("change", onSearch)
}

function MarkUp(data){
    const markUp = data.map((obj) => {
        return `<img src=${obj.webformatURL}>`
    })
    wrap.insertAdjacentHTML("beforeend", markUp.join(""))
}