import { menuArray } from "./data.js";
import {v4 as uuidv4} from 'https://jspm.dev/uuid';

const itemsEl = document.getElementById("items")
const checkoutSectionEl = document.getElementById("checkout-section")
const checkoutItemsEl = document.getElementById("checkout-items")
const checkoutTotalPriceEl = document.getElementById("checkout-total-price")
const modalContainerEl = document.getElementById("modal-container")
const modalFormEl = document.getElementById("modal-form")

const orderStatusSection = document.getElementById("order-status-section")
const orderStatusMessage = document.getElementById("order-status-message")


// Obviously I would never store PII to localstorage in this manner. This is just a mockup

// let userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : null;
// let userCc = localStorage.getItem('userCc') ? localStorage.getItem('userCc') : null;
// let userCvv = localStorage.getItem('userCvv') ? localStorage.getItem('userCvv') : null;



let order = []

document.addEventListener("click", (e)=>{
  // Logic for multiple items should go here after refactor
  if(e.target.dataset.addId){
    const item = menuArray.filter(item=>String(item.id) === e.target.dataset.addId)[0]
    item.uuid = uuidv4()
    order.push(item)
    console.log (order)
    render()
  }
  else if(e.target.dataset.removeUuid){
    const uuid = e.target.dataset.removeUuid
    order.splice(order.findIndex(e => e.uuid === uuid), 1);
    render()
  }
  else if(e.target.id === "purchase-btn" || e.target.id === "purchase-btn-text"){
    purchaseBtnClick()
  }
  else if(e.target.id === "pay-btn" || e.target.id === "pay-btn-text"){
    payBtnClick(e)
  }
  else if(modalContainerEl.style.display === "flex" && e.target.id === "modal-container"){
    modalContainerEl.style.display = "none"
  }
})

modalFormEl.addEventListener("submit", (e) => {
  e.preventDefault()
  let userName = modalFormEl.querySelector('input[name="userName"]').value
  clearAll()
  showSuccessMessage(userName)
})

// region Switches

// Simple css to style it like a toggle switch
// Tutorial:
// https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8

const modeToggleSwitch = document.querySelector('#mode-checkbox');
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    modeToggleSwitch.checked = true;
  }
}

modeToggleSwitch.addEventListener('change', switchTheme, false);

function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark'); //add this
  }
  else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light'); //add this
  }
}
// endregion

function showSuccessMessage(userName){
  orderStatusMessage.innerText = `Thanks, ${userName}! Your order is on its way!`
  orderStatusSection.style.display = "flex"
}

function clearAll(){
  order = []
  checkoutSectionEl.style.display = "none"
  modalContainerEl.style.display = "none"
  render()
}

function payBtnClick(){
  document.forms[0].submit()
}

function purchaseBtnClick(){
  modalContainerEl.style.display = "flex"
}

function render(){
  renderMenuItems()
  renderOrderOverview()
}

function renderMenuItems(){
  let menuItems = ''
  for (let item of menuArray){
    let itemDescription = ''
    for (let ingredient of item.ingredients){
      itemDescription += `${ingredient}, `
    }
    menuItems += `
    <div class="item">
      <div class="item-title">${item.name}</div>
      <div class="item-graphic">${item.emoji}</div>
      <div class="item-description">${itemDescription}</div>
      <div class="item-price">$${item.price}</div>
      <div class="item-add-btn" data-add-id="${item.id}">
        <p class="item-add-btn-text" data-add-id="${item.id}">+</p>
      </div>
    </div>
  `
  }
  itemsEl.innerHTML = menuItems
}

function renderOrderOverview(){
  let orderHtml = ''
  let total = 0

  if(order.length > 0){
    for(let item of order){
      orderHtml += `
        <div class="checkout-item">
          <p class="checkout-item-name">${item.name}</p>
          <p class="remove-item-btn" data-remove-uuid="${item.uuid}">remove</p>
          <p class="checkout-item-price">$${item.price}</p>
        </div>
      `
      total += item.price

    }
    checkoutTotalPriceEl.innerText = `$${total}`
    checkoutItemsEl.innerHTML = orderHtml
    checkoutSectionEl.style.display = "block"
  } else {
    checkoutItemsEl.innerHTML = ""
    checkoutSectionEl.style.display = "none"
  }

}




render()