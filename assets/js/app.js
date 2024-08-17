/* Koden er sgu ikke ligeså pæn som i går, men kom sgu lidt tii at slette det og har ingen backup på Github lol */

let todoPages = []
let currentPage = 0

const loadTodo = () => {
    todoPages = JSON.parse(localStorage.getItem("todo"))
}

const saveTodo = () => {
    localStorage.setItem("todo", JSON.stringify(todoPages))
}

loadTodo()

const pageContainer = document.querySelector("#page-container")
const todoTitle = document.querySelector("#todo-title")
const todoContainer = document.querySelector("#todo-container")

const setCurrentPage = (i) => {
    if (!todoPages[i]) return

    currentPage = i

    todoContainer.innerHTML = ""

    const page = todoPages[i]

    todoTitle.value = page.title
    todoTitle.addEventListener("change", (e) => {
        page.title = e.target.value
        saveTodo()
    })

    page.items.forEach((item) => {
        const element = document.createElement("div")
        element.classList.add("todo-item")

        element.innerHTML = `
            <input type="checkbox" ${item.checked ? "checked" : ""} />
            <input type="text" value="${item.text}"></input>
        `

        element.children[0].addEventListener("click", (e) => {
            item.checked = e.target.checked
            saveTodo()
        })

        element.children[1].addEventListener("change", (e) => {
            item.text = e.target.value
            saveTodo()
        })

        const removeItem = (e) => {
            if (e.target.value) return

            const index = page.items.indexOf(item)
            if (index > -1) {
                page.items.splice(index, 1)
            }

            if (page.items.length == 0) {
                const pageIndex = todoPages.indexOf(page)
                if (pageIndex > -1) {
                    todoPages.splice(pageIndex, 1)
                }

                setupPageContainer()
                setCurrentPage(0)
            } else {
                setCurrentPage(currentPage)
            }

            saveTodo()
        }

        element.children[1].addEventListener("focusout", removeItem)
        element.children[1].addEventListener("keyup", function (e) {
            if (e.key === "Enter") {
                removeItem(e)
            }
        })

        todoContainer.appendChild(element)
    })
}

const addItem = (e) => {
    if (!e.target.value) return

    todoPages[currentPage].items.push({
        checked: false,
        text: e.target.value,
    })

    e.target.value = ""

    saveTodo()
    setCurrentPage(currentPage)
}

document.querySelector("#add-item").addEventListener("focusout", addItem)
document.querySelector("#add-item").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        addItem(e)
    }
})

const addPage = (e) => {
    if (!e.target.value) return

    todoPages.push({
        title: e.target.value,
        items: [
            {
                checked: false,
                text: "Buy more apple juice",
            },
        ],
    })

    currentPage = todoPages.length - 1

    e.target.value = ""

    saveTodo()
    setupPageContainer()
    setCurrentPage(currentPage)

    const input = todoContainer.children[0].children[1]

    if (!input) return

    input.focus()
    const strLen = input.value.length
    input.setSelectionRange(strLen, strLen)
}

document.querySelector("#add-page").addEventListener("focusout", addPage)
document.querySelector("#add-page").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        addPage(e)
    }
})

setCurrentPage(0)

const setupPageContainer = () => {
    pageContainer.innerHTML = ""

    todoPages.forEach((page, i) => {
        const button = document.createElement("button")

        button.innerHTML = `
            <i class="fa-solid fa-file"></i> ${page.title}
        `

        button.addEventListener("click", () => setCurrentPage(i))

        pageContainer.appendChild(button)
    })
}

setupPageContainer()
