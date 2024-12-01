const imgsDiv = document.getElementById("imgs")
const mainImg = document.getElementById("mainImg")
const divText = document.getElementById("divText")
const minusButton = document.getElementById("minusButton")
const plusButton = document.getElementById("plusButton")
const count = document.getElementById("count")
const searchInput = document.getElementById("searchInput")
const modalProducts = document.getElementById("modalProducts")
const modal = document.getElementById("modal")
const esas = document.getElementById("esas")
const main = document.getElementById("main")
const modalText = document.getElementById("modalText")
const closeButton = document.getElementById("closeButton")
const categoryProduct = document.getElementById("categoryProduct")
const addButton = document.getElementById("addButton")

const accessToken = ""

let countText = Number(count.innerText)

const getAllProduct = async () => {
    const response = await fetch("http://localhost:3000/api/products", {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })
    
    const data = await response.json()
    // createModalProduct(data)
    console.log(data)

    searchInput.addEventListener("click", (e) => {
        modal.classList.remove("hidden")
        modal.classList.add("absolute")
        esas.classList.add("blurred")
        console.log(data);
        createModalProduct(data)
    })
        
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value
        modalText.innerText = searchTerm
        console.log(searchTerm);
        searchTerm && searchProduct(searchTerm)
    })

    closeButton.addEventListener("click",() => {
        modal.classList.add("hidden")
        modal.classList.remove("absolute")
        esas.classList.remove("blurred")
        searchInput.value = ""
    })
    // console.log(data.products.gallery.length)

}

const getProduct = async (id) => {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })
    
    const data = await response.json()
    console.log(data)
    await start(data)

    addButton.addEventListener("click", ()=> {
        if(count.innerText > 0) {
            addBasket(data.product._id,count.innerText)
        }
    })

}

const start = (data) => {
    getImgs(data)
    getMainImg(data)
    getTexts(data)
    searchCategory(data.product.category,data.product._id)
}

const getImgs = (data) => {
    imgsDiv.innerHTML = "";
    
    for (let index = 1; index < data.product.gallery.length; index++) {
        if(index == 4) {
            const newimg = document.createElement("img")
            newimg.classList.add(
                "w-[170px]",
                "h-[138px]",
                "py-[22px]",
                "px-[18px]",
                "bg-[#F5F5F5]",
                "rounded",
                "mb-[16px]"
            );
            newimg.src = data.product.gallery[index]
            imgsDiv.appendChild(newimg) 
            break;
        }
        const newimg = document.createElement("img")
        newimg.classList.add(
            "w-[170px]",
            "h-[138px]",
            "py-[22px]",
            "px-[18px]",
            "bg-[#F5F5F5]",
            "rounded",
            "mb-[16px]"
        );
        newimg.src = data.product.gallery[index];
        console.log("Image URL:", data.product.gallery[index]);
        imgsDiv.appendChild(newimg)
    }
}


const getMainImg = (data) => {
    mainImg.innerHTML = ""
    mainImg.innerHTML =`<img src="${data.product.gallery[0]}" alt="" class="w-[500px] h-[600px] bg-[#F5F5F5] rounded px-[27px] pt-[154px] pb-[131px]">`
}

const getTexts = (data) => {
    let stockText = ""
    if(data.product.stock > 0) {
        stockText = "In Stock"
    }
    else{
        stockText = "No Stock"
    }

    divText.innerHTML = ""
    divText.innerHTML =  `<p class="inter font-semibold text-[24px]">${data.product.title}</p>
            <p class="poppins text-[14px] font-normal text-lime-400 border-l border-l-slate-400 pl-[16px] mt-[16px]">${stockText}</p>
            <p class="inter text-[24px] font-normal mt-[16px]">$${data.product.price}</p>
            <p class="poppins text-[14px] font-normal mt-[24px] pb-[24px] border-b border-l-slate-400">${data.product.description}</p>`
}



minusButton.addEventListener("click", () => {
    countText -= 1
    if(countText < 0) {
        countText = 0
    }
    count.innerText = String(countText)
})

plusButton.addEventListener("click", () => {
    countText += 1
    if(countText < 0) {
        countText = 0
    }
    count.innerText = String(countText)
})

const createModalProduct = (dataAll) => {
    modalProducts.innerHTML = ""
    for (let index = 0; index < dataAll.products.length; index++) {
        const div = document.createElement("div")
        const img = document.createElement("img")
        img.classList.add("w-[270px]", "h-[250px]", "bg-[#F5F5F5]", "rounded", "py-[35px]", "px-[40px]" , "cursor-pointer")
        img.src = dataAll.products[index].gallery[0]
        const p1 = document.createElement("p")
        p1.classList.add("poppins", "font-medium" , "text-[16px]", "mt-[16px]")
        p1.innerText = dataAll.products[index].title
        const p2 = document.createElement("p")
        p2.classList.add("poppins", "font-medium", "text-[16px]", "mt-[8px]", "text-[#DB4444]")
        p2.innerText = `$${dataAll.products[index].price}`
        div.appendChild(img)
        div.appendChild(p1)
        div.appendChild(p2)

        div.addEventListener("click", () => {
            const selectedProductId = dataAll.products[index]._id;
            getProduct(selectedProductId);
            modal.classList.add("hidden")
            modal.classList.remove("absolute")
            esas.classList.remove("blurred")
            searchInput.value = ""
        });

        modalProducts.appendChild(div)
        if(index == 7) {
            break;
        }
    }
}

const searchProduct = async (searchTerm) => {
    const response = await fetch (`http://localhost:3000/api/products?searchTerm=${searchTerm}`) 

    const data = await response.json()

    createModalProduct(data)
}


const categoryProducts = (data,mainProductId) => {

    categoryProduct.innerHTML = ""

    let count = 0
    for (let index = 0; index < data.products.length; index++) {
        if(data.products[index]._id == mainProductId) {
            index +=1
        }
        const div = document.createElement("div")
        const img = document.createElement("img")
        img.classList.add("w-[270px]", "h-[250px]", "bg-[#F5F5F5]", "rounded" ,"py-[35px]", "px-[40px]", "cursor-pointer")
        img.src = data.products[index].gallery[0]
        const p1 = document.createElement("p")
        p1.innerText = data.products[index].title
        p1.classList.add("poppins", "font-medium", "text-[16px]", "mt-[16px]")
        const p2 = document.createElement("p")
        p2.innerText = `$${data.products[index].price}`
        p2.classList.add("poppins", "font-medium", "text-[16px]", "mt-[8px]", "text-[#DB4444]")
        div.appendChild(img)
        div.appendChild(p1)
        div.appendChild(p2)

        div.addEventListener("click", () => {
            const selectedProductId = data.products[index]._id;
            getProduct(selectedProductId);
        });

        categoryProduct.appendChild(div)
        count+=1
        if(count == 4) {
            break;
        }
    }
}

const searchCategory = async (categoryTerm, mainProductId) => {
    const response = await fetch (`http://localhost:3000/api/products?category=${categoryTerm}`) 

    const data = await response.json()

    console.log(data);
    categoryProducts(data,mainProductId)
}

const addBasket = async (id,quantity) => {
    const response = await fetch(`http://localhost:3000/api/baskets/add`,{
        method: "POST",
        body: JSON.stringify({
            productId: id,
            quantity:quantity
        }),
        headers: {
            "Accept": `application/json`,
            "Content-Type": `application/json`,
            "Authorization": `Bearer ${accessToken}`
        }
    })
}

getProduct("67421eb2992589ea9af75192")
getAllProduct()