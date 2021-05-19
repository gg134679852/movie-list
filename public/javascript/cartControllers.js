const cartItemPanel = document.querySelector('#cartItemPanel')

cartItemPanel.addEventListener('click',(e)=>{
  if (e.target.closest('#add')){
    if (e.target.nextElementSibling.innerText === "5"){
      alert('達到購買上限')
    }
    axios
    .post(`/cartItem/${e.target.closest('#itemCard').dataset.id}/add`)
    .then(()=>{
      let quantity = e.target.nextElementSibling
      let totalPrice = document.querySelector('#totalPrice').lastElementChild
      let newQuantity = Number(quantity.innerText)
      let newTotalPrice = Number(totalPrice.innerText)

      quantity.innerHTML = newQuantity += 1
      totalPrice.innerText = newTotalPrice += 250
    })
  }
  if (e.target.closest('#sub')) {
    axios
      .post(`/cartItem/${e.target.closest('#itemCard').dataset.id}/sub`)
      .then(() => {
        let quantity = e.target.previousElementSibling
        let totalPrice = document.querySelector('#totalPrice').lastElementChild
        let newQuantity = Number(quantity.innerText)
        let newTotalPrice = Number(totalPrice.innerText)

        quantity.innerHTML = newQuantity -= 1
        totalPrice.innerText = newTotalPrice -= 250
      })
  }
  if (e.target.closest('#del')) {
    axios
      .delete(`/cartItem/${e.target.closest('#itemCard').dataset.id}`)
      .then(() => {
        if (document.querySelector('#cartItemPanel').childElementCount === 1) {
          e.target.closest('#cart').remove()
        }
        e.target.closest('#itemCard').remove()
      })
  }
})
